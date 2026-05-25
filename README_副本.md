### 本地调试
hugo server

### 发布
单独打包的话是这样：hugo --baseUrl="https://blog.calvinhappy.com/" -d ../nginx/public
但是一般直接在上层目录通过docker来发布就可以了。
