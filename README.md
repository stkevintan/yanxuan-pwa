# yx-pwa

> 网易严选 PWA

仿网易严选的 PWA 应用，后端服务器使用 HTTP/2 协议。

## install

```bash
npm i
npm i -g pm2 lavas
```

## dev

### add hosts

```
127.0.0.1 gbzhu.cn
```

### start servers

```bash
npm run dev
pm2 start pm2.dev.json
```

## prod

### start servers

```bash
npm run build
pm2 start pm2.prod.json
```

## Note

### enable 443 port(Linux)

```
sudo setcap 'cap_net_bind_service=+ep' `which node`
```

### Lighthouse Report

![lighthouse](https://raw.githubusercontent.com/stkevintan/yx-pwa/master/resources/LighthouseReposrt.png)
