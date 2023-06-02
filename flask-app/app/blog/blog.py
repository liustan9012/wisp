from flask import jsonify, request
from flask_jwt_extended import jwt_required, current_user, get_current_user
from sqlalchemy import func, desc, asc, and_
from sqlalchemy.orm import joinedload

from app.models import Post, Comment, User, Tag, PostStatus, PostModel, CommentModel, TagModel
from app import db
from app.errors import ValidationDBError
from app.blog import bp

from app.auth import admin_required


@bp.route('/post', methods=['POST'])
@admin_required()
def new_post():
    req = PostModel(**request.json)
    user_id = current_user.id
    if req.slug and not req.slug.isdecimal():
        same_slug = Post.query.filter_by(slug=req.slug).first()
        if same_slug:
            raise ValidationDBError('Please use a different slug.')
    else:
        req.slug = None
    data = {**req.dict()}
    post_tags = data.pop('tags')
    new_post = Post(user_id=user_id, **data)
    db.session.add(new_post)
    if post_tags:
        tags = Tag.query.filter(Tag.id.in_([t['id'] for t in post_tags])).all()
        new_post.tags.extend(tags)
    db.session.commit()
    return jsonify(post=new_post.dict(),
                   tags=[t.dict() for t in new_post.tags],
                   msg='OK')


@bp.route('/post/<int:post_id>', methods=['POST'])
@admin_required()
def update_post(post_id):
    req = PostModel(**request.json)
    user_id = current_user.id
    if req.slug and not req.slug.isdecimal():
        same_slug = Post.query.filter_by(slug=req.slug).first()
        if same_slug and same_slug.id != post_id:
            raise ValidationDBError('Please use a different slug.')
    new_post = Post.query.filter_by(id=post_id).first()
    if new_post is None:
        raise ValidationDBError('Post is not exist.')
    if new_post.user_id != user_id:
        raise ValidationDBError('the post author is not the auth user.')
    data = {**req.dict()}
    post_tags = data.pop('tags')
    if post_tags:
        tags = Tag.query.filter(Tag.id.in_([t['id'] for t in post_tags])).all()
        new_post.tags = tags
    new_post.update(**req.dict())

    db.session.add(new_post)
    db.session.commit()
    return jsonify(post=new_post.dict(), msg='OK')


@bp.route('/post/<id_slug>', methods=['GET'])
def get_post(id_slug: str):
    if id_slug.isdecimal():
        p: Post = Post.query.filter_by(id=int(id_slug)).first()
    else:
        p: Post = Post.query.filter_by(slug=id_slug).first()
    if p is None:
        raise ValidationDBError('Post is not exist.')
    return jsonify(post=p.dict(),
                   tags=[t.dict() for t in p.tags],
                   comments=[c.dict() for c in p.comments],
                   msg='OK')


@bp.route('/posts', methods=['GET'])
@jwt_required(optional=True)
def get_post_list():
    user = get_current_user()
    if user is not None and user.is_admin:
        posts = Post.query.order_by(desc(Post.created_at)).all()
    else:
        posts = Post.query.filter_by(status=PostStatus.PUBLISHED).order_by(
            desc(Post.created_at)).all()
    return jsonify(posts=[p.dict() for p in posts], msg='OK')


@bp.route('/post/<int:post_id>/delete', methods=['POST'])
@admin_required()
def delete_post(post_id: int):
    p: Post = Post.query.filter_by(id=post_id).first()
    if Post is None:
        raise ValidationDBError('Post is not exist.')
    p.tags = []
    comments = Comment.query.filter_by(post_id=post_id).all()
    for c in comments:
        db.session.delete(c)
    db.session.delete(p)
    db.session.commit()

    return jsonify(detail=f'post "{p.title}" has been deleted', msg='OK')


