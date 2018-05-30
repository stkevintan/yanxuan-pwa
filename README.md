# yx-pwa

> 网易严选 PWA

仿网易严选的 PWA 应用 以及一个高性能的HTTP/2服务器

## install

```bash
npm i
npm i -g pm2 lavas
```

## dev


### generate ssl certificates
generate a ssl certificate using [Let's Encrypt](https://letsencrypt.org/).
```shell
sudo certbot certonly --standalone --preferred-challenges tls-sni -d you.keyin.me
```

### add hosts
append following lines to the `/etc/hosts` file.
```
127.0.0.1 you.keyin.me
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
