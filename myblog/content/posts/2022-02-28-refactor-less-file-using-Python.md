---
date:           2022-02-28
category:       前端
title:          借助脚本重构.less文件
tags:           [React, less, Python]
---

## 背景
在升级next.js过程中，遇到需要把已有的.less和.scss文件重命名为.module.scss。而项目比较大，文件比较多，如果手工改，就会非常费时，而且容易出错。所以就想通过脚本来做这些事情。
计划
首先要总结下我们都要做哪些事情，然后再看如何去做：
1. 转换.less文件为.scss文件
2. 重命名.scss文件为.module.scss文件
3. 所有相关导入需要更新为正确的文件名
4. 处理过程中发现的别的问题

然后我们再看下如何做：
1. 通过查找，已经有工具(例如less2scss)可以做这个事情，而且从初步转换结果来看，基本都是文件重命名，少部分是变量定义和引用，还有@mixin(@mixin 与 @include)。
2. 通过脚本根据规律批量重命名即可
3. 因为是要全量替换，所以可以在脚本中通过正则抓去被import的文件名，然后替换一下即可
4. 边做边完善脚本
## 实操
转换.less文件为.scss文件
有一点需要注意，我们不是直接操作根目录，因为node_modules也在根目录，这个目录不需要处理。然后第一步的转换，直接用命令对目标目录操作即可完成：
```
less2scss -s ./client -r & less2scss -s ./pages -r
```

