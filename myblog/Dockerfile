# Base on offical Node.js Alpine image
# FROM crpi-y1oqrhrhulb9xx3y.cn-heyuan.personal.cr.aliyuncs.com/calvin_docker_space/my-blog-node:18.20.5-pnpm-pm2
# FROM node:20-slim
FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/node:20.16

# alinux3/node 镜像默认以 node 用户运行，全局 npm install 会 EACCES
USER root

# 与 package.json 中 packageManager 一致；须 root 安装，且勿省略版本（否则 npm 会装 pnpm@11）
RUN npm config set registry https://registry.npmmirror.com \
  && npm install -g pnpm@9.15.3

WORKDIR /usr/app
RUN chown -R node:node /usr/app
USER node

# 安装pm2会要求最新版本的python
# RUN sudo apt-get update -y
# RUN sudo apt-get install -y python

# Install PM2 globally
# RUN pnpm config set registry https://registry.npmmirror.com/
# RUN pnpm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY --chown=node:node ./package.json ./pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy all files
COPY --chown=node:node ./ ./

# Build app
RUN pnpm build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
# USER node

# Run npm start script with PM2 when container starts
CMD [ "./node_modules/.bin/pm2-runtime", "pnpm", "--", "serve" ]
