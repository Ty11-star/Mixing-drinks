# 🍸 调一杯 · 调酒小程序

「调一杯」是一套面向调酒爱好者与初学者的轻量级鸡尾酒学习与工具应用，采用 **微信小程序 + Web 管理后台 + REST 后端** 三端结构：用户端可以浏览酒谱、按手头材料匹配能调的酒、让 AI 生成配方、摇一摇或抽卡决定「今天喝什么」，并学习基酒、器具、术语等基础知识；运营方通过管理后台维护酒谱、材料、分类与用户；后端统一提供数据、JWT 认证、图片上传和 DeepSeek AI 能力。

### 一眼看懂

| 端 | 内容 |
| --- | --- |
| 用户端 `miniprogram` | 微信原生小程序（自定义 TabBar），10 个页面，覆盖「看、找、配、玩、学」 |
| 管理端 `manage` | React + TypeScript 单页应用：仪表板、酒谱、材料、分类、用户管理 |
| 服务端 `server` | Node.js + Express + Sequelize，接口前缀 `/api/v1`，JWT 鉴权，接入 DeepSeek |
| 数据 `database` | MySQL 8.0 建表脚本 + 15 款经典鸡尾酒示例数据；初始含 12 个分类、36 种材料 |
| 设计 `design-system` | 深蓝 + 琥珀金的视觉体系，见 `design-system/MASTER.md` 与 `前端设计规范.md` |

## 项目结构

```
Mixing drinks/
├── server/              # 后端服务（Node.js + Express + Sequelize）
├── manage/              # 管理后台（React + TypeScript + Ant Design）
├── miniprogram/         # 微信小程序「调一杯」
├── database/            # 建表脚本 schema.sql 与示例数据 data.sql
├── design-system/       # 设计系统说明
├── 开发规范文档.md      # 技术架构与开发规范
├── 前端设计规范.md      # UI/UX 设计规范
├── 项目完成说明.md      # 功能清单与启动说明
└── README.md            # 本文件
```

## 技术栈

| 模块 | 技术 |
| --- | --- |
| 后端 `server` | Node.js、Express 4、Sequelize 6、MySQL 8.0、JWT、multer / morgan / winston |
| 管理后台 `manage` | React 19、TypeScript、Ant Design 6、Vite 8、React Router 7、Zustand、Axios、ECharts |
| 小程序 `miniprogram` | 微信原生小程序（WXML / WXSS / JS）、自定义 TabBar、`wx.request` 封装 |
| AI 能力 | DeepSeek API（按材料生成配方、每日抽卡） |
| 数据库 | MySQL 8.0，`utf8mb4 / utf8mb4_unicode_ci` |

> 管理后台使用 Vite 8，建议使用 Node.js 20.19+ 或 22 LTS。
> 数据库名统一使用不带空格的 `mixing_drinks`（`server/.env.example` 已按此命名）；Linux 下带空格的库名必须用反引号包裹，容易踩坑。本地旧环境若仍为 `Mixing drinks`，请同步修改 `server/.env` 的 `DB_NAME` 并迁移数据。

## 快速开始

### 1. 安装依赖

#### 后端服务器
```bash
cd server
npm install
```

#### 后台管理系统
```bash
cd manage
npm install
```

### 2. 配置环境变量

#### 后端环境变量 (server/.env)
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_NAME=mixing_drinks
DB_USER=root
DB_PASSWORD=your-password

JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

WECHAT_APPID=your-wechat-appid
WECHAT_SECRET=your-wechat-secret

DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```
> 完整模板见 `server/.env.example`。`.env` 已被 git 忽略，请勿提交真实密钥；缺少 AI 相关配置时，AI 配方与抽卡功能不可用。

#### 管理后台环境变量 (manage/.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```
> 生产环境改为 `https://你的域名/api/v1` 后**必须重新执行 `npm run build`**：Vite 会把该值编译进产物，只改配置不重新构建不会生效。

#### 小程序端 (miniprogram/utils/config.js)
修改 `baseUrl`：本地调试用 `http://localhost:3000/api/v1`，真机预览用局域网 IP，上线必须改为已备案的 HTTPS 域名并在微信公众平台配置 request 合法域名。`useMock: true` 可在后端未启动时使用内置模拟数据预览。

### 3. 初始化数据库

确保 MySQL 服务已启动，并创建数据库（名称需与 `server/.env` 的 `DB_NAME` 一致）：

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mixing_drinks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

两种初始化方式，**二选一**：

1. 脚本自动建表：创建 8 张模型表，并写入默认管理员账号（`admin / 123456`）、12 个分类、36 种材料。

```bash
cd server && npm run init-db
```

2. 导入项目自带 SQL：10 张表 + 15 款示例酒谱。先执行 `database/schema.sql`，再执行 `database/data.sql`（两个文件内的库名写死为 `cocktail_db`，导入前需替换为实际库名）。

