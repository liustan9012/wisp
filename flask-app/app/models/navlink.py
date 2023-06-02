from datetime import datetime
from enum import Enum

from app import db


class NavLinkStatus(str, Enum):
    """NavLink Status : NavLinkStatus PRIVATE"""
    PUBLISHED = 'PUBLISHED'
    PRIVATE = 'PRIVATE'


navlink_tags = db.Table(
    'navlink_tags',
    db.Column('navlink_id',
              db.Integer,
              db.ForeignKey('navlinks.id'),
              primary_key=True),
    db.Column('tag_id', db.Integer, db.ForeignKey('tags.id'),
              primary_key=True))


class NavLink(db.Model):
    """NavLink Model"""
    __tablename__ = 'navlinks'
    id = db.Column(db.Integer, primary_key=True)
    linkname = db.Column(db.String(50), nullable=False)
    url = db.Column(db.String(500), nullable=False)
    description = db.Column(db.String(500))
    favicon = db.Column(db.String(500))
    shortstr = db.Column(db.String(50))
    order = db.Column(db.Integer, default=0)
    status = db.Column(
        db.Enum(NavLinkStatus, ),
        default=NavLinkStatus.PUBLISHED,
    )


    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now)

    click_count = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<NavLink {self.linkname}>'

    tags = db.relationship(
        'Tag',
        secondary=navlink_tags,
        backref='navlinks',
        lazy=True,
    )
