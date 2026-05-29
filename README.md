# sunkehappy 的个人博客

基于 Jekyll（Academic Pages 主题）的静态博客，部署在 GitHub Pages，域名 [www.sunkehappy.com](https://www.sunkehappy.com)。

## 本地预览

```bash
bundle install
bundle exec jekyll serve
```

浏览器访问 http://localhost:4000

## 内容结构

- `_posts/` — 博客文章
- `_pages/` — 独立页面（首页 About 等）
- `_config.yml` — 站点配置
- `assets/images/` — 文章图片

## 部署

推送到 GitHub 后，在仓库 Settings → Pages 启用 GitHub Pages（Source: `main` 分支），并配置自定义域名 `www.sunkehappy.com`。
