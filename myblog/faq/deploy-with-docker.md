# Deploy with Docker

本项目包含两套 Docker 用法，详见 [根目录 README](../../README.md#本地-docker)。

## 仅 Next.js（`myblog/Dockerfile`）

本地开发调试用，**线上不使用**。

```bash
cd myblog
docker build -t myblog .
docker run --rm -p 3000:3000 myblog
```

镜像基于 Node + pnpm + pm2-runtime，构建时执行 `pnpm build`，启动命令为 `pnpm serve`（`next start`）。

## 线上：Nginx + 静态文件（根目录 `docker-compose.yml`）

静态站在**本地** `pnpm export` 后写入 `nginx/out/`，线上 Nginx 通过 volume 挂载该目录，**不在服务器上 build Next.js**。

```bash
cd myblog && pnpm export && cd ..
mkdir -p nginx/out && cp -r myblog/out/* nginx/out/
docker compose up -d          # 日常：不 rebuild
docker compose restart nginx  # 更新了 nginx/out 后
```

首次部署或修改 Nginx 配置/证书时：

```bash
docker compose up -d --build
```

线上发布流程见根目录 `release.sh` 与 [README.md](../../README.md)。
