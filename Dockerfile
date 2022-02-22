FROM node:16-alpine
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install
COPY ./ ./
RUN npx prisma generate
RUN npm run prebuild
RUN npm run build
CMD ["npm", "run", "start:prod"]
