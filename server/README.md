# 调酒小程序 - 后端服务

基于 Node.js + Express + Sequelize + MySQL 开发的调酒小程序后端 API 服务。

## 技术栈

- **框架**: Express 4.x
- **ORM**: Sequelize 6.x
- **数据库**: MySQL 8.0
- **认证**: JWT (jsonwebtoken)
- **日志**: Morgan + Winston
- **参数校验**: express-validator

## 项目结构

```
server/
├── src/
│   ├── config/           # 配置文件
│   │   ├── database.js   # 数据库配置
│   │   └── jwt.js        # JWT配置
│   ├── models/           # Sequelize 模型
│   │   ├── Cocktail.js
│   │   ├── Ingredient.js
│   │   ├── Category.js
│   │   ├── User.js
│   │   ├── Admin.js
│   │   └── index.js
│   ├── controllers/      # 控制器
│   ├── services/         # 业务逻辑
│   ├── routes/           # 路由定义
│   ├── middlewares/      # 中间件
│   ├── utils/            # 工具函数
│   └── app.js            # 应用入口
├── .env                  # 环境变量（需创建）
├── .env.example          # 环境变量示例
├── package.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=mixing_drinks
DB_USER=root
DB_PASSWORD=123456

JWT_SECRET=your-secret-key-change-this
JWT_EXPIRES_IN=7d
```

### 3. 启动服务

开发模式（热重载）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## API 文档

### 基础信息

- **Base URL**: `http://localhost:3000/api/v1`
- **响应格式**: JSON
- **字符编码**: UTF-8

### 统一响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": 1698888888888
}
```

### 接口列表

#### 1. 认证接口

- `POST /api/v1/auth/admin/login` - 管理员登录
- `POST /api/v1/auth/wechat/login` - 微信小程序登录
- `GET /api/v1/auth/user/me` - 获取当前用户信息
- `PUT /api/v1/auth/user/profile` - 更新用户信息

#### 2. 酒谱接口

- `GET /api/v1/cocktails` - 获取酒谱列表（分页）
- `GET /api/v1/cocktails/:id` - 获取酒谱详情
- `GET /api/v1/cocktails/search` - 搜索酒谱
- `POST /api/v1/cocktails/match` - 根据材料匹配酒谱
- `POST /api/v1/cocktails` - 创建酒谱（需认证）
- `PUT /api/v1/cocktails/:id` - 更新酒谱（需认证）
- `DELETE /api/v1/cocktails/:id` - 删除酒谱（需认证）

#### 3. 材料接口

- `GET /api/v1/ingredients` - 获取材料列表
- `GET /api/v1/ingredients/by-category` - 按分类获取材料
- `GET /api/v1/ingredients/:id` - 获取材料详情
- `POST /api/v1/ingredients` - 创建材料（需认证）
- `PUT /api/v1/ingredients/:id` - 更新材料（需认证）
- `DELETE /api/v1/ingredients/:id` - 删除材料（需认证）

#### 4. 分类接口

- `GET /api/v1/categories` - 获取分类列表
- `GET /api/v1/categories/:id` - 获取分类详情
- `POST /api/v1/categories` - 创建分类（需认证）
- `PUT /api/v1/categories/:id` - 更新分类（需认证）
- `DELETE /api/v1/categories/:id` - 删除分类（需认证）

### 认证说明

需要认证的接口需要在请求头中携带 JWT Token：

```
Authorization: Bearer <your-token>
```

## 数据库初始化

首次运行时，Sequelize 会自动创建数据库表结构。确保：

1. MySQL 服务已启动
2. 数据库 `mixing_drinks` 已创建（执行 `npm run init:db` 会自动创建，无需手动在宝塔建库）
3. 数据库用户有足够的权限

## 错误码

- `200` - 成功
- `400` - 请求参数错误
- `401` - 未授权
- `404` - 资源不存在
- `500` - 服务器内部错误

## 开发说明

### 添加新模型

1. 在 `src/models/` 创建模型文件
2. 在 `src/models/index.js` 中导入并定义关联关系
3. 运行服务，Sequelize 会自动同步表结构

### 添加新接口

1. 在 `src/services/` 创建业务逻辑
2. 在 `src/controllers/` 创建控制器
3. 在 `src/routes/` 添加路由定义
4. 在 `src/routes/index.js` 注册路由

## 注意事项

⚠️ **安全提示**：
- 当前版本管理员密码为**明文存储**，仅用于开发测试
- 生产环境必须使用 bcrypt 加密密码
- 请及时修改 `.env` 中的 `JWT_SECRET`

## License

ISC