重命名.scss文件为.module.scss文件
脚本语言我选了Python，因为这种脚本不需要维护，一次性的，所以并不需要多么完善，简单省事儿就好了。Python在字符串和数组的处理上，还是非常优秀的。
先写个伪代码，方便理解：
```
for file in 根目录:    
    if file.endswith(".scss"):        
        rename(file, file + ".module.scss")
```
所有相关导入需要更新为正确的文件名
这一步操作是做起来比较费时的，因为细节比较多。其中这个正则为了抓去被引入文件的文件名，以及为了一个表达式能覆盖到单双引号，import后面不带变量名等情况，写的比较复杂。所以这里解释下：
```
import\s*([\S]*\s*from\s*)?['"][\S]*.less['"]
```
- \s*是为了包含0或多个空格的情况
- [\S]*是被引入的文件的那个变量
- ([\S]*\s*from\s*)?最外层是一个可选，表示有可能没有。
- ['\"]表示是单引号，或者双引号
- [a-zA-Z?=]*，里层的这块是为了包含index.less?noCssModule=true这种情况，后面有问好和参数，其实整个工程里面这种情况也就两处。
- [\S]*.less，这里就是xxx.less。
```
for file in 根目录:    # 不仅源代码里面有样式的引用，样式文件里面也有引用    
    if file.suffix in [".jsx", ".tsx", ".less", ".scss", ".ts"]:        
        for line in file:            
            # regular_expression就是Python里面的re            
            re_expr = import\s*([a-zA-Z]*\s*from\s*)?['"][\S]*.less['"]            
            if regular_expression.search(re_expr, line):                
                # 下面两行顺序不能颠倒                
                line.replace(".scss", ".module.scss")                
                line.replace(".less", ".module.scss")     
                # 这里只是简单说明效果，正常代码中，读取和写入，直接分两次     
                # 第一次只读取文件，并备份，在备份上做修改，然后关闭文件     
                # 第二次以写模式打开文件，写入上面的备份，再关闭文件     
                file.write_with_changes()

处理过程中发现的别的问题
第一个问题就是转换完原来的.less文件没有被删掉，这个简单，脚本再完善下删掉即可。
第二个问题是有些样式文件中，变量定义放到文件尾部，这个在less中可行，在scss中不行。而且就一处，所以解决办法就是跑脚本之前，手动修复(脚本只是解决问题，不必把脚本做的尽善尽美)。
第三个问题是转换过程中有一些case覆盖不到：
```
.bottomGuideVersion2 {   
  position: fixed;   
  z-index: 200;
}

.xxx {    
  .bottomGuideVersion2();
}
```

这里的.bottomGuideVersion2，是less的混入(mixin)。既作为类选择器，又可以混入到别的选择器中。这个case原工具中没有完美解决，第一个类选择器没有变，还是.bottomGuideVersion2。而引入的地方变成了@include bottomGuideVersion2();，相当于include一个未定义的mixin，其实算是一个bug，anyway，我们的第一目标是先把我们的东西处理好，这个也可以在脚本中总结规律来解决掉。
遍历样式文件，抓取所有已知mixin遍历样式文件，如果遇到@include xxx();，就看xxx是否在已知的mixin里面，如果不在，放到to_fix里遍历样式文件，如果遇到.xxx {，而且xxx在to_fix里面。   
1. 把这个变成@mixin xxx {。   
2. 同时在大括号结束的地方插入.xxx {@include xxx();}把新的样式文件写回文件中。

上面提到的大括号结束的地方，可以通过直接统计{}的数量，初始count=-1，遇到{就减一，遇到}就加一。如果count=0，说明就到了可以插入的地方。
同时也可以做一些优化，mixin肯定都是先定义，后使用，所以我们可以边抓去mixin，边记录to_fix。而且在修复的时候，可以倒序遍历文件，这样新的插入，不会影响遍历时候的行数，源文件和backup能对应起来。

在跑起来之后，还有一些边边角角的问题，如rgba()函数里面多了个0，部分import没有指定.scss后缀名。这些case都极少，不需要放到脚本中修复，直接在跑脚本之后，手动修复即可。
原始脚本
由于只是一次性的脚本，所以并没有特别精简和完善，可以对比上面的伪代码一起看。

```python
#conding=utf8
import os
import re
import subprocess

def fix_import(dir_name):  
    g = os.walk(dir_name)  
    converted = False  
    for path, dir_list, file_list in g:    
      for file_name in file_list:      
        if file_name.endswith(".jsx") or \
          file_name.endswith(".tsx") or \
          file_name.endswith(".js") or \
          file_name.endswith(".less") or \
          file_name.endswith(".scss") or \
          file_name.endswith(".ts"):
          full_name = os.path.join(path, file_name)        
          new_file = open(full_name, 'r')        
          file_lines = new_file.readlines()        
          backup = list(file_lines)        
          for index, line in enumerate(file_lines):          
            result1 = re.search(r"import\s*([\S]*\s*from\s*)?['\"][\S]*.less['\"]", line, re.M|re.I)          
            result2 = re.search(r"import\s*([\S]*\s*from\s*)?['\"][\S]*.less['\"]", line, re.M|re.I)          
            if result1 or result2:            
              new_line = line            
              if ".module.scss" not in new_line and "swiper.scss" not in new_line:              
                new_line = new_line.replace(".scss", ".module.scss")            
                new_line = new_line.replace(".less", ".module.scss")            
                backup[index] = new_line            
                converted = True        
                new_file.close()        
                if converted:         
                   temp_file = open(full_name, 'w+')          
                   temp_file.writelines(backup)          
                   temp_file.close()          
                   print(full_name)    
                   # 单个文件调试    
                   # if converted:    
                   #   break

def fix_mixin(dir_name):   
  g = os.walk(dir_name)  
  for path, dir_list, file_list in g:    
    for file_name in file_list:      
      if file_name.endswith(".scss"):        
        full_name = os.path.join(path, file_name)        
        new_file = open(full_name, 'r')        
        file_lines = new_file.readlines()        
        backup = list(file_lines)        
        # mixin.scss已经有一些预定义的mixin        
        mixin_set = set(['text-overflow', 'vertical-middle', 'background-common', 'component-box', 'flex-center', 'line-clamp'])        
        to_fix_mixin = set()        
        has_error = False        
        for index, line in enumerate(file_lines):          
          result = re.search(r"@mixin ([a-zA-Z-_]+)", line, re.M|re.I)          
          if result:            
            mixin_set.add(result.group(1))          
            result = re.search(r"@include ([a-zA-Z0-9-_]+)", line, re.M|re.I)          
            if result and result.group(1) not in mixin_set:            
              to_fix_mixin.add(result.group(1))            
              has_error = True            
              print('at line: :\n' + line)        
        if has_error:          
          print('has error: ' + full_name)          
          # 这里需要倒序，方便做插入          
        for index, line in reversed(list(enumerate(file_lines))):            
          for to_fix in to_fix_mixin:              
            if '.' + to_fix + ' {' in line:                
              # 修复mixin                
              backup[index] = line.replace('.' + to_fix + ' {', '@mixin ' + to_fix + ' {')                
              count = -1                
              current_index = index + 1                
              while count != 0:                  
                current_line = backup[current_index]                  
                for ch in current_line:                    
                  if '{' == ch:                      
                    count -= 1                    
                  elif '}' == ch:                      
                    count += 1                  
                    current_index += 1                
                    current_index -= 1                
                    spaces = 0                
                for ch in backup[current_index]:                  
                  if ch == ' ':                    
                    spaces += 1                  
                  else:                    
                    break                
                current_index += 1                
                backup[current_index: current_index] = [' ' * spaces + '.' + to_fix + ' {\n', ' ' * (spaces + 2) + '@include ' + to_fix + ';\n', ' ' * spaces + '}\n']
                to_fix_mixin.add(to_fix)        
                new_file.close()        
                if has_error:          
                  temp_file = open(full_name, 'w+')          
                  temp_file.writelines(backup)          
                  temp_file.close()

def delete_less_file(dir_name):  
  g = os.walk(dir_name)  
  for path, dir_list, file_list in g:    
    for file_name in file_list:      
      if file_name.endswith(".less"):        
        full_name = os.path.join(path, file_name)        
        os.remove(full_name)        
        print('删除：', full_name)


def rename_scss_to_module_scss(dir_name):  
  g = os.walk(dir_name)  
  for path, dir_list, file_list in g:    
    for file_name in file_list:      
      if file_name.endswith(".module.scss"):        
        pass      
      elif file_name.endswith(".scss"):        
        full_name = os.path.join(path, file_name)        
        new_file_name = file_name.split('.')        
        new_file_name[-1] = "module.scss"        
        new_file_name = ".".join(new_file_name)        
        new_full_name = os.path.join(path, new_file_name)        
        os.rename(full_name, new_full_name)        
        print('重命名：', new_full_name)


if __name__ == "__main__":  
  fix_import(r"/Users/admin/Desktop/code/company/h5-ssr/client")  
  fix_import(r"/Users/admin/Desktop/code/company/h5-ssr/pages")  
  fix_mixin(r"/Users/admin/Desktop/code/company/h5-ssr/client")  
  fix_mixin(r"/Users/admin/Desktop/code/company/h5-ssr/pages")  
  delete_less_file(r"/Users/admin/Desktop/code/company/h5-ssr/client")  
  delete_less_file(r"/Users/admin/Desktop/code/company/h5-ssr/pages")  
  rename_scss_to_module_scss(r"/Users/admin/Desktop/code/company/h5-ssr/client")  
  rename_scss_to_module_scss(r"/Users/admin/Desktop/code/company/h5-ssr/pages")
```

总结
本文是提供一个思路，如何用最小的代价来解决问题。
