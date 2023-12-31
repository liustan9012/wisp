import pytest
from app import db
from app.models import User, Navlink
from app.models.navlink import Navlink, NavlinkStatus

from .util import auth_header


@pytest.fixture()
def navlink_user(app_ctx):
    user_id = 20000
    u1 = User(username="john", email="john@example.com", id=user_id, is_admin=True)
    n1 = Navlink(linkname="navlink", url="www.newnavlink.com", user_id=user_id)
    db.session.add_all((u1, n1))
    db.session.commit()
    data = {"navlink": n1.dict(), "navlink_id": n1.id, "user_id": u1.id}
    return data



def test_create_navlink(client, navlink_user):
    user_id = navlink_user["user_id"]

    new_link = {
        "url": "https://www.qq.com",
        "linkname": "qq",
        "favicon": "favicon-qq",
        "description": "qq",
    }
    response = client.post(
        "/navlink", json=new_link, headers=auth_header(user_id, True)
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"

    assert (
        response.json["navlink"].items()
        >= {
            **new_link,
            "status": NavlinkStatus.PUBLISHED.value,
            "user_id": user_id,
        }.items()
    )


def test_delete_navlink(client, navlink_user):
    navlink_id = navlink_user.get("navlink_id")
    user_id = navlink_user.get("user_id")
    response = client.post(
        f"/navlink/{navlink_id}/delete",
        headers=auth_header(user_id, True),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"
    assert response.json["navlink"].items() >= {"id": navlink_id}.items()


def test_update_navlink(client, navlink_user):
    navlink_id = navlink_user.get("navlink_id")
    user_id = navlink_user.get("user_id")

    new_link = {
        "url": "https://www.google.com",
        "linkname": "google",
        "description": "update description",
        "status": NavlinkStatus.PRIVATE.value,
    }
    response = client.post(
        f"/navlink/{navlink_id}/update",
        json=new_link,
        headers=auth_header(user_id, True),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"
    assert (
        response.json["navlink"].items()
        >= {
            **new_link,
            "url": new_link["url"],
            "linkname": new_link["linkname"],
            "status": new_link["status"],
            "user_id": user_id,
            "description": new_link["description"],
        }.items()
    )


def test_get_navlink(client, navlink_user):
    navlink_id = navlink_user.get("navlink_id")
    user_id = navlink_user.get("user_id")
    navlink = navlink_user.get("navlink")
    response = client.get(
        f"/navlink/{navlink_id}",
        headers=auth_header(user_id, True),
    )
    assert response.status == "200 OK"
    assert response.json["msg"] == "OK"
    assert response.json["navlink"].items() >= navlink.items()
