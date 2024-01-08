from pathlib import Path
from collections import defaultdict
import concurrent.futures

from flask import current_app, jsonify, request, send_from_directory
from flask_jwt_extended import current_user, get_current_user, jwt_required
from loguru import logger
from sqlalchemy import and_, asc, desc, func, true
from sqlalchemy.orm import joinedload, contains_eager

from app import db
from app.auth import admin_required
from app.errors import ValidationDBError
from app.models import (
    Navlink,
    NavLinkModel,
    NavlinkStatus,
    Tag,
    NavlinkPaginationModel,
    PaginationOrder,
    NavlinkStatusModel,
    DownloadNavlinkModel,
)
from app.navlink import bp
from config import basedir

from .utils import request_icon_description, query_bookmark_file, save_to_html


@bp.get("/static/images/<path:path>")
def static_images(path):
    directory = Path(basedir) / "static" / "images/"
    return send_from_directory(directory, path)


@bp.get("/links")
@jwt_required(optional=True)
def get_links():
    user = get_current_user()
    if user is not None and user.is_admin:
        criteria = and_(true())
    else:
        criteria = and_(true(), Navlink.status == NavlinkStatus.PUBLISHED)
    navlink_with_tags = (
        db.session.execute(
            db.select(Navlink).options(joinedload(Navlink.tags)).where(criteria)
        )
        .unique()
        .scalars()
    )
    navlinks = {}
    tags = {}
    default_tag = {"id": 0, "name": "default", "navlinks": []}
    navlinks["default"] = []
    tags["default"] = default_tag
    for navlink in navlink_with_tags:
        if not navlink.tags:
            navlinks["default"].append(navlink.dict())
        for tag in navlink.tags:
            tag_name = tag.name
            if tag_name not in navlinks:
                navlinks[tag_name] = []
                tags[tag_name] = tag.dict()
            navlinks[tag_name].append(navlink.dict())
    tag_navlinks = [[tags[tag_name], navlinks[tag_name]] for tag_name in tags]
    return jsonify(tag_navlinks=tag_navlinks, msg="OK")


@bp.get("/navlinks")
@admin_required()
def get_navlinks():
    req_pagination = NavlinkPaginationModel(**request.args)
    order_func = desc if req_pagination.order == PaginationOrder.DESC else asc
    pagination = db.paginate(
        db.select(Navlink)
        .options(joinedload(Navlink.tags))
        .order_by(order_func(req_pagination.order_by)),
        page=req_pagination.page,
        per_page=req_pagination.per_page,
        max_per_page=50,
        error_out=False,
    )

    navlinks = []
    for navlink in pagination.items:
        navlinks.append({**navlink.dict(), "tags": [t.dict() for t in navlink.tags]})
    return jsonify(
        navlinks=navlinks,
        page=pagination.page,
        per_page=pagination.per_page,
        order=req_pagination.order,
        order_by=req_pagination.order_by,
        total=pagination.total,
        msg="OK",
    )


@bp.post("/navlink")
@admin_required()
def create_navlink():
    req = NavLinkModel(**request.json)
    if "://" not in req.url:
        req.url = "https://" + req.url

    user_id = current_user.id
    data = {**req.dict()}
    navlink_tags = data.pop("tags")
    new_navlink = Navlink(user_id=user_id, **data)

    if not (req.description and req.favicon):
        icon, description = request_icon_description(
            new_navlink.url, current_app.config["NAVICONPATH"]
        )
        new_navlink.favicon = req.favicon if req.favicon else icon
        new_navlink.description = req.description if req.description else description
    if navlink_tags:
        tags = Tag.query.filter(Tag.id.in_([t["id"] for t in navlink_tags])).all()
        new_navlink.tags = tags
    else:
        new_navlink.tags = []
    db.session.add(new_navlink)
    db.session.commit()
    return jsonify(
        navlink=new_navlink.dict(), tags=[t.dict() for t in new_navlink.tags], msg="OK"
    )


@bp.post("/navlink/<int:navlink_id>/delete")
@admin_required()
def delete_navlink(navlink_id):
    navlink = Navlink.query.filter_by(id=navlink_id).first()
    if navlink is None:
        raise ValidationDBError("the navlink is not exist.")
    navlink.tags = []
    db.session.delete(navlink)
    db.session.commit()
    return jsonify(navlink={"id": navlink_id}, msg="OK")


