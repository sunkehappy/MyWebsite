#!/usr/bin/env bash
set -euo pipefail

cd myblog
pnpm export
cd ..
rm -rf ./nginx/out/*
mkdir -p ./nginx/out
cp -r ./myblog/out/* ./nginx/out/

SERVER="root@47.120.38.184"
REMOTE_DIR="~/mysite"

rsync -rvz ./ --include=nginx/out --include=.git --exclude-from=.gitignore "${SERVER}:${REMOTE_DIR}" --delete

# 线上只跑 Nginx + 静态文件挂载，不 rebuild 镜像（避免服务器上 Node build 卡死）
ssh "${SERVER}" bash -s << 'EOF'
set -euo pipefail
cd ~/mysite
git push
docker compose up -d
docker compose restart nginx
EOF

echo done!
