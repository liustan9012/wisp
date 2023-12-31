import os
from hashlib import md5
from pathlib import Path
from urllib.parse import urljoin

from flask import current_app
from loguru import logger
from requests.exceptions import Timeout
from requests_html import HTMLSession

from config import basedir

images_path = Path(r"static/images")


def request_icon_description(navlink_url: str):
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
            file_name = os.path.join(
                basedir, current_app.config["NAVICONPATH"], f"{ico_name}{ext}"
            )
            with open(file_name, "wb") as f:
                f.write(ico.content)
            logger.info(f"{ico_name}{ext}")
            ico_src = f"/imgs/{ico_name}{ext}"
        else:
            logger.info(
                f"download site ico  {ico_url } failed, status code is {ico.status_code}"
            )
    except Exception as e:
        logger.info(f"download site ico {ico_url} failed {e}")
    if not all((ico_src, description)):
        head = r.html.find("head")[0]
        logger.info(head.html)
    return ico_src, description
