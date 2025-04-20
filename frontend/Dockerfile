FROM node:23-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

FROM base AS dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "--port", "5173"]

FROM base AS build
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
RUN if [ -f "nginx.conf" ]; then \
  cp nginx.conf /etc/nginx/conf.d/default.conf; \
  else \
  echo "No custom nginx config found"; \
  fi
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
