from flask import jsonify, request
from flask_jwt_extended import current_user, get_current_user, jwt_required
from sqlalchemy import and_, asc, desc, func, or_
from sqlalchemy.orm import joinedload, selectinload, contains_eager

from app import db
from app.auth import admin_required
from app.blog import bp
from app.errors import ValidationDBError
from app.models import (
    Post,
    PostStatus,
    Tag,
    TagModel,
    User,
    Navlink,
    PaginationOrder,
    TagPaginationModel,
)


@bp.post("/tag")
@admin_required()
def create_tag():
    req = TagModel(**request.json, user_id=current_user.id)
    t: Tag = Tag.query.filter(
        Tag.name == req.name,
        Tag.user_id == current_user.id,
    ).first()
    if t is not None:
        raise ValidationDBError("please use a different name.")
    new_tag = Tag(**req.dict())
    db.session.add(new_tag)
    db.session.commit()
    return jsonify(msg="OK", tag=new_tag.dict())


@bp.post("/tag/<int:tag_id>/delete")
@admin_required()
def delete_tag(tag_id):
    t: Tag = Tag.query.filter_by(id=tag_id).first()
    if t is None:
        raise ValidationDBError("the tag is not exist.")
    db.session.delete(t)
    db.session.commit()
    return jsonify(msg="OK", tag_id=t.id)


@bp.post("/tag/<int:tag_id>")
@admin_required()
def edit_tag(tag_id):
    req = TagModel(**request.json, user_id=current_user.id)
    tag: Tag = Tag.query.filter_by(id=tag_id).first()
    if tag is None:
        raise ValidationDBError("the tag is not exist.")
    tag.name = req.name
    tag.content_type = req.content_type
    db.session.add(tag)
    db.session.commit()
    return jsonify(msg="OK", tag=tag.dict())


@bp.get("/tag/<int:tag_id>")
@jwt_required(optional=True)
def get_tag(tag_id):
    tag: Tag = Tag.query.filter_by(id=tag_id).first()
    if tag is None:
        raise ValidationDBError("the tag is not exist.")
    tag_dict = tag.dict()
    user: User = get_current_user()
    posts = []
    if user is not None and user.is_admin:
        posts = [p.dict() for p in tag.posts]
    else:
        posts = [p.dict() for p in tag.posts if p.status == PostStatus.PUBLISHED]

    tag_dict["posts"] = posts
    return jsonify(msg="OK", tag=tag_dict)


@bp.get("/tags")
@admin_required()
def get_tags():
    tags = db.session.execute(db.select(Tag).order_by(Tag.created_at)).scalars()
    return jsonify(
        tags=[t.dict() for t in tags],
        msg="OK",
    )


@bp.get("/tags/list")
@admin_required()
def get_tag_list():
    req_pagination = TagPaginationModel(**request.args)
    order_func = desc if req_pagination.order == PaginationOrder.DESC else asc

    pagination = db.paginate(
        db.select(
            Tag,
            User.username,
            func.count(Post.id).label("post_count"),
            func.count(Navlink.id).label("navlink_count"),
            func.count(Tag.id).label("total"),
        )
        .options(
            selectinload(Tag.user),
            selectinload(Tag.posts),
            selectinload(Tag.navlinks),
        )
        .outerjoin(Tag.user)
        .outerjoin(Tag.posts)
        .outerjoin(Tag.navlinks)
        .group_by(Tag.id, User.username)
        .order_by(
            order_func(getattr(Tag, req_pagination.order_by, req_pagination.order_by))
        ),
        page=req_pagination.page,
        per_page=req_pagination.per_page,
        max_per_page=50,
        error_out=False,
        # count = False,
    )
    tags = []
    for tag in pagination.items:
        tags.append(
            {
                **tag.dict(),
                "username": tag.user.username,
                "post_count": len(tag.posts),
                "navlink_count": len(tag.navlinks),
            }
        )
    return jsonify(
        tags=tags,
        page=pagination.page,
        per_page=pagination.per_page,
        order=req_pagination.order,
        order_by=req_pagination.order_by,
        total=pagination.total,
        msg="OK",
    )


@bp.get("/tags/posts")
@jwt_required(optional=True)
def get_posts_tags():
    user: User = get_current_user()
    if user is not None and user.is_admin:
        tag_post_counts = (
            db.session.query(Tag.name, Tag.id, func.count(Post.id))
            .join(Tag.posts, isouter=True)
            .group_by(Tag.id)
            .all()
        )
    else:
        tag_post_counts = (
            db.session.query(Tag.name, Tag.id, func.count(Post.id))
            .join(Tag.posts, isouter=True)
            .filter(Post.status == PostStatus.PUBLISHED)
            .group_by(Tag.id)
            .all()
        )
    tags: list[dict] = [
        {"id": id, "name": name, "post_count": count}
        for name, id, count in tag_post_counts
    ]
    return jsonify(msg="OK", tags=tags)
