---
date: 2019-12-13
category:       iOS
title:          更新Fastlane的证书
tags:           [fastlane, match, ios]
---

今天遇到一个问题，之前的开发者账号中的证书过期了，导致之前CI里面的任务无法正常执行。

```
Your certificate 'MF4PBSF6MZ.cer' is not valid, please check end date and renew it if necessary
```

我这里的CI是通过fastlane来管理的，包括里面的证书。说实话fastlane的match也不够智能，还是需要时不时的手工去操作，当然这个也可以说是苹果的锅。但是不得不说很烦人。

这次我整理了一下当fastlane里面的证书过期的话，如何更新：
* 手动到[苹果开发者中心]去更新证书
* 本地导出证书公钥和私钥
* 加密后放到之前的证书仓库中
* 通过fastlane match来自动管理provison profiles(这一步是我自己琢磨的，本来是手动生成然后加密的，奈何老是报错，就自动生成了，结果还真管用，那我还费这个劲手动干啥？)

这里我记录一些关键步骤：

## 导出证书
![export-certificate-from-keychain](/assets/images/export-certificate-from-keychain.png)
记得在弹窗中.cer和.p12两种格式都导出来，这里我用文件名certificate来作为我导出的文件名。

## 加密证书
这里首先需要把.p12文件转换成.pem文件：
```
openssl pkcs12 -nocerts -nodes -out key.pem -in certificate.p12
```
然后用.pem和.cer文件分两步导出成最终的`cert_id.cer`文件：
```
openssl aes-256-cbc -k your_password -in key.pem -out cert_id.p12 -a
openssl aes-256-cbc -k your_password -in certificate.cer -out cert_id.cer -a
```
记得上面的`your_password`需要换成你的密码。

## 自动生成provision profiles
直接用下面的命令，按照提示操作即可。记得这是分两次的。
```
fastlane match adhoc --verbose
fastlane match appstore --verbose
```
这样操作完，证书和provision profile就都更新好了，CI那边重新跑就没问题了。


[苹果开发者中心]:https://developer.apple.com/account/resources/certificates/list
