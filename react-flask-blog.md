# wisp

# 创建虚拟环境

    python -m venv venv


激活虚拟环境

    .\venv\Scripts\activate
    (venv) PS D:\app\wisp\blog>

安装flask

    pip install flask

安装python-dotenv

    pip install python-dotenv

安装flask-sqlalchemy

    pip install flask-sqlalchemy
    pip install flask-migrate

初始化数据库迁移脚本

    flask db init

生成user table的数据库迁移脚本

    flask db migrate -m 'user table'

更新迁移脚本到数据库

    flask db upgrade

安装用户会话管理插件flask-login

    pip install flask-login

安装 pydantic

    pip install pydantic
    pip install pydantic[email]
    pip install pydantic[email,dotenv]

        pip install flask-jwt-extended

安装 pytest

    pip install pytest
    pip3 install mysqlclient

使用create-next-app创建项目

    npx create-next-app@latest next-app

安装  Material UI ,  Roboto font


    npm install @mui/material @emotion/react @emotion/styled
    npm install @mui/icons-material
    npm install @fontsource/roboto
    npm i @uiw/react-md-editor
    npm install rehype-sanitize
    npm install jwt-decode

<!-- - 可以通过后台对文章、标签等做增删改查 -->
<!-- - 后台支持 Markdown 编辑 / 预览 -->
<!-- - 支持代码语法高亮 -->
- 支持 TOC
- 支持文章搜索
- 支持 Github 登录评论
- 支持 Github 登录对文章和平台表态
- 可以分享文章到微信 / 微博 / 豆瓣 / 印象笔记 / Linkedin
- 支持 Hexo 等其他 Markdown 源文件的导入
- 支持文章的语法高亮
- 支持个人设置 (如设置头像，个人介绍)
- 支持定制导航栏
- 支持 RSS/Sitemap
- 相关文章推荐 (根据相似标签)
- 响应式设计
- 支持集成 Sentry
- 支持评论提及邮件
- 支持 Github Cards. 本文就能看到卡片效果
- 文章内容 (除代码部分之外) 自动「盘古之白」
- 支持文章专题
- 支持用 Docker Compose 本地开发
- 支持 kubernetes 上运行
- Widget 系统，内置 aboutme、blogroll、most_viewed、- latest_comments、tagcloud、html 等 widget
- 导航栏项可以设置 icon (如 RSS)


1用户：站内用户
用户可以评论与回复、
 前台：主页 + 列表页 + 搜索页 + 分类页 + 标签页
 后台：文章管理 + 用户管理
 响应式、文章锚点导航、回到顶部、markdown 代码高亮
 
 md 文件导入导出功能！可以直接上传 md 文件生成文章

 github 第三方授权登录的用户?
 以及邮件通知回复的状态



后端接口

创建文章
获取文章列表
  .get('/md/:id', output) // 导出指定文章
  .post('/upload', upload) // 上传文章
  .post('/checkExist', checkExist) // 确认文章是否存在
  .post('/upload/confirm', uploadConfirm) // 确认上传的文章 读取 upload 文件文章 插入数据库
  .get('/output/all', outputAll) // 导出所有文章
  .get('/output/:id', output) // 导出文章
  .get('/output/list/:list', outputList) // 导出指定文章
获取文章
修改文章
  .delete('/list/:list', delList) // 删除指定文章列表
删除指定文章

创建评论或者回复 articleId 文章 id
  .delete('/comment/:commentId', deleteComment) // 删除一级评论
  .delete('/reply/:replyId', deleteReply) // 删除回复

获取所有的 tag 列表
获取 category 列表

// root
登录
注册


获取列表
更新用户信息
删除用户