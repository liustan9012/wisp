from flask import jsonify, request
from flask_jwt_extended import current_user, get_current_user, jwt_required
from sqlalchemy import and_, asc, desc, func, or_, true
from sqlalchemy.orm import joinedload

from app import db
from app.auth import admin_required
from app.blog import bp
from app.errors import ValidationDBError
from app.models import (
    Comment,
    CommentModel,
    EnableComment,
    Post,
    PostModel,
    PostStatus,
    Tag,
    User,
    CommentPaginationModel,
    PaginationOrder,
    PostPaginationModel,
)


@bp.post("/post")
@admin_required()
def create_post():
    req = PostModel(**request.json)
    user_id = current_user.id
    if req.slug and not req.slug.isdecimal():
        same_slug = Post.query.filter_by(slug=req.slug).first()
        if same_slug:
            raise ValidationDBError("Please use a different slug.")
    else:
        req.slug = None
    data = {**req.dict()}
    post_tags = data.pop("tags")
    new_post = Post(user_id=user_id, **data)
    db.session.add(new_post)
    if post_tags:
        tags = Tag.query.filter(Tag.id.in_([t["id"] for t in post_tags])).all()
        new_post.tags.extend(tags)
    db.session.commit()
    return jsonify(
        post=new_post.dict(), tags=[t.dict() for t in new_post.tags], msg="OK"
    )


@bp.post("/post/<int:post_id>")
@admin_required()
def update_post(post_id):
    req = PostModel(**request.json)
    user_id = current_user.id
    if req.slug and not req.slug.isdecimal():
        same_slug = Post.query.filter_by(slug=req.slug).first()
        if same_slug and same_slug.id != post_id:
            raise ValidationDBError("Please use a different slug.")
    new_post: Post = Post.query.filter_by(id=post_id).first()
    if new_post is None:
        raise ValidationDBError("Post is not exist.")
    if new_post.user_id != user_id:
        raise ValidationDBError("the post author is not the auth user.")
    data = {**req.dict()}
    post_tags = data.pop("tags")
    if post_tags:
        tags = Tag.query.filter(Tag.id.in_([t["id"] for t in post_tags])).all()
        new_post.tags = tags
    new_post.update(**req.dict())

    db.session.add(new_post)
    db.session.commit()
    return jsonify(post=new_post.dict(), msg="OK")


@bp.get("/post/<id_slug>")
@jwt_required(optional=True)
def get_post(id_slug: str):
    user = get_current_user()
    if id_slug.isdecimal():
        p: Post = Post.query.filter_by(id=int(id_slug)).first()
    else:
        p: Post = Post.query.filter_by(slug=id_slug).first()
    if p is None:
        raise ValidationDBError("Post is not exist.")
    if p.status != PostStatus.PUBLISHED:
        if user is None or not user.is_admin:
            raise ValidationDBError("Post is not exist.")

    comments = []
    if p.enable_comment == EnableComment.ENABLE:
        comments = [c.dict() for c in p.comments]
    if p.enable_comment == EnableComment.DISABLE:
        if user is not None and (user.is_admin or p.user_id == user.id):
            comments = [c.dict() for c in p.comments]

    return jsonify(
        post=p.dict(),
        tags=[t.dict() for t in p.tags],
        comments=comments,
        msg="OK",
    )


@bp.get("/posts")
@jwt_required(optional=True)
def get_post_list():
    req_pagination = PostPaginationModel(**request.args)
    order_func = desc if req_pagination.order == PaginationOrder.DESC else asc

    user = get_current_user()
    if user is not None and user.is_admin:
        criteria = and_(true())
    else:
        criteria = and_(true(), Post.status == PostStatus.PUBLISHED)
    pagination = db.paginate(
        db.select(Post)
        .options(
            joinedload(Post.author),
            joinedload(Post.tags),
        )
        .where(criteria)
        .order_by(
            order_func(getattr(Post, req_pagination.order_by, req_pagination.order_by))
        ),
        page=req_pagination.page,
        per_page=req_pagination.per_page,
        max_per_page=50,
        error_out=False,
    )
    posts = [p.dict() for p in pagination.items]

    return jsonify(
        posts=posts,
        page=pagination.page,
        per_page=pagination.per_page,
        order=req_pagination.order,
        order_by=req_pagination.order_by,
        total=pagination.total,
        pages=pagination.pages,
        msg="OK",
    )


