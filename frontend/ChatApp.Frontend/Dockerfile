FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_AUTH_BASE_URL
ARG VITE_MESSAGING_BASE_URL
ARG VITE_REALTIME_BASE_URL

ENV VITE_AUTH_BASE_URL=$VITE_AUTH_BASE_URL
ENV VITE_MESSAGING_BASE_URL=$VITE_MESSAGING_BASE_URL
ENV VITE_REALTIME_BASE_URL=$VITE_REALTIME_BASE_URL

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]