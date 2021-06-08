# Base on offical NGINX Alpine image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/

# Copy the SSL related files.
COPY ./certificate/ /etc/ssl/cert/

# Copy the blog files.
COPY ./public/ /usr/share/nginx/html/

# Copy the otms website files.
COPY ./ob-build/ /usr/share/nginx/otmsHtml/

# Expose the listening port
EXPOSE 443
EXPOSE 80

# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