⚠️ `npm run init-db` 内部是 `sequelize.sync({ force: true })`，**会删除并重建所有表、清空现有数据**，已有数据请勿执行；`schema.sql` 同样含 `DROP TABLE IF EXISTS`。两种方式的默认管理员密码也不同（SQL 文件为 `admin / admin123`），首次登录后请立即修改。

### 4. 启动服务

| 服务 | 命令 | 访问地址 |
| --- | --- | --- |
| 后端 | `cd server && npm run dev` | `http://localhost:3000` |
| 管理后台 | `cd manage && npm run dev` | `http://localhost:3001/login` |
| 小程序 | 用微信开发者工具导入 `miniprogram/` 目录 | 模拟器 / 真机预览 |

管理后台端口由 `manage/vite.config.ts` 指定为 **3001**（不是 Vite 默认的 5173）；开发时 Vite 会把 `/api` 请求代理到 `localhost:3000`。

### 5. 登录后台管理系统

打开 `http://localhost:3001/login`，用户名 `admin`，密码 `123456`（以实际采用的初始化方式为准，SQL 脚本方式见上节说明）。

## 主要功能

### 微信小程序（miniprogram）
- **首页 / 分类 / 搜索**：浏览酒谱，按基酒、口味等分类筛选，关键词搜索。
- **酒谱详情**：材料用量、分步调制说明、小贴士、封面图。
- **材料匹配**：勾选手头已有的材料，返回可制作的酒谱及缺失材料提示。
- **AI 调酒**：调用 DeepSeek 按材料生成新配方，可把结果保存进酒谱库。
- **摇一摇 / 每日抽卡**：随机决定「今天喝什么」。
- **知识库**：基酒、调制方法、器具、术语、单位换算速查（内置数据）。
- **我的**：微信登录与个人信息。

### 管理后台（manage）
- **仪表板**：酒谱 / 材料 / 分类数量统计与图表。
- **酒谱管理**：列表分页、搜索、难度筛选、启停、批量删除；表单支持动态配置材料用量、调制步骤、多分类关联、封面上传与 Markdown 描述。
- **材料管理 / 分类管理**：表格 + 弹窗增删改，按类型筛选与排序。
- **用户管理**：查看与删除小程序用户。
- **登录与权限**：JWT 存储、路由守卫、401 自动跳转登录。

### 后端 API（server）
- 统一前缀 `/api/v1`，健康检查 `GET /api/v1/health`。
- 认证、酒谱 / 材料 / 分类 CRUD、搜索筛选、材料匹配、批量删除与状态切换。
- 用户管理、图片上传（`/uploads`、`/images`）、AI 推荐与保存、每日抽卡。
- 事务保证酒谱与关联数据一致性，统一响应格式与错误处理，Morgan / Winston 日志。

## API 文档

### 基础信息
- **Base URL**: `http://localhost:3000/api/v1`
- **认证方式**: JWT Bearer Token
- **响应格式**: JSON

### 主要接口

#### 管理员认证
```
POST /api/v1/admin/login          # 管理员登录
GET  /api/v1/admin/profile        # 获取当前管理员信息
POST /api/v1/admin/logout         # 退出登录
```

#### 酒谱管理
```
GET    /api/v1/cocktails          # 获取酒谱列表（支持分页、搜索）
GET    /api/v1/cocktails/:id      # 获取酒谱详情
POST   /api/v1/admin/cocktails    # 创建酒谱
PUT    /api/v1/admin/cocktails/:id # 更新酒谱
DELETE /api/v1/admin/cocktails/:id # 删除酒谱
```

#### 材料管理
```
GET    /api/v1/ingredients        # 获取材料列表
POST   /api/v1/admin/ingredients  # 创建材料
PUT    /api/v1/admin/ingredients/:id # 更新材料
DELETE /api/v1/admin/ingredients/:id # 删除材料
```

#### 分类管理
```
GET    /api/v1/categories         # 获取分类列表
POST   /api/v1/admin/categories   # 创建分类
PUT    /api/v1/admin/categories/:id # 更新分类
DELETE /api/v1/admin/categories/:id # 删除分类
```

#### 其他接口
```
GET  /api/v1/health                  # 健康检查
GET  /api/v1/cocktails/search       # 搜索酒谱
POST /api/v1/cocktails/match        # 按材料匹配可制作的酒谱
GET  /api/v1/admin/stats/dashboard  # 看板统计
POST /api/v1/admin/upload           # 图片上传
POST /api/v1/ai/recommend           # AI 按材料生成配方
POST /api/v1/ai/save                # 保存 AI 配方到酒谱库
GET  /api/v1/ai/daily               # 每日抽卡
GET  /api/v1/users                  # 小程序用户列表（管理员）
POST /api/v1/auth/wechat/login      # 微信登录
```

> 管理端接口需带 `Authorization: Bearer <token>`；公开接口使用 `optionalAuth`，可匿名访问。

## 数据库表结构

### 核心表

1. **cocktails** - 酒谱表
2. **ingredients** - 材料表
3. **cocktail_ingredients** - 酒谱材料关联表
4. **cocktail_steps** - 调制步骤表
5. **categories** - 分类表
6. **cocktail_categories** - 酒谱分类关联表
7. **users** - 用户表（小程序用户）
8. **admins** - 管理员表
9. **knowledge_articles** - 知识文章表（仅 `schema.sql` 定义）
10. **operation_logs** - 操作日志表（仅 `schema.sql` 定义）

