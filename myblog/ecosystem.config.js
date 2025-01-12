module.exports = {
  apps: [
    {
      name: 'nextjs-app', // 应用名称
      script: 'npm', // 使用 npm 脚本启动
      args: 'start', // 运行 npm start
      env: {
        NODE_ENV: 'production', // 设置环境变量
        PORT: 3000, // 应用监听的端口
      },
    },
  ],
}
