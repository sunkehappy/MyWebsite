# !/usr/bin/env Python
# coding=utf-8
import os
import re

cur_dir = os.getcwd()
for sub_dir in os.listdir(cur_dir):
  if sub_dir == "add-date.py":
    continue
  date = sub_dir[:10]
  full_path = os.path.join(cur_dir, sub_dir)
  opened_file = open(full_path, 'r+', encoding='utf-8')
  lines = opened_file.readlines()
  opened_file.close()

  opened_file = open(full_path, 'w', encoding='utf-8')
  lines.insert(1, "date: " + date + "\n")
  # for index, line in enumerate(lines):
  #   # lines[index] = lines[index].replace("---", "+++")
  #   lines[index] = lines[index].replace("title:", "title=")
  #   if "title=" in lines[index]:
  #     title = lines[index].split("title=")[1].strip()
  #     lines[index] = "title=" + '"' + title + '"\n'

  #   lines[index] = lines[index].replace("tags:", "tags=")
  #   lines[index] = lines[index].replace("category:", "category=")
  lines = list(filter(lambda x: "layout:" not in x, lines))
  opened_file.writelines(lines)
  # break
  opened_file.close()
