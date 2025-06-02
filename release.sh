cd myblog
pnpm export
cd ..
rm -rf ./nginx/out/*
mkdir -p ./nginx/out // 如果已存在，则不会报错
cp -r ./myblog/out/* ./nginx/out/
rsync -rvz ./ --include=nginx/out --exclude-from=.gitignore calvinsun@47.120.38.184:~/mysite --delete
# ssh calvinsun@47.120.38.184 > /dev/null 2>&1 << eeooff
# cd mysite
# # -d表示以守护进程来启动
# docker compose up --build -d
# eeooff
echo done!
