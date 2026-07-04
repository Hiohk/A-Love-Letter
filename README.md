# 给阿嬤的情书 · 侨批主题虚拟博物馆

> 一封写给阿嬤的纸信，也是一座漂浮在浏览器里的微型博物馆。
> *A virtual museum themed around overseas-Chinese letters (qiáopī), framed as a letter to grandma.*

![status](https://img.shields.io/badge/status-active-success)
![stack](https://img.shields.io/badge/stack-React%2019%20%C2%B7%20Vite%207%20%C2%B7%20Framer%20Motion-blue)
![docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white)
![license](https://img.shields.io/badge/license-MIT-green)

---

## 项目简介

"给阿嬤的情书" 是一座以**侨批**（海外华侨寄回国内的信件 / 银信）为主题的虚拟博物馆，用 React + Vite 构建。所有内容由 `scripts/generate-content.mjs` 自动从原始素材生成，再通过纯前端 SPA 呈现：

- **序厅** —— 海上纸路，海水很远的家书启程
- **序章 · 听** —— 嵌入 Apple Music 主题曲《月下煮茶》
- **一厅 ~ 四厅** —— 四帧侨批主题展品，可生成可保存的明信片
- **邮筒墙** —— 用户可翻阅明信片、收藏喜欢的寄件

支持「明信片导出」、「收藏」等互动，并以**垂直展开的中文展签 + 横排标题**做出纸张感。

---

## 特性

- ⚡️ **Vite 7** + **React 19** —— 冷启动 < 1s，HMR 即时
- 🎞️ **Framer Motion** 动效 —— 翻页、滚动揭示、入场动画
- 🎨 **双字标体** —— `Ma Shan Zheng` + `ZCOOL XiaoWei` + `Noto Serif SC` 渲染竖排墨味
- 🎵 **Apple Music 嵌入** —— 主题曲可直接播放
- 🖼️ **明信片导出** —— `html2canvas` 一键保存为图片
- 💾 **本地收藏** —— `localStorage` 持久化，无需后端
- 🐳 **Docker 一键部署** —— 多阶段构建，nginx 运行时，镜像 < 50MB
- 🛣️ **React Router** —— 多路由 SPA，配合 nginx `try_files` 回退

---

## 在线预览

![preview](./public/preview/home.png)

---

## 项目结构

```
a-love-letter/
├─ public/                 # 静态资源（直接拷贝到 dist/）
│  ├─ exhibits/            # 展品图片（png / svg）
│  ├─ portraits/           # 明信片插画
│  ├─ videos/              # 展品视频
│  ├─ data/                # 内容 JSON
│  └─ fonts/               # 自定义字体
├─ scripts/
│  ├─ generate-content.mjs # 生成侨批内容数据
│  └─ deploy.sh            # 远端 Docker 部署脚本
├─ src/
│  ├─ main.jsx             # React 主入口 + 各展厅
│  ├─ styles.css           # 全站样式
│  ├─ App.jsx              # 路由壳
│  └─ components/          # 可复用组件
├─ Dockerfile              # 多阶段构建
├─ nginx.conf              # SPA fallback + 缓存策略
├─ docker-compose.yml      # 一键起服
├─ vite.config.js
├─ package.json
└─ README.md
```

---

## 快速开始

### 环境要求
- Node.js **>= 20**
- npm **>= 10**（或 pnpm / yarn）
- （可选）Docker **>= 24**

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
# 默认 http://127.0.0.1:5173/
```

### 3. 构建生产产物
```bash
npm run build
# 输出到 dist/
```

### 4. 本地预览构建产物
```bash
npm run preview
# 默认 http://127.0.0.1:4173/
```

### 5. 重新生成内容数据
```bash
npm run generate:content
```

---

## Docker 部署

### 方式 A：本地构建后上传
```bash
docker build -t a-love-letter:latest .
docker save a-love-letter:latest | gzip > a-love-letter.tar.gz
scp a-love-letter.tar.gz user@your-server:/tmp/

ssh user@your-server <<'EOF'
  docker load < /tmp/a-love-letter.tar.gz
  docker rm -f a-love-letter 2>/dev/null || true
  docker run -d --name a-love-letter \
    --restart unless-stopped \
    -p 80:80 \
    a-love-letter:latest
EOF
```

### 方式 B：docker compose
```bash
docker compose up -d --build
# 修改端口：HTTP_PORT=8080 docker compose up -d --build
```

### 方式 C：远端一键部署脚本
```bash
REGISTRY=ghcr.io/your-org \
DEPLOY_HOST=user@your-server \
HTTP_PORT=80 \
./scripts/deploy.sh
```

部署完成后：

| URL                                   | 含义                                      |
| ------------------------------------- | ----------------------------------------- |
| `http://your-server/`                 | 首页                                      |
| `http://your-server/two`              | 深链接（依赖 SPA fallback，刷新不会 404） |
| `http://your-server/exhibits/one.png` | 静态资源                                  |


## GitHub Actions 自动构建镜像（可选）
在 `.github/workflows/docker.yml` 中放置：

```yaml
name: Docker
on:
  push:
    branches: [main]
    tags: ["v*"]
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
```

---

## 自定义

| 想改的             | 改哪里                                                        |
| ------------------ | ------------------------------------------------------------- |
| 主题色 / 墨色 / 红 | `src/styles.css` 顶部的 CSS 变量（`--ink` `--red` `--paper`） |
| 字体               | `public/index.html` 里的 Google Fonts `<link>`                |
| 展品顺序 / 文案    | 编辑 `public/data/*.json` 或重跑 `npm run generate:content`   |
| 子路径部署         | `vite.config.js` 设置 `base: "/museum/"`                      |
| Apple Music 曲目   | `src/main.jsx` 的 `MusicHall` 组件                            |
| 部署端口           | `docker-compose.yml` 的 `HTTP_PORT` 环境变量                  |

---

## 可用脚本

```jsonc
{
  "dev":              "vite --host 127.0.0.1",
  "build":            "vite build",
  "preview":          "vite preview --host 127.0.0.1",
  "generate:content": "node scripts/generate-content.mjs",
  "docker:build":     "docker build -t a-love-letter:latest .",
  "docker:run":       "docker run -d --name a-love-letter -p 8080:80 a-love-letter:latest",
  "docker:up":        "docker compose up -d --build",
  "docker:down":      "docker compose down"
}
```

---

## 浏览器兼容

| 浏览器               | 支持             |
| -------------------- | ---------------- |
| Chrome / Edge        | ✅ 最新两个大版本 |
| Safari (macOS / iOS) | ✅ 16+            |
| Firefox              | ✅ 115+           |
| IE                   | ❌                |

`framer-motion` 与 `html2canvas` 依赖现代 ES 特性，不支持 IE。

---

## 致谢

- 字体：[马善政毛笔楷书 (Ma Shan Zheng)](https://fonts.google.com/specimen/Ma+Shan+Zheng)、[ZCOOL XiaoWei](https://fonts.google.com/specimen/ZCOOL+XiaoWei)
- 主题曲：电影《给阿嬤的情书》主题曲《月下煮茶》（Apple Music）
- 受真实侨批档案启发

---

## License

MIT © Contributors — 详见 [LICENSE](./LICENSE)

如果你用这个仓库做了延伸作品，欢迎提 Issue / PR。

---

## A Letter to Grandma · Qiaopi Virtual Museum

*A React + Vite single-page application that frames an overseas-Chinese epistolary museum as a letter to grandma. Includes four exhibit halls, an Apple Music embed, postcard export, and a Docker-ready nginx image.*

```bash
npm install && npm run dev
docker compose up -d --build
```

Made with 🌊 in a paper-thin browser.