@bp.route('/post/<int:post_id>/comment/add', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    user_id = current_user.id
    req = CommentModel(
        user_id=user_id,
        post_id=post_id,
        parent_id=request.json.get('parent_id'),
        content=request.json.get('content'),
    )
    p: Post = Post.query.filter_by(id=post_id).first()
    if p is None:
        raise ValidationDBError('the post is not exist.')
    if req.parent_id:
        c: Comment = Comment.query.filter_by(id=req.parent_id).first()
        if c is None:
            raise ValidationDBError('the parent comment is not exist.')
    new_comment = Comment(**req.dict())
    db.session.add(new_comment)
    db.session.commit()
    return jsonify(comment=new_comment.dict(), msg='OK')


@bp.route('/post/<int:post_id>/comments', methods=['GET'])
def post_comments(post_id):
    p: Post = Post.query.filter_by(id=post_id).first()
    if p is None:
        raise ValidationDBError('the post is not exist.')
    comments: list[Comment] = p.comments
    return jsonify(comments=[c.dict() for c in comments], msg='OK')


@bp.route('/comments', methods=['GET'])
@jwt_required()
def get_comments():
    if current_user.is_admin:
        comments: list[Comment] = Comment.query.all()
    else:
        comments: list[Comment] = Comment.query.filter_by(
            user_id=current_user.id).all()
    return jsonify(comments=[c.dict() for c in comments], msg='OK')


@bp.route('/comment/<int:comment_id>/delete', methods=['POST'])
@jwt_required()
def delete_comments(comment_id):
    c: Comment = Comment.query.filter_by(id=comment_id).first()
    if c is None:
        raise ValidationDBError('the comment is not exist.')
    # for r in c.children:
    #     r.parent_id = None
    #     db.session.add(r)
    db.session.delete(c)
    db.session.commit()
    return jsonify(comment={'id': comment_id}, msg='OK')


@bp.route('/tag', methods=['POST'])
@admin_required()
def new_tag():
    req = TagModel(**request.json, user_id=current_user.id)
    t: Tag = Tag.query.filter_by(name=req.name,
                                 user_id=current_user.id).first()
    if t is not None:
        raise ValidationDBError('please use a different name.')
    new_tag = Tag(**req.dict())
    db.session.add(new_tag)
    db.session.commit()
    return jsonify(msg='OK', tag=new_tag.dict())


@bp.route('/tag/<int:tag_id>/delete', methods=['POST'])
@admin_required()
def delete_tag(tag_id):
    t: Tag = Tag.query.filter_by(id=tag_id).first()
    if t is None:
        raise ValidationDBError('the tag is not exist.')
    if t.user_id != current_user.id and not current_user.is_admin:
        raise ValidationDBError('the tag user is not the signin user.')
    db.session.delete(t)
    db.session.commit()

    return jsonify(msg='OK')


@bp.route('/tag/<int:tag_id>', methods=['POST'])
@admin_required()
def edit_tag(tag_id):
    req = TagModel(**request.json, user_id=current_user.id)
    tag: Tag = Tag.query.filter_by(id=tag_id, user_id=current_user.id).first()
    if tag is None:
        raise ValidationDBError('the tag is not exist.')
    t: Tag = Tag.query.filter_by(name=req.name,
                                 user_id=current_user.id).first()
    if t is not None and t.id != tag.id:
        raise ValidationDBError('please use a different name.')
    tag.name = req.name
    db.session.add(tag)
    db.session.commit()
    return jsonify(msg='OK', tag=tag.dict())


@bp.route('/tag/<int:tag_id>', methods=['GET'])
@jwt_required(optional=True)
def tag(tag_id):
    tag: Tag = Tag.query.filter_by(id=tag_id).first()
    if tag is None:
        raise ValidationDBError('the tag is not exist.')
    tag_dict = tag.dict()
    user = get_current_user()
    if user is not None and user.is_admin:
        tag_dict['posts'] = [p.dict() for p in tag.posts]
    else:
        tag_dict['posts'] = [
            p.dict() for p in tag.posts if p.status == PostStatus.PUBLISHED
        ]

    return jsonify(msg='OK', tag=tag_dict)


@bp.route('/tags', methods=['GET'])
@admin_required()
def get_tags():
    tag_post_counts = db.session.query(
        Tag.id,Tag.name, Tag.created_at, User.username, func.count(Post.id)).\
                join(Tag.user).\
                join(Tag.posts, isouter= True ).\
                group_by(Tag.id).\
                all()
    tags: list[dict] = [{
        'id': id,
        'name': name,
        'created_at': created_at.timestamp(),
        'username': username,
        'post_count': count
    } for id, name, created_at, username, count in tag_post_counts]
    return jsonify(msg='OK', tags=tags)


@bp.route('/tags/posts', methods=['GET'])
def get_posts_tags():
    tag_post_counts = db.session.query(Tag.name, Tag.id , func.count(Post.id)).\
                join(Post.tags).\
                filter(Post.status==PostStatus.PUBLISHED).\
                group_by(Tag.id).\
                all()
    tags: list[dict] = [{
        'id': id,
        'name': name,
        'post_count': count
    } for name, id, count in tag_post_counts]
    return jsonify(msg='OK', tags=tags)


@bp.route('/home', methods=['GET'])
def home():
    posts = Post.query.filter_by(status=PostStatus.PUBLISHED).all()
    tag_post_counts = db.session.query(Tag.name, Tag.id ).\
                join(Post.tags).\
                filter(Post.status==PostStatus.PUBLISHED).\
                group_by(Tag.id).\
                all()
    tags: list[dict] = [{
        'id': id,
        'name': name,
        'post_count': count
    } for name, id, count in tag_post_counts]
    return jsonify(
        msg='OK',
        posts=[p.dict() for p in posts],
        tags=tags,
    )
