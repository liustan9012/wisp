from datetime import datetime
from enum import Enum, IntEnum

from app import db
from .navlink import navlink_tags


class PostStatus(str, Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"
    PRIVATE = "PRIVATE"


class EnableComment(IntEnum):
    ENABLE = 1
    DISABLE = 2


post_tags = db.Table(
    "post_tags",
    db.Column("post_id", db.Integer, db.ForeignKey("posts.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
)


class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    slug = db.Column(db.String(50), unique=True)
    content = db.Column(db.Text, nullable=False)
    summary = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.now)
    status = db.Column(
        db.Enum(
            PostStatus,
        ),
        default=PostStatus.DRAFT,
    )
    enable_comment = db.Column(
        db.Enum(EnableComment, values_callable=lambda x: [str(e.value) for e in x]),
        default=EnableComment.DISABLE,
    )
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    author = db.relationship("User", back_populates="posts", lazy=True)
    comments = db.relationship("Comment", back_populates="post", lazy=True)
    tags = db.relationship(
        "Tag",
        secondary=post_tags,
        back_populates="posts",
        lazy=True,
    )

    def dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "content": self.content,
            "summary": self.summary,
            "created_at": self.created_at.timestamp(),
            "status": self.status,
            "enable_comment": self.enable_comment,
            "author": self.author.username,
            "tags": [t.dict() for t in self.tags],
        }

    def update(self, **data):
        self.title = data.get("title")
        self.slug = data.get("slug")
        self.content = data.get("content")
        self.summary = data.get("summary")
        self.status = data.get("status")
        self.enable_comment = data.get("enable_comment")


class Tag(db.Model):
    __tablename__ = "tags"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="tags", lazy=True)

    posts = db.relationship(
        "Post",
        secondary=post_tags,
        back_populates="tags",
        lazy=True,
    )
    navlinks = db.relationship(
        "Navlink",
        secondary=navlink_tags,
        back_populates="tags",
        lazy=True,
    )

    def dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.timestamp(),
            "user_id": self.user_id,
        }


class Comment(db.Model):
    __tablename__ = "comments"
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey("comments.id"))
    children = db.relationship(
        "Comment",
        back_populates="parent",
        lazy="dynamic",
    )
    parent = db.relationship(
        "Comment",
        back_populates="children",
        remote_side=id,
    )
    post = db.relationship("Post", back_populates="comments", lazy=True)
    user = db.relationship("User", back_populates="comments")

    def dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "created_at": self.created_at.timestamp(),
            "user_id": self.user_id,
            "username": self.user.username,
            "post_id": self.post_id,
            "post_title": self.post.title,
            "parent_id": self.parent_id,
        }
