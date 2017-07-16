# Instalation:
(1) Install Dependencies:
```
git clone https://github.com/hos4m/shooooort.git

yarn
(or: npm install)
```

(2) Run Development Server:
```
yarn run dev
(or: npm run dev)
```

(3) To complite the development code to production code:
```
yarn run build
(or: npm run build)
```

# Notes:
When runing the development server, a tiny JS Express back-end server (port 9090) is running simulantiously with the front-end server (port 8080). The back-end server is a proxy server to consume an external API.