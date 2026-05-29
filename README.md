## 网站地址

https://www.calvinhappy.com

## 初始化

代码仓库使用了 submodule，克隆时需加上 `--recurse-submodules` 参数：

```bash
git clone --recurse-submodules <repo-url>
```

## 本地开发

在 `myblog` 目录安装依赖并启动开发服务器：

```bash
cd myblog
pnpm install   # 首次需要
pnpm dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## 本地 Docker

线上以 **静态导出 + Nginx** 部署；`myblog/Dockerfile` 与根目录 `docker-compose.yml` 配合使用。日常开发推荐 `pnpm dev`，Docker 用于本地验证镜像或与线上一致的编排。

### 方式一：仅启动 Next.js 容器（在 `myblog` 目录）

只构建并运行 `myblog` 镜像，容器内执行 `pnpm build` 后以 `pnpm serve`（`next start`）监听 3000 端口。**不是**线上的静态导出模式。

```bash
cd myblog
docker build -t myblog .
docker run --rm -p 3000:3000 myblog
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

停止容器：`Ctrl+C`（`docker run` 前台）或另开终端 `docker stop <container_id>`。

### 方式二：完整栈（Nginx + Next.js，与线上一致）

在**仓库根目录**执行。主站由 Nginx 提供 `nginx/out/` 中的静态文件，启动前须先导出并拷贝静态资源。

```bash
# 在仓库根目录 next-js-blog 下执行

# 1. 静态导出
cd myblog
pnpm install   # 首次需要
pnpm export
cd ..

# 2. 准备 Nginx 静态目录（与 release.sh 相同）
mkdir -p nginx/out
cp -r myblog/out/* nginx/out/

# 3. 构建并后台启动
docker compose up --build -d
```

| 服务 | 端口 | 说明 |
|------|------|------|
| `nginx` | 80, 443 | 提供静态站与 HTTPS；80 会 301 到 `https://www.calvinhappy.com` |
| `nextjs` | 3000 | SSR 备用，当前主站 Nginx 配置未反向代理到该服务 |

**本地访问主站静态页：** `nginx/default.conf` 将 HTTP 重定向到 `https://www.calvinhappy.com`。若要在本机用域名访问，可在 `/etc/hosts` 增加：

```text
127.0.0.1 www.calvinhappy.com
```

然后访问 `https://www.calvinhappy.com`（证书域名不匹配时浏览器会有安全提示，属预期行为）。若只想快速预览静态导出结果，可在 `myblog` 下执行 `npx serve out`（无需 Docker）。

常用命令（在仓库根目录）：

```bash
docker compose ps              # 查看状态
docker compose logs -f nginx   # 查看 Nginx 日志
docker compose restart nginx   # 仅重启 Nginx（例如更新了 nginx/out）
docker compose down            # 停止并移除容器
```

更多说明见 [myblog/faq/deploy-with-docker.md](myblog/faq/deploy-with-docker.md)。

## 发布

### 一键发布（本地）

根目录执行 `./release.sh`，会依次：

1. `cd myblog && pnpm export` 生成静态站
2. 拷贝到 `nginx/out/`
3. `rsync` 同步到服务器 `root@47.120.38.184:~/mysite`

脚本内 SSH 自动执行 `docker compose` 目前为注释状态，同步后需登录服务器手动启动（见下）。

### 线上启动

SSH 登录服务器后，在项目目录执行：

```bash
cd ~/mysite
docker compose up --build -d
```

`-d` 表示后台运行；`--build` 在镜像或静态资源有变更时重新构建。

### 手动 rsync

也可手动同步（参数含义：`-r` 递归，`-v` 回显，`-z` 压缩，`--delete` 删除远端多余文件）：

```bash
rsync -rvz ./ --exclude-from=.gitignore calvinsun@8.130.31.240:~/mysite --delete
```

## 配置

公司网络可能封禁阿里云 SSH 的 22 端口，可在本机 `/etc/ssh/ssh_config` 为对应 Host 指定端口，例如：

```text
Host 8.130.31.240
     Port xx
```
