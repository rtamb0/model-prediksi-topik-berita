FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:alpine
RUN mkdir -p /usr/share/nginx/html/nlp/prediksi-berita
COPY --from=build /dist/ /usr/share/nginx/html/nlp/prediksi-berita/
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000