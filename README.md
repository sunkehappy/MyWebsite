## 网站地址
https://www.calvinhappy.com

## 初始化
代码仓库使用了submodule，所以在克隆项目的时候需要加上`--recurse-submodules`参数来获取必要的依赖。

## 发布
发布的时候通过rsync把代码同步上去，然后通过docker-compose来启动
`
rsync -rvz ./ --exclude-from=.gitignore calvinsun@8.130.31.240:~/mysite --delete
`
这里的-r是递归，-v是回显，-z是压缩，--delete是删除那些本地没有的文件。

## 配置
由于在公司的时候公司网络连到阿里云的ssh默认22端口被封掉了，所以为了方便，ssh使用了xx端口，所以需要所有环境的ssh的端口配置一下，可以通过修改/etc/ssh/ssh_config里面的配置来实现，如下：
`
Host 8.130.31.240
     Port xx
`
