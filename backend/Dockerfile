FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Kompilujemy TypeScript do JavaScript
RUN npx tsc index.ts --outDir dist --module ESNext --moduleResolution node --esModuleInterop --allowSyntheticDefaultImports
EXPOSE 8081
# Uruchamiamy już skompilowany plik JS
CMD ["node", "dist/index.js"]