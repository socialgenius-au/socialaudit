FROM node:20-alpine
WORKDIR /app
RUN npm install -g yarn
COPY package.json yarn.lock* ./
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "dev", "--host", "0.0.0.0", "--port", "3000"]
