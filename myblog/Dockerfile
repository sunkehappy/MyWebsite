# Base on offical Node.js Alpine image
FROM crpi-y1oqrhrhulb9xx3y.cn-heyuan.personal.cr.aliyuncs.com/calvin_docker_space/my-blog-node:18.20.5-pnpm-pm2

# Set working directory
WORKDIR /usr/app

# 修改源，加快安装速度
# RUN npm config set registry https://registry.npm.taobao.org

# 安装pm2会要求最新版本的python
# RUN sudo apt-get update -y
# RUN sudo apt-get install -y python

# Install PM2 globally
# RUN pnpm config set registry https://registry.npmmirror.com/
# RUN pnpm install --global pm2

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy all files
COPY ./ ./

# Build app
RUN pnpm build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
# USER node

# Run npm start script with PM2 when container starts
CMD [ "./node_modules/.bin/pm2-runtime", "pnpm", "--", "serve" ]
