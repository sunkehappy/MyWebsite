# Base on offical NGINX Alpine image
FROM alibaba-cloud-linux-3-registry.cn-hangzhou.cr.aliyuncs.com/alinux3/nginx_optimized:20240221-1.20.1-2.3.0

# Remove any existing config files
RUN rm -f /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/

# Copy the SSL related files.
COPY ./certificate/ /etc/ssl/cert/

# Copy the blog files.
# COPY ./out/ /usr/share/nginx/html/

# Expose the listening port
EXPOSE 443
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
