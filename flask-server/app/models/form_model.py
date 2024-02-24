from typing import Optional
from enum import Enum, IntEnum

from pydantic import BaseModel as PydanticBaseModel
from pydantic import EmailStr, constr, validator

from .blog import EnableComment, PostStatus
from .navlink import NavlinkStatus


class BaseModel(PydanticBaseModel):
    @validator("*")
    def empty_str_to_none(cls, v):
        if v == "":
            return None
        return v


class RegistrationModel(BaseModel):
    username: constr(max_length=30, min_length=4)
    email: EmailStr
    password1: constr(max_length=20, min_length=6)
    password2: constr(max_length=20, min_length=6)

    @validator("password2")
    def passwords_match(cls, v, values, **kwargs):
        if "password1" in values and v != values["password1"]:
            raise ValueError("passwords do not match")
        return v


class LoginModel(BaseModel):
    username: constr(max_length=30, min_length=4)
    password: constr(max_length=20, min_length=6)
    remember: Optional[bool] = False


class ChangePasswordModel(BaseModel):
    username: constr(max_length=30, min_length=4)
    password1: constr(max_length=20, min_length=6)
    password2: constr(max_length=20, min_length=6)

    @validator("password2")
    def passwords_match(cls, v, values, **kwargs):
        if "password1" in values and v != values["password1"]:
            raise ValueError("passwords do not match")
        return v


class TagModel(BaseModel):
    user_id: int
    name: constr(max_length=50, min_length=1)


class Tag(TagModel):
    id: int


class PostModel(BaseModel):
    title: constr(max_length=100, min_length=4)
    slug: Optional[constr(max_length=50)]
    summary: Optional[constr(max_length=200)]
    content: constr(min_length=4, max_length=50000)
    status: PostStatus = PostStatus.DRAFT
    enable_comment: EnableComment = EnableComment.DISABLE
    tags: list[Tag] = []


class CommentModel(BaseModel):
    post_id: int
    user_id: int
    parent_id: Optional[int]
    content: constr(max_length=1000, min_length=4)


class NavLinkModel(BaseModel):
    linkname: constr(max_length=50, min_length=1)
    url: constr(max_length=500, min_length=1)
    description: Optional[constr(max_length=500)]
    favicon: Optional[constr(max_length=500)]
    status: NavlinkStatus = NavlinkStatus.PUBLISHED
    shortstr: Optional[constr(max_length=50)]
    order: int = 0
    tags: list[Tag] = []


class NavlinkOrderBy(str, Enum):
    CREATED_AT = "created_at"
    ID = "id"
    LINKNAME = "linkname"
    STATUS = "status"
    URL = "url"


class PaginationOrder(str, Enum):
    DESC = "desc"
    AES = "asc"


class PaginationOrderBy(str, Enum):
    CREATED_AT = "created_at"
    ID = "id"


class PaginationModel(BaseModel):
    page: Optional[int] = 1
    per_page: Optional[int] = 10
    order: PaginationOrder = PaginationOrder.DESC
    order_by: PaginationOrderBy = PaginationOrderBy.CREATED_AT


class NavlinkPaginationModel(PaginationModel):
    order_by: NavlinkOrderBy = NavlinkOrderBy.CREATED_AT


class CommentsOrderBy(str, Enum):
    CREATED_AT = "created_at"
    ID = "id"


class CommentPaginationModel(PaginationModel):
    order_by: CommentsOrderBy = CommentsOrderBy.CREATED_AT


class TagOrderBy(str, Enum):
    CREATED_AT = "created_at"
    ID = "id"
    CONTENT_TYPE = "content_type"
    NAME = "name"
    POST_COUNT = "post_count"
    NAVLINK_COUNT = "navlink_count"


class TagPaginationModel(PaginationModel):
    order_by: TagOrderBy = TagOrderBy.CREATED_AT


class PostOrderBy(str, Enum):
    CREATED_AT = "created_at"
    ID = "id"
    TITLE = "title"
    STATUS = "status"


class PostPaginationModel(PaginationModel):
    order_by: PostOrderBy = PostOrderBy.CREATED_AT


class UserOrderBy(str, Enum):
    CREATED_AT = "created_at"
    ID = "id"
    NAME = "name"
    IS_ADMIN = "is_admin"


class UserPaginationModel(PaginationModel):
    order_by: UserOrderBy = UserOrderBy.CREATED_AT


class NavlinkStatusModel(BaseModel):
    status: NavlinkStatus = NavlinkStatus.PUBLISHED


class DownloadNavlinkModel(BaseModel):
    status: Optional[NavlinkStatus]
    tags: list[Tag] = []
