## 发布
发布的时候通过rsync把代码同步上去，然后通过docker-compose来启动
`
rsync -rvz ./ --exclude-from=.gitignore calvinsun@8.130.31.240:~/mysite --delete
`
这里的-r是递归，-v是回显，-z是压缩，--delete是删除那些本地没有的文件。