@bp.post("/navlink/<int:navlink_id>/update")
@admin_required()
def update_navlink(navlink_id):
    req = NavLinkModel(**request.json)
    if "://" not in req.url:
        req.url = "https://" + req.url

    new_navlink = Navlink.query.filter_by(id=navlink_id).first()
    if new_navlink is None:
        raise ValidationDBError("the navlink is not exist.")
    data = {**req.dict()}
    navlink_tags = data.pop("tags")
    if navlink_tags:
        tags = Tag.query.filter(Tag.id.in_([t["id"] for t in navlink_tags])).all()
        new_navlink.tags = tags
    else:
        new_navlink.tags = []

    new_navlink.update(**data)
    if not (req.description and req.favicon):
        icon, description = request_icon_description(
            new_navlink.url, current_app.config["NAVICONPATH"]
        )
        new_navlink.favicon = req.favicon if req.favicon else icon
        new_navlink.description = req.description if req.description else description
    db.session.add(new_navlink)
    db.session.commit()
    return jsonify(navlink=new_navlink.dict(), msg="OK")


@bp.get("/navlink/<int:navlink_id>")
@admin_required()
def get_navlink(navlink_id):
    new_navlink = Navlink.query.filter_by(id=navlink_id).first()
    if new_navlink is None:
        raise ValidationDBError("the navlink is not exist.")
    return jsonify(navlink=new_navlink.dict(), msg="OK")


@bp.post("/navlink/upload")
@admin_required()
def upload_navlink():
    status = NavlinkStatusModel(status=request.form.get("status")).status
    file = None
    if "file" not in request.files:
        file = None
    file = request.files.get("file")
    if file is None or file.filename == "":
        raise ValidationDBError("the file is not correct.")
    content = file.stream.read().decode("utf-8")
    user_id = current_user.id
    count = defaultdict(int)
    count["success"] = 0
    count["failure"] = 0
    success_navlink = {}
    new_tags = defaultdict(str)
    icon_descriptions = {}
    nav_path = current_app.config["NAVICONPATH"]
    for linkname, url, tags in query_bookmark_file(content):
        navlink = Navlink.query.filter(
            Navlink.url == url, Navlink.user_id == user_id
        ).first()
        if navlink is not None:
            count["failure"] += 1
            continue
        icon_descriptions[url] = url
        new_navlink = Navlink(
            linkname=linkname, url=url, user_id=user_id, status=status
        )
        success_navlink[url] = new_navlink
        count["success"] += 1
        for name in tags:
            if name in new_tags:
                t = new_tags[name]
            else:
                t: Tag = Tag.query.filter(
                    Tag.name == name, Tag.user_id == user_id
                ).first()
                if t is None:
                    t = Tag(name=name, user_id=user_id)
            new_tags[name] = t
            new_navlink.tags = [*new_navlink.tags, t]
    futures = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        for url in icon_descriptions:
            _future = executor.submit(request_icon_description, url, nav_path)
            futures[_future] = url
        for future in concurrent.futures.as_completed(futures):
            _url = futures[future]
            navlink: Navlink = success_navlink[_url]
            data = future.result()
            favicon, description = data
            logger.info(data)
            if favicon:
                navlink.favicon = favicon
            if description:
                navlink.description = description[:500]
    for navlink in success_navlink.values():
        db.session.add(navlink)
    db.session.commit()

    return jsonify(count=count, msg="OK")


@bp.post("/navlink/download")
@admin_required()
def download_navlink():
    req = DownloadNavlinkModel(**request.json)
    logger.info((req.tags, req.status))
    criteria = true()
    if req.tags:
        criteria = and_(criteria, Tag.id.in_([t.id for t in req.tags]))
    if req.status:
        criteria = and_(criteria, Navlink.status == req.status)

    navlink_with_tags = (
        db.session.execute(
            db.select(Navlink)
            .outerjoin(Navlink.tags)
            .options(contains_eager(Navlink.tags))
            .filter(criteria)
        )
        .unique()
        .scalars()
    )
    navlinks = {}
    tags = {}
    default_tag = {"id": 0, "name": "default", "navlinks": []}
    navlinks["default"] = []
    tags["default"] = default_tag
    for navlink in navlink_with_tags:
        if not navlink.tags:
            navlinks["default"].append(navlink.dict())
        for tag in navlink.tags:
            tag_name = tag.name
            if tag_name not in navlinks:
                navlinks[tag_name] = []
                tags[tag_name] = tag.dict()
            navlinks[tag_name].append(navlink.dict())
    tag_navlinks = [[tags[tag_name], navlinks[tag_name]] for tag_name in tags]
    html_data = save_to_html(tag_navlinks)
    return html_data