@bp.post("/post/<int:post_id>/delete")
@admin_required()
def delete_post(post_id: int):
    p: Post = Post.query.filter_by(id=post_id).first()
    if Post is None:
        raise ValidationDBError("Post is not exist.")
    p.tags = []
    comments = Comment.query.filter_by(post_id=post_id).all()
    for c in comments:
        db.session.delete(c)
    db.session.delete(p)
    db.session.commit()

    return jsonify(detail=f'post "{p.title}" has been deleted', msg="OK")


@bp.post("/post/<int:post_id>/comment/add")
@jwt_required()
def add_comment(post_id):
    user_id = current_user.id
    req = CommentModel(
        user_id=user_id,
        post_id=post_id,
        parent_id=request.json.get("parent_id"),
        content=request.json.get("content"),
    )
    p: Post = Post.query.filter_by(id=post_id).first()
    if p is None or p.status != PostStatus.PUBLISHED:
        raise ValidationDBError("the post is not exist.")
    if req.parent_id:
        c: Comment = Comment.query.filter_by(id=req.parent_id).first()
        if c is None:
            raise ValidationDBError("the parent comment is not exist.")
    new_comment = Comment(**req.dict())
    db.session.add(new_comment)
    db.session.commit()
    return jsonify(comment=new_comment.dict(), msg="OK")


@bp.get("/post/<int:post_id>/comments")
@jwt_required(optional=True)
def post_comments(post_id):
    p: Post = Post.query.filter_by(id=post_id).first()
    if p is None:
        raise ValidationDBError("the post is not exist.")
    if p.status != PostStatus.PUBLISHED:
        if current_user is None and not current_user.is_admin:
            raise ValidationDBError("the post is not exist.")
    else:
        comments: list[Comment] = p.comments
    return jsonify(comments=[c.dict() for c in comments], msg="OK")


@bp.get("/comments")
@jwt_required()
def get_comments():
    req_pagination = CommentPaginationModel(**request.args)
    order_func = desc if req_pagination.order == PaginationOrder.DESC else asc
    if current_user.is_admin:
        criteria = and_(true())
    else:
        criteria = and_(true(), Comment.c.user_id == current_user.id)
    pagination = db.paginate(
        db.select(Comment)
        .options(joinedload(Comment.user), joinedload(Comment.post))
        .where(criteria)
        .order_by(order_func(req_pagination.order_by)),
        page=req_pagination.page,
        per_page=req_pagination.per_page,
        max_per_page=50,
        error_out=False,
    )

    comments = [comment.dict() for comment in pagination.items]
    return jsonify(
        comments=comments,
        page=pagination.page,
        per_page=pagination.per_page,
        order=req_pagination.order,
        order_by=req_pagination.order_by,
        total=pagination.total,
        msg="OK",
    )


@bp.post("/comment/<int:comment_id>/delete")
@jwt_required()
def delete_comments(comment_id):
    c: Comment = Comment.query.filter_by(id=comment_id).first()
    if c is None:
        raise ValidationDBError("the comment is not exist.")
    if c.user_id != current_user.id or not current_user.is_admin:
        raise ValidationDBError("the user does not have permission to delete comment.")
    db.session.delete(c)
    db.session.commit()
    return jsonify(comment={"id": comment_id}, msg="OK")


@bp.get("/home")
def home():
    posts = Post.query.filter_by(status=PostStatus.PUBLISHED).all()
    tag_post_counts = (
        db.session.query(Tag.name, Tag.id)
        .join(Post.tags)
        .filter(Post.status == PostStatus.PUBLISHED)
        .group_by(Tag.id)
        .all()
    )
    tags: list[dict] = [
        {"id": id, "name": name, "post_count": count}
        for name, id, count in tag_post_counts
    ]
    return jsonify(
        msg="OK",
        posts=[p.dict() for p in posts],
        tags=tags,
    )
