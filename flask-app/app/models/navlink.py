from datetime import datetime
from enum import Enum, IntEnum

from app import db


class NavlinkStatus(str, Enum):
    """Navlink Status : NavlinkStatus"""

    PUBLISHED = "PUBLISHED"
    PRIVATE = "PRIVATE"
    DELETE = "DELETE"


navlink_tags = db.Table(
    "navlink_tags",
    db.Column("navlink_id", db.Integer, db.ForeignKey("navlinks.id"), primary_key=True),
    db.Column("tag_id", db.Integer, db.ForeignKey("tags.id"), primary_key=True),
)


class Navlink(db.Model):
    """Navlink Model"""

    __tablename__ = "navlinks"
    id = db.Column(db.Integer, primary_key=True)
    linkname = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    description = db.Column(db.String(500))
    favicon = db.Column(db.String(500))
    shortstr = db.Column(db.String(50))
    order = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default=NavlinkStatus.PRIVATE)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)
    click_count = db.Column(db.Integer, default=0)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    tags = db.relationship(
        "Tag", secondary=navlink_tags, back_populates="navlinks", lazy=True
    )
    user = db.relationship("User", back_populates="navlinks", lazy=True)

    def dict(self):
        return {
            "id": self.id,
            "linkname": self.linkname,
            "url": self.url,
            "description": self.description,
            "favicon": self.favicon,
            "shortstr": self.shortstr,
            "created_at": self.created_at.timestamp(),
            "status": self.status,
            "user_id": self.user_id,
            "tags": [t.dict() for t in self.tags],
        }

    def update(self, **data):
        self.linkname = data.get("linkname")
        self.url = data.get("url")
        self.description = data.get("description")
        self.shortstr = data.get("shortstr")
        self.status = data.get("status")

    def __repr__(self):
        return f"<NavLink {self.linkname}>"
