from flask_jwt_extended import create_access_token


def auth_header(identity, is_admin = False):
    return {
        'Authorization': f'Bearer {create_access_token(identity=identity, additional_claims={"is_admin": is_admin})}',
    }
