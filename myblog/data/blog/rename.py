import re
import os

def process_mdx_file(file_path):
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    prefix = content[:3]
    content = content[3:]

    # 正则表达式匹配 --- 和 <!--more--> 之间的文本
    match = re.search(r'---(\s*.*?\s*)<!--more-->', content, re.DOTALL)
    
    if match:
        # 捕获的文本（--- 和 <!--more--> 之间的内容）
        captured_text = match.group(1)
        print(captured_text)

        # 构造 summary 内容
        summary_content = f"summary: {captured_text.strip()}"

        # 替换源文件内容
        new_content = content.replace(f"---{captured_text}<!--more-->", f"{summary_content.strip()}\n---\n{captured_text.strip()}")
        new_content = prefix + new_content

        # 将修改后的内容写回文件
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(new_content)

        print(f"Processed file: {file_path}")
    else:
        print(f"No match found in file: {file_path}")

def process_all_mdx_files(directory):
    # 获取当前目录
    current_dir = os.getcwd()

    # 遍历当前目录下所有的 .md 文件
    for filename in os.listdir(current_dir):
        if filename.endswith(".md"):
            new_name = filename[:-3] + ".mdx"  # 去掉 .md 后缀并加上 .mdx
            os.rename(filename, new_name)  # 重命名文件
            print(f"Renamed: {filename} -> {new_name}")
            
    for filename in os.listdir(directory):
        if filename.endswith('.mdx'):
            process_mdx_file(os.path.join(directory, filename))


if __name__ == "__main__":
    # 指定你要处理的文件路径
    file_path = '2015-02-27-reading-notes-one-of-advanced-programming-in-the-Unix-environment.mdx'  # 替换成你的文件路径

    # 调用函数处理文件
    process_mdx_file(file_path)

    # 使用当前目录
    process_all_mdx_files('.')