> `server/src/models/` 目前定义 8 个模型，第 9、10 张表只存在于 SQL 脚本中。表间有 5 个级联外键；`data.sql` 依赖 `LAST_INSERT_ID()` 会话变量，必须由单个 MySQL 连接按文件顺序一次性导入。

详细表结构请查看 `database/schema.sql` 与 `开发规范文档.md`

## 开发命令

### 后端服务器 (server)
```bash
npm run dev        # 开发模式启动（使用 nodemon 热重载）
npm start          # 生产模式启动
npm run init-db    # 初始化数据库（会清空现有数据）
```

### 后台管理系统 (manage)
```bash
npm run dev        # 开发模式启动
npm run build      # 构建生产版本
npm run preview    # 预览生产构建
npm run lint       # 代码检查
```

## 项目特点

### 设计理念
- **轻量化**: 功能聚焦，避免冗余
- **极简化**: 交互简单直观，学习成本低
- **工具化**: 提供实用的调酒工具，而非社交平台
- **渐进式**: 从基础功能开始，预留扩展空间

### 技术特点
- 📦 模块化设计，代码结构清晰
- 🔐 JWT 认证保护管理员接口
- 🎨 基于 Ant Design 的现代化管理界面
- ⚡ Vite 构建，开发体验优秀
- 🗃️ Sequelize ORM，数据库操作便捷
- 🔄 支持热重载，开发效率高

## 后续开发计划

### 小程序端（已实现）
原计划中的酒谱浏览与搜索、材料智能匹配、酒谱详情、调酒基础知识、个人中心均已落地，并额外加入了 AI 配方、摇一摇与每日抽卡，详见「主要功能」。

### 可迭代方向
- 用户收藏、浏览历史、评论与评分
- 图片迁移到对象存储，统一两处上传目录
- 密码加密存储（bcrypt）、CORS 白名单、用 Sequelize migrations 替代 `force: true` 初始化
- 生产部署：Nginx 托管 `manage/dist` 并反代 `/api/v1`、HTTPS 与已备案域名、systemd / pm2 守护 Node 进程
- 视频教程、社区分享

## 开发注意事项

### 安全说明
⚠️ 上线前必做：更换 `JWT_SECRET`、修改默认管理员与数据库密码、用 bcrypt 加密管理员密码（当前为明文存储）、为 CORS 配置白名单、不要对公网开放 3306 端口、不要把 `.env` 提交到仓库。

### 数据库注意事项
- 库名统一使用 `mixing_drinks`（不带空格）；旧环境 `Mixing drinks` 需同步修改 `DB_NAME` 并迁移数据。
- `npm run init-db` 使用 `force: true`，会清空所有现有数据。
- `NODE_ENV=production` 时后端不会自动建表，需先导入数据再启动；`database/schema.sql` 含 `DROP TABLE IF EXISTS`，重复执行会丢数据。
- `data.sql` 依赖 `LAST_INSERT_ID()` 会话变量，必须单次连接按序执行；生产环境建议改用 Sequelize migrations 并定期备份。

### 开发建议
1. 使用 Postman/Apifox 测试 API 接口
2. 参考 `开发规范文档.md` 了解详细的技术架构
3. 参考 `前端设计规范.md` 了解 UI/UX 设计规范
4. 提交代码前运行代码检查

## 常见问题

### 1. 数据库连接失败
- 检查 MySQL 服务是否启动、`server/.env` 的 `DB_*` 是否与建库语句一致
- 确认数据库已创建：`CREATE DATABASE mixing_drinks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`

### 2. 端口被占用
- 后端默认端口 3000，可在 `server/.env` 中修改 `PORT`
- 管理后台固定 3001（`manage/vite.config.ts`），不是 5173

### 3. 跨域问题
- 后端已配置 `cors()`，允许所有来源；开发时也可走 Vite 的 `/api` 代理
- 生产环境建议配置白名单

### 4. 小程序请求失败 / 图片不显示
- 检查 `miniprogram/utils/config.js` 的 `baseUrl`；真机预览用局域网 IP，上线用已备案的 HTTPS 域名并在微信公众平台配置 request 合法域名
- 图片由后端 `/uploads` 与 `/images` 静态目录提供，部署时需一并迁移 `server/public/uploads/` 与 `manage/public/images/`

### 5. 部署到服务器
- 在 `manage/.env.production` 设置线上 API 地址后重新构建，由 Nginx 托管 `manage/dist`、反代 `/api/v1` 到 `127.0.0.1:3000`，用 systemd 或 pm2 守护 `npm start`
- 不要用 `npm run init-db` 初始化已有数据的生产库；先导出本地数据，再用新库名导入

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue。

---

**项目版本**: v1.0.0  
**创建日期**: 2026-10-26  
**最后更新**: 2026-11-10
