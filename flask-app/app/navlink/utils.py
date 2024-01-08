import os
from hashlib import md5
from pathlib import Path
from urllib.parse import urljoin
import base64
from datetime import datetime

from flask import current_app
from loguru import logger
from requests.exceptions import Timeout
from requests_html import HTMLSession
from lxml import etree, html as et_html
from lxml.html import builder as E
from config import basedir

images_path = Path(r"static/images")


def save_nav_img(name, content, NAVICONPATH):
    file_name = os.path.join(basedir, NAVICONPATH, name)
    with open(file_name, "wb") as f:
        f.write(content)


def request_icon_description(navlink_url: str, NAVICONPATH):
    session = HTMLSession()
    ico_src = None
    description = None
    referer = "http://localhost:5000"
    user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0"
    headers = {"Referer": referer, "User-Agent": user_agent}

    url = (
        navlink_url if navlink_url.startswith("http") else f"https://{navlink_url}"
    ).strip()

    try:
        r = session.get(url, timeout=10.0, headers=headers, allow_redirects=True)
    except Exception as e:
        logger.error(f"get {url} fail   {e.args}")
        return ico_src, description
    ico_elements = []

    for et in r.html.find("head link"):
        et_type = et.attrs.get("type", "").lower()
        et_rel: str = str(et.attrs.get("rel", "")).lower()
        et_href: str = et.attrs.get("href", "").lower()
        if ("icon" in et_rel or et_type in ["image/x-icon", "image/png"]) and any(
            s in et_href for s in (("ico", "logo", "svg", "png"))
        ):
            ico_elements.append(et)
    if ico_elements:
        ico_href = ico_elements[0].attrs.get("href")
    else:
        ico_href = "/favicon.ico"
    for et in r.html.find("head meta"):
        et_name = et.attrs.get("name", "").lower()
        et_content = et.attrs.get("content", "").lower()
        if et_name == "description" and et_content:
            description = et_content
            break
    if not description:
        for title in r.html.find("head title"):
            description = title.text
    if ico_href.startswith("http"):
        ico_url = ico_href
    else:
        ico_url = urljoin(r.url, ico_href)
    logger.info(ico_url)
    try:
        ico = session.get(ico_url, timeout=10.0, allow_redirects=True)
        if ico.status_code == 200:
            content_type = ico.headers.get("content-type", "").lower()
            ext = ".png"
            exts = [("icon", ".icon"), ("svg", ".svg")]
            for ext_str, _ext in exts:
                if ext_str in content_type:
                    ext = _ext

            ico_name = md5(navlink_url.encode()).hexdigest()
            save_nav_img(f"{ico_name}{ext}", ico.content, NAVICONPATH)
            logger.info(f"{ico_name}{ext}")
            ico_src = f"/imgs/{ico_name}{ext}"
        else:
            logger.info(
                f"download site ico  {ico_url } failed, status code is {ico.status_code}"
            )
    except Exception as e:
        logger.info(f"download site ico {ico_url} failed {e}")
    if not all((ico_src, description)):
        heads = r.html.find("head")
        if heads:
            head = heads[0]
            logger.info(str(head.html)[:200])
    return ico_src, description


def base64_to_image(url, base64_string):
    favicon = None
    base64_tag = "base64,"
    if url and base64_string and base64_tag in base64_string:
        index = base64_string.index(base64_tag)
        _str = base64_string[index + len(base64_tag) :]
        image_data = base64.b64decode(_str)
        name = md5(url.encode()).hexdigest() + ".png"
        try:
            save_nav_img(name, image_data)
            favicon = f"/imgs/{name}"
        except:
            logger.error(f"save navlink image {url} {base64_string}")
            favicon = None
    return favicon


def query_bookmark_file(content=None, et=None, tags=None):
    if content:
        root = et_html.fromstring(content)
        et = root.xpath("//body/dl")[0]
        tags = []
    for child in et.getchildren():
        if child.tag == "dt":
            next_child = child.getchildren()
            if next_child and next_child[0].tag == "a":
                link = next_child[0]
                linkname = link.text if link.text else ""
                url = link.attrib.get("href", "")
                icon_attrib: str = link.attrib.get("icon")

                item = (linkname[:50], url[:500], tags)
                yield item
                yield from query_bookmark_file(et=child, tags=[*tags])
        if child.tag == "dl":
            pre = child.getprevious()
            pre_child = pre.getchildren()
            if pre_child and pre_child[0].tag == "h3":
                subfolder = pre_child[0].text
                logger.info(f"subfolder {subfolder}")
                new_tags = [*tags, subfolder]
                yield from query_bookmark_file(et=child, tags=new_tags)


def navlink_item(linkname, url, created_at):
    """
    <DT><A HREF="{url}" ADD_DATE="{date}" LAST_VISIT="{date}"
    LAST_MODIFIED="{date}">{title}</A>
    """
    item_str = f'<DT><A HREF="{url}" ADD_DATE="{created_at}" LAST_VISIT="{created_at}" >{linkname}</A>'
    return item_str


def navlink_subfolder(folder_name, tag_created_at, items):
    items_str = "\r\n".join(navlink_item(*item) for item in items)
    return f"""<DT><H3 ADD_DATE="{tag_created_at}" LAST_MODIFIED="{tag_created_at}" >{folder_name}</H3>
<DL><p>
    {items_str}
</DL><p>
"""


def save_to_html(tag_navlinks):
    """
    Netscape Bookmark File Format
    https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa753582(v=vs.85)
    """
    body = ""
    for tag, navlinks in tag_navlinks:
        tag_name = tag["name"]
        tag_created_at = tag.get("created_at", datetime.now().timestamp())
        items = []
        for navlink in navlinks:
            url = navlink["url"]
            linkname = navlink["linkname"]
            created_at = navlink["created_at"]
            item = (linkname, url, created_at)
            items.append(item)
        folder_str = navlink_subfolder(tag_name, tag_created_at, items)
        body += folder_str
    root = f"""<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It will be read and overwritten.
     DO NOT EDIT! -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>
        {body}
</DL><p>
"""

    return root
