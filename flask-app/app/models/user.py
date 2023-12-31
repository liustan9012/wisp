from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from app import db

# @login.user_loader
# def load_user(id):
#     """load user"""
#     return User.query.get(int(id))


class User(db.Model):

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(128), index=True, nullable=False)
    username = db.Column(db.String(64),
                         unique=True,
                         index=True,
                         nullable=False)
    password_hash = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime,
                           default=datetime.now,
                           onupdate=datetime.now)
    is_admin = db.Column(db.Boolean, default=False)

    posts = db.relationship('Post', back_populates='author', lazy=True)

    comments = db.relationship('Comment', back_populates='user', lazy=True)

    tags = db.relationship('Tag', back_populates='user', lazy=True)
    navlinks = db.relationship('Navlink', back_populates='user', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def get_id(self):
        return str(self.id)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


    def dict(self):
        return {
            'id':self.id,
            'username': self.username,
            'email':self.email,
            'updated_at':self.updated_at.timestamp(),
            'created_at':self.created_at.timestamp(),
            'is_admin':self.is_admin,
        }
