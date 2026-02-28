@"
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Backend Cloud App is Running');
}).listen(8080);
"@ | Out-File -FilePath backend\server.js -Encoding utf8

@"
FROM node:18-alpine
WORKDIR /app
COPY server.js .
EXPOSE 8080
CMD ["node", "server.js"]
"@ | Out-File -FilePath backend\Dockerfile -Encoding utf8