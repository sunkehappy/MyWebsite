# Deploy with Docker

本项目包含两套 Docker 用法，详见 [根目录 README](../../README.md#本地-docker)。

## 仅 Next.js（`myblog/Dockerfile`）

```bash
cd myblog
docker build -t myblog .
docker run --rm -p 3000:3000 myblog
```

镜像基于 Node 18 + pnpm + pm2-runtime，构建时执行 `pnpm build`，启动命令为 `pnpm serve`（`next start`）。

## 完整栈（仓库根目录 `docker-compose.yml`）

需先静态导出并填充 `nginx/out/`，再在仓库根目录执行：

```bash
cd myblog && pnpm export && cd ..
mkdir -p nginx/out && cp -r myblog/out/* nginx/out/
docker compose up --build -d
```

线上发布流程见根目录 `release.sh` 与 [README.md](../../README.md)。
