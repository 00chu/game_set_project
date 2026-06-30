# React 프로젝트를 빌드하기 위한 환경
FROM node:20 AS build

WORKDIR /app

# 패키지를 설치
COPY package*.json ./
RUN npm install

COPY . .

# 빌드 시 환경변수를 주입
ARG VITE_BACKSERVER
ENV VITE_BACKSERVER=$VITE_BACKSERVER

RUN npm run build


# 실제 서비스는 Nginx가 담당
FROM nginx:alpine

# 빌드된 파일을 Nginx 웹 루트에 복사
COPY --from=build /app/dist /usr/share/nginx/html

# React Router 새로고침 문제를 해결하기 위한 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]