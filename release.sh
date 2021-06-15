cd myblog
hugo --baseUrl="https://blog.calvinhappy.com/" -d ../nginx/public
cd ..
rsync -rvz ./ --exclude-from=.gitignore calvinsun@8.130.31.240:~/mysite --delete
# ssh calvinsun@8.130.31.240 > /dev/null 2>&1 << eeooff
# cd mysite
# # -d表示以守护进程来启动
# sudo docker-compose up --build -d
# eeooff
echo done!
