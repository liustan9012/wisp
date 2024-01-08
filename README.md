# wisp

## Description

wisp 是一个包含博客、网址导航的个人技术网站，使用 react + flask 开发。

- 个人博客支持 Markdown 编辑预览
- 支持代码语法高亮
- 可以文章多标签
- 支持登录评论文章进行互动
- 支持后台管理增删改查
- 添加链接自动获取 logo 和网站描述
- 支持 chrome 书签批量导入导出
- 中文英文，dark light 切换
- 使用 React 进行前端开发，Flask 用于构建后端 API
- 支持用 Docker Compose 本地开发

## Installation

1. 克隆项目:

   ```
   git clone  https://github.com/liustan9012/wisp.git
   ```

2. 后端创建虚拟环境并安装依赖：
   ```
   cd flask-app
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. 运行 Flask:
   创建数据库

   ```
   flask db upgrade
   ```

   创建管理员用户，可以在文件.flaskenv 中修改 ADMIN_USERNAME、ADMIN_EMAIL、ADMIN_PASSWORD、JWT_SECRET_KEY 管理员信息。

   ```
   flask  create admin
   ```

   启动

   ```
   flask run
   ```

4. 前端安装依赖

   ```
   cd ../react-app
   npm install
   ```

   启动

   ```
   npm run dev
   ```

5. 使用Docker Compose：

    ```
    docker-compose up -d
    ```
