FROM node:20-alpine
WORKDIR /app
COPY package.json yarn.lock* ./
RUN yarn install
COPY . .
RUN yarn vite build
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
