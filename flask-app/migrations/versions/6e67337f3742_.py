"""empty message

Revision ID: 6e67337f3742
Revises: 27fccf014785
Create Date: 2023-04-23 18:43:28.161818

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '6e67337f3742'
down_revision = '27fccf014785'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.alter_column('status',
               existing_type=mysql.VARCHAR(length=50),
               type_=sa.Enum('DRAFT', 'PUBLISHED', 'ARCHIVED', 'PRIVATE', name='poststatus'),
               existing_nullable=True)
        batch_op.alter_column('enable_comment',
               existing_type=mysql.INTEGER(display_width=11),
               type_=sa.Enum('1', '2', name='enablecomment'),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('posts', schema=None) as batch_op:
        batch_op.alter_column('enable_comment',
               existing_type=sa.Enum('1', '2', name='enablecomment'),
               type_=mysql.INTEGER(display_width=11),
               existing_nullable=True)
        batch_op.alter_column('status',
               existing_type=sa.Enum('DRAFT', 'PUBLISHED', 'ARCHIVED', 'PRIVATE', name='poststatus'),
               type_=mysql.VARCHAR(length=50),
               existing_nullable=True)

    # ### end Alembic commands ###