from typing import Optional
from pydantic import BaseModel as PydanticBaseModel, constr, validator, EmailStr

from .blog import EnableComment, PostStatus


class BaseModel(PydanticBaseModel):
    @validator('*')
    def empty_str_to_none(cls, v):
        if v == '':
            return None
        return v


class RegistrationModel(BaseModel):
    username: constr(max_length=30, min_length=4)
    email: EmailStr
    password1: constr(max_length=60, min_length=6)
    password2: constr(max_length=60, min_length=6)

    @validator('password2')
    def passwords_match(cls, v, values, **kwargs):
        if 'password1' in values and v != values['password1']:
            raise ValueError('passwords do not match')
        return v


class LoginModel(BaseModel):
    username: constr(max_length=30, min_length=4)
    password: constr(max_length=30, min_length=6)


class ChangePasswordModel(BaseModel):
    username: constr(max_length=30, min_length=4)
    password1: constr(max_length=60, min_length=6)
    password2: constr(max_length=60, min_length=6)

    @validator('password2')
    def passwords_match(cls, v, values, **kwargs):
        if 'password1' in values and v == values['password1']:
            raise ValueError('new passwords must be not different')
        return v

class TagModel(BaseModel):
    user_id: int
    name: constr(max_length=50, min_length=4)

class Tag(BaseModel):
    id: int
    name: constr(max_length=50, min_length=4)

class PostModel(BaseModel):
    title: constr(max_length=100, min_length=4)
    slug: Optional[constr(max_length=50)]
    summary: Optional[constr(max_length=200, )]
    content: constr(max_length=50, min_length=4)
    status: PostStatus = PostStatus.DRAFT
    enable_comment: EnableComment = EnableComment.DISABLE
    tags: list[Tag] = []


class CommentModel(BaseModel):
    post_id: int
    user_id: int
    parent_id: Optional[int]
    content: constr(max_length=1000, min_length=4)

