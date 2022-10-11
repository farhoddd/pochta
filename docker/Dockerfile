FROM nginx:stable-alpine
COPY /build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/
EXPOSE 80
WORKDIR /usr/share/nginx/html
RUN apk add --no-cache bash
RUN chmod +x env.sh
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx"]
