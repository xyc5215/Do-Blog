<p align="center">
  <strong style="font-size: 2em;">DOBLOG</strong>
</p>

<p align="center">
  <em>完全无服务器、边缘原生的博客平台，基于 Cloudflare Workers + D1 + KV 构建</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/运行时-Cloudflare_Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white" />
  <img src="https://img.shields.io/badge/数据库-D1_SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/缓存-Workers_KV-F38020?style=flat-square&logo=cloudflare&logoColor=white" />
  <img src="https://img.shields.io/badge/语言-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/框架-Hono-E36002?style=flat-square" />
  <img src="https://img.shields.io/badge/许可证-MIT-green?style=flat-square" />
</p>

---

# DOBLOG

**DOBLOG** 是一个生产级、零服务器的博客系统，完整运行于 Cloudflare 边缘网络之上。它通过服务端渲染 (SSR) 输出页面，采用几何创意设计体系，内置全功能 SPA 管理后台和中英双语国际化支持 -- 全程无需任何传统服务器。

**零源站。零冷启动。30 秒内全球部署。**

## 交流讨论

欢迎在 [LINUX DO](https://linux.do) 社区参与讨论、反馈问题与功能建议。

---

## 系统架构

```
                    +--------------------+
   用户请求 ------->|  Cloudflare 边缘   |
                    |    (Workers)       |
                    +--------+-----------+
                             |
              +--------------+--------------+
              |              |              |
        +-----v----+  +-----v----+  +------v-----+
        |  Hono    |  |    D1    |  |  Workers   |
        |  路由器   |  | (SQLite) |  |    KV      |
        |  + SSR   |  |          |  | (缓存 +    |
        |  引擎    |  | 文章     |  |  计数器)   |
        +----------+  | 评论     |  +------------+
                       | 设置     |
                       +----------+
```

### 技术架构分层

| 层级 | 技术选型 | 职责 |
|------|---------|------|
| **运行时** | Cloudflare Workers | 边缘计算、请求处理、服务端渲染 |
| **框架** | Hono v4 | 路由、中间件、CORS、请求上下文 |
| **数据库** | D1 (SQLite) | 全部内容的持久化存储 |
| **缓存** | Workers KV | 直读缓存、访问计数器、配置项缓存 |
| **认证** | JWT + PBKDF2-SHA256 | 无状态管理员身份认证 |
| **渲染** | 服务端 TypeScript 模板 | 公共页面零 JS、SEO 友好 |
| **管理后台** | 单文件 SPA (Hash 路由) | 客户端管理面板、无需构建步骤 |

---

## 功能特性

### 内容管理

- **文章系统** -- Markdown 撰写 + 实时预览，自动 slug 生成，封面图片，摘要提取，阅读时间估算
- **分类管理** -- 多级树形结构，支持无限嵌套，slug 路由，自定义排序
- **标签管理** -- 扁平标签体系，自动统计关联文章数量
- **评论系统** -- 嵌套回复，审核队列（通过/待审/拒绝），IP 去重防刷
- **文章版本** -- 完整修订历史，版本编号 + 变更说明
- **关于页面** -- 可配置的 Markdown 内容，渲染为独立页面

### Markdown 编辑器

- 18 个工具栏按钮：加粗、斜体、删除线、H1-H3、无序/有序/任务列表、引用、行内代码、代码块、链接、图片、表格、分割线
- 快捷键：`Ctrl+B` 加粗、`Ctrl+I` 斜体、`Ctrl+K` 插入链接、`Ctrl+S` 保存、`Tab` 缩进
- 实时分栏预览（200ms 防抖）
- 分类/标签选择器（Chip 式 UI，异步从 API 加载）
- 标题自动生成 slug（支持中日韩字符音译）
- 状态栏显示字数/字符数/行数统计
- 已有文章每 30 秒自动保存

### 性能优化

- **KV 直写缓存** -- 设置项、文章列表、单篇文章均缓存于 KV，可配置 TTL
- **缓存自动失效** -- 内容变更时通过 `CacheService` 自动清除对应缓存
- **定时计数刷写** -- 阅读量先写入 KV 缓冲，每 5 分钟通过 `scheduled()` 批量回写 D1
- **零客户端 JS** -- 公共页面为纯 SSR HTML/CSS，无 JavaScript 负载（评论表单除外）

### 国际化 (i18n)

- 中英双语支持（简体中文 / English）
- **前台页面**：语言检测链路 -- `?lang` 查询参数 > `blog_lang` Cookie > `Accept-Language` 请求头 > 默认中文
- **管理后台**：客户端语言切换按钮，偏好持久化至 `localStorage`
- 覆盖全部 UI 界面的 250+ 翻译键值

### 设计体系

- 几何创意设计风格，双色调色板（主色 + 强调色，可配置）
- 亮色/暗色主题，支持 `prefers-color-scheme` 自动检测 + 手动切换
- 响应式布局，CSS Grid / Flexbox，移动端优先断点
- 字体方案：Space Grotesk（标题）+ Inter（正文）+ JetBrains Mono（代码）
- 基于 CSS 自定义属性的流体间距系统

### 安全机制

- PBKDF2-SHA256 密码哈希（100,000 次迭代），通过 Web Crypto API 实现
- JWT Bearer Token 无状态认证，可配置过期时间
- API 路由 CORS 策略
- 安全响应头：`X-Content-Type-Options`、`X-Frame-Options`、`Referrer-Policy`
- 所有用户生成内容均做 HTML 实体转义（防 XSS）
- 评论点赞使用 IP 哈希去重（不存储原始 IP）
- 管理后台路由添加 `noindex, nofollow` 元标签

---

## 项目结构

```
doblog/
├── src/
│   ├── index.ts                  # 应用入口，Workers 导出
│   ├── env.ts                    # 类型定义（Env、数据库行类型、API 类型）
│   ├── middleware/
│   │   └── auth.ts               # JWT 认证中间件
│   ├── routes/
│   │   ├── public.ts             # 公共 SSR 路由（首页、文章、归档、搜索等）
│   │   ├── api.ts                # RESTful API 端点（文章、分类、标签、评论、设置）
│   │   └── admin.ts              # 管理后台 SPA Shell 路由
│   ├── services/
│   │   ├── auth.service.ts       # 认证服务（登录、密码哈希、JWT 签发）
│   │   ├── article.service.ts    # 文章 CRUD、搜索、分页、版本管理
│   │   ├── category.service.ts   # 分类树操作
│   │   ├── tag.service.ts        # 标签 CRUD + 文章计数
│   │   ├── comment.service.ts    # 评论审核、嵌套回复
│   │   ├── settings.service.ts   # 站点设置 + KV 缓存
│   │   └── cache.service.ts      # KV 直写缓存抽象层
│   ├── styles/
│   │   ├── theme.ts              # CSS 自定义属性、设计令牌
│   │   └── main.ts               # 完整 CSS 样式表（~31KB）
│   ├── templates/
│   │   ├── layout.ts             # HTML 文档骨架 + SEO 元数据
│   │   ├── components/           # 可复用模板组件
│   │   │   ├── header.ts         # 导航头部 + 语言切换按钮
│   │   │   ├── footer.ts         # 站点底部
│   │   │   ├── sidebar.ts        # 分类/标签/热门文章侧边栏
│   │   │   ├── article-card.ts   # 文章卡片 + 网格渲染器
│   │   │   ├── comments.ts       # 评论列表 + 评论表单
│   │   │   ├── pagination.ts     # 分页组件
│   │   │   └── seo.ts            # Open Graph / 元标签生成器
│   │   └── pages/                # 完整页面模板
│   │       ├── home.ts           # 首页（文章网格）
│   │       ├── article.ts        # 文章详情（含目录 TOC）
│   │       ├── archive.ts        # 时间线归档
│   │       ├── category.ts       # 分类文章列表
│   │       ├── tag.ts            # 标签文章列表
│   │       ├── search.ts         # 搜索结果
│   │       ├── about.ts          # 关于页面
│   │       ├── error.ts          # 错误页面（404、500）
│   │       └── admin.ts          # 管理后台 SPA（~72KB，完全自包含）
│   └── utils/
│       ├── i18n.ts               # 国际化（中/英翻译表）
│       ├── jwt.ts                # JWT 编码/解码（Web Crypto）
│       ├── password.ts           # PBKDF2-SHA256 哈希/验证
│       ├── markdown.ts           # markdown-it 渲染器 + TOC 提取
│       ├── html.ts               # HTML 实体转义
│       ├── slug.ts               # URL Slug 生成（CJK 感知）
│       ├── date.ts               # 日期格式化工具
│       └── pagination.ts         # 分页计算
├── test/
│   ├── utils.test.ts             # 工具函数单元测试
│   ├── crypto.test.ts            # 加密函数测试
│   ├── templates.test.ts         # 模板渲染 + i18n 测试
│   └── integration.test.ts       # 完整 API 集成测试
├── schema.sql                    # D1 数据库建表语句（9 表、10 索引）
├── seed.sql                      # 初始数据（管理员用户、默认设置）
├── wrangler.toml                 # Cloudflare Workers 配置文件
├── tsconfig.json                 # TypeScript 编译器配置
├── vitest.config.ts              # 测试运行器配置
└── package.json                  # 依赖声明与脚本命令
```

---

## 环境要求

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| [Node.js](https://nodejs.org/) | >= 18 | JavaScript 运行时 |
| [Cloudflare 账户](https://dash.cloudflare.com/sign-up) | -- | 免费套餐即可 |
| [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) | >= 3.0 | Cloudflare 官方 CLI 工具 |

---

## 完整部署指南

> 以下步骤将引导你从零开始，将 DOBLOG 部署到 Cloudflare Workers 全球边缘网络。全程约需 5-10 分钟。

### 第一步：克隆仓库并安装依赖

```bash
git clone https://github.com/<your-username>/doblog.git
cd doblog
npm install
```

安装完成后，项目根目录将出现 `node_modules/` 目录，包含以下核心依赖：
- `hono` -- Web 框架
- `markdown-it` -- Markdown 渲染引擎
- `wrangler` -- Cloudflare 部署工具

### 第二步：登录 Cloudflare

```bash
npx wrangler login
```

执行后会自动打开浏览器，完成 OAuth 授权流程。授权成功后终端将显示：

```
Successfully logged in.
```

> **提示**：如果你已经登录过，可以跳过此步骤。通过 `npx wrangler whoami` 验证当前登录状态。

### 第三步：创建 D1 数据库

D1 是 Cloudflare 提供的无服务器 SQLite 数据库，用于存储文章、分类、评论等全部数据。

```bash
npx wrangler d1 create cf-blog-db
```

命令输出示例：

```
Successfully created DB 'cf-blog-db' in region APAC
Created your new D1 database.

[[d1_databases]]
binding = "DB"
database_name = "cf-blog-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**将输出中的 `database_id` 复制到 `wrangler.toml` 文件中**，替换 `<YOUR_D1_DATABASE_ID>`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "cf-blog-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # <-- 替换为你的实际 ID
```

### 第四步：创建 KV 命名空间

Workers KV 用于缓存热点数据（设置、文章列表、阅读计数等），大幅降低 D1 查询压力。

```bash
npx wrangler kv namespace create BLOG_KV
```

命令输出示例：

```
🌀 Creating namespace with title "cf-blog-BLOG_KV"
Add the following to your configuration file in your kv_namespaces array:
[[kv_namespaces]]
binding = "BLOG_KV"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**将输出中的 `id` 复制到 `wrangler.toml` 文件中**，替换 `<YOUR_KV_NAMESPACE_ID>`：

```toml
[[kv_namespaces]]
binding = "BLOG_KV"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  # <-- 替换为你的实际 ID
```

### 第五步：初始化数据库

执行建表语句和种子数据，在远程 D1 中创建完整的数据库结构：

```bash
# 创建表结构（9 张表、10 个索引）
npx wrangler d1 execute cf-blog-db --remote --file=schema.sql

# 写入初始数据（管理员账户、默认设置、默认分类）
npx wrangler d1 execute cf-blog-db --remote --file=seed.sql
```

> **数据库包含以下表**：
> | 表名 | 用途 |
> |------|------|
> | `admin` | 管理员账户（单用户） |
> | `articles` | 文章内容 |
> | `categories` | 分类（支持多级） |
> | `tags` | 标签 |
> | `article_categories` | 文章-分类关联（多对多） |
> | `article_tags` | 文章-标签关联（多对多） |
> | `comments` | 评论（支持嵌套回复） |
> | `article_versions` | 文章版本历史 |
> | `likes` | 点赞记录（IP 哈希去重） |
> | `settings` | 站点配置（键值对） |

### 第六步：设置 JWT 密钥

JWT 密钥用于签发和验证管理员登录令牌，必须设置为一个高强度随机字符串：

```bash
npx wrangler secret put JWT_SECRET
```

终端将提示输入密钥值：

```
Enter a secret value: ********************************
```

> **安全建议**：密钥长度建议 32 个字符以上，推荐使用 `openssl rand -hex 32` 或类似工具生成。此密钥不会出现在代码中，由 Cloudflare 安全加密存储。

### 第七步：部署到生产环境

```bash
npx wrangler deploy
```

部署成功后输出：

```
Uploaded cf-blog (x.xx sec)
Published cf-blog (x.xx sec)
  https://cf-blog.<your-subdomain>.workers.dev
```

你的博客现已在全球 300+ 个 Cloudflare 边缘节点上线运行。

---

## 首次登录与密码设置

> **重要**：首次登录的密码设置机制是一次性的，请务必认真操作。

1. 在浏览器中访问 `https://<your-domain>/admin`
2. 用户名输入 `admin`
3. 密码输入**你希望设置的管理密码**（任意字符串）
4. 首次登录时，系统会将你输入的密码进行 PBKDF2-SHA256 哈希后永久存储
5. 后续登录将使用此密码验证

> **注意**：首次密码设定后，如需修改密码，需直接操作 D1 数据库。因此请在首次登录时就设置一个强密码。

---

## 本地开发

```bash
# 启动本地开发服务器（自动模拟 D1 + KV）
npm run dev

# 初始化本地数据库（仅首次需要）
npm run db:init
npm run db:seed

# 类型检查
npm run typecheck

# 运行测试
npm run test

# 测试监听模式
npm run test:watch
```

本地开发服务器启动后，默认监听 `http://localhost:8787`，自动提供 D1 和 KV 的本地模拟环境。

---

## 管理后台使用指南

登录后，管理后台提供以下功能模块：

### 仪表盘
- 查看文章总数、待审评论数、总阅读量、总点赞数
- 热门文章排行榜

### 文章管理
- 新建/编辑/删除文章
- Markdown 编辑器 + 实时预览
- 发布/取消发布切换
- 按状态筛选（已发布/草稿）

### 分类管理
- 新建/编辑/删除分类
- 支持层级排序

### 标签管理
- 新建/编辑/删除标签
- 显示关联文章数

### 评论管理
- 按状态筛选（全部/待审/已通过/已拒绝）
- 通过/拒绝/删除操作

### 站点设置
- 基本信息：站点标题、副标题、描述、Logo
- 内容设置：每页文章数、评论审核开关
- 导航菜单：自定义导航链接（格式：`名称|URL`，每行一条）
- 社交链接：自定义社交媒体链接
- 页脚内容：自定义页脚文本
- 关于页面：Markdown 格式的关于页内容

### 语言切换
- 管理后台侧边栏底部提供中/英语言切换
- 前台页面导航栏提供语言切换按钮
- 偏好设置自动记忆

---

## API 参考

除 `POST /api/auth/login` 外，所有 API 端点均需在请求头中携带 `Authorization: Bearer <token>`。

### 认证

| 方法 | 端点 | 说明 |
|------|------|------|
| `POST` | `/api/auth/login` | 登录认证，返回 JWT 令牌 |

### 文章

| 方法 | 端点 | 说明 |
|------|------|------|
| `GET` | `/api/articles` | 获取文章列表（分页，可按状态筛选） |
| `POST` | `/api/articles` | 创建文章 |
| `GET` | `/api/articles/:id` | 根据 ID 获取文章 |
| `PUT` | `/api/articles/:id` | 更新文章 |
| `DELETE` | `/api/articles/:id` | 删除文章 |
| `POST` | `/api/articles/:id/publish` | 发布文章 |
| `POST` | `/api/articles/:id/unpublish` | 取消发布 |

### 分类

| 方法 | 端点 | 说明 |
|------|------|------|
| `GET` | `/api/categories` | 获取分类列表（树形结构） |
| `POST` | `/api/categories` | 创建分类 |
| `PUT` | `/api/categories/:id` | 更新分类 |
| `DELETE` | `/api/categories/:id` | 删除分类 |

### 标签

| 方法 | 端点 | 说明 |
|------|------|------|
| `GET` | `/api/tags` | 获取标签列表（含文章计数） |
| `POST` | `/api/tags` | 创建标签 |
| `PUT` | `/api/tags/:id` | 更新标签 |
| `DELETE` | `/api/tags/:id` | 删除标签 |

### 评论

| 方法 | 端点 | 说明 |
|------|------|------|
| `GET` | `/api/comments` | 获取评论列表（可按状态筛选） |
| `POST` | `/api/comments/:id/approve` | 通过评论 |
| `POST` | `/api/comments/:id/reject` | 拒绝评论 |
| `DELETE` | `/api/comments/:id` | 删除评论 |

### 设置

| 方法 | 端点 | 说明 |
|------|------|------|
| `GET` | `/api/settings` | 获取站点设置 |
| `PUT` | `/api/settings` | 更新站点设置 |

### 统计

| 方法 | 端点 | 说明 |
|------|------|------|
| `GET` | `/api/analytics/overview` | 仪表盘总览数据 |
| `GET` | `/api/analytics/popular` | 热门文章（按阅读量排序） |

---

## 配置说明

### 环境变量

| 变量名 | 是否必填 | 说明 |
|--------|---------|------|
| `JWT_SECRET` | 是 | JWT 令牌签名密钥（通过 `wrangler secret put` 设置） |
| `BLOG_ENV` | 否 | 环境标识符（默认：`production`） |

### 站点设置（通过管理后台配置）

| 设置项 | 说明 |
|--------|------|
| 站点标题 | 显示在页面头部和 meta 标签中的博客名称 |
| 副标题 | 标题下方的标语 |
| 站点描述 | SEO meta description |
| Logo URL | 头部 Logo 图片地址 |
| 每页文章数 | 分页大小（默认：10） |
| 评论审核 | 启用/禁用评论审核队列 |
| 导航菜单 | 自定义导航链接（格式：`名称\|URL`，每行一条） |
| 社交链接 | 社交媒体链接（格式：`名称\|URL`，每行一条） |
| 页脚内容 | 自定义页脚文本 |
| 关于页面 | `/about` 页面的 Markdown 内容 |

---

## 技术栈

| 组件 | 技术选型 | 选型理由 |
|------|---------|---------|
| 运行时 | Cloudflare Workers | V8 隔离沙箱，0ms 冷启动，全球 300+ PoP 节点 |
| 数据库 | D1 (SQLite) | 无服务器关系型数据库，零配置，自动复制 |
| 缓存 | Workers KV | 最终一致性，全球分布式键值存储 |
| 框架 | Hono | 超轻量级（14KB），Workers 原生支持，丰富中间件生态 |
| 语言 | TypeScript | 全栈类型安全，零运行时开销 |
| Markdown | markdown-it | 可扩展解析器，支持锚点插件生成目录 |
| 测试 | Vitest | 高速 TypeScript 原生测试运行器，兼容 Workers 环境 |
| 认证 | JWT + PBKDF2 | 基于 Web Crypto API 的无状态认证（零外部依赖） |

---

## 测试

```bash
# 运行全部单元测试
npm test

# 监听模式（文件变更自动重跑）
npm run test:watch

# 类型检查
npm run typecheck
```

测试覆盖范围：

| 测试类型 | 覆盖内容 |
|---------|---------|
| **工具函数** | HTML 转义、日期格式化、Slug 生成、分页计算 |
| **加密函数** | JWT 编码/解码、PBKDF2 密码哈希/验证 |
| **模板渲染** | 组件输出校验、i18n 双语断言、XSS 防护验证 |
| **集成测试** | 完整 API 端点测试（文章、分类、标签、评论、设置全生命周期） |

---

## 自定义域名（可选）

如需绑定自定义域名，请在 Cloudflare Dashboard 中：

1. 进入 **Workers & Pages** > 选择 `cf-blog`
2. 点击 **Settings** > **Triggers** > **Custom Domains**
3. 添加你的域名（该域名需已托管在 Cloudflare DNS 上）
4. Cloudflare 将自动签发 SSL 证书并配置路由

---

## 常见问题

### Q: 首次登录提示"无效凭据"？
A: 确认已执行 `seed.sql` 初始化了管理员账户。种子数据中的密码哈希为占位符，首次登录时系统会自动用你输入的密码替换。

### Q: 部署后页面报 Internal Server Error？
A: 检查以下几项：
1. `wrangler.toml` 中的 `database_id` 和 KV `id` 是否正确填入
2. 是否已执行 `schema.sql` 和 `seed.sql`
3. 是否已通过 `wrangler secret put JWT_SECRET` 设置密钥

### Q: 如何重置管理员密码？
A: 通过 D1 控制台直接执行 SQL：
```bash
npx wrangler d1 execute cf-blog-db --remote --command="UPDATE admin SET password_hash='pbkdf2:100000:a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4:placeholder_hash_replace_on_first_run' WHERE username='admin'"
```
然后重新访问 `/admin` 登录，输入的密码将作为新密码。

### Q: 免费套餐有什么限制？
A: Cloudflare Workers 免费套餐包含：
- Workers：每日 100,000 次请求
- D1：500MB 存储、5,000,000 次读取/天、100,000 次写入/天
- KV：100,000 次读取/天、1,000 次写入/天
- 对于个人博客完全足够。

---

## 许可证

[MIT](LICENSE)

---

<p align="center">
  <sub>Built with Cloudflare Workers -- Deployed at the edge, worldwide.</sub>
</p>
