# Peerplays DEX

## Prerequisites

Install the build dependencies on Linux:
```
apt-get update
apt-get install build-essential nasm
```

## Installation

Node v16+ is required and it can be installed using nvm following these [installation steps](https://github.com/nvm-sh/nvm#installing-and-updating).
```
npm install
```

## ENV configuration
Create a `.env` file in the root of the repository:

```
cp example.env .env
```

.env
```
# Token symbol
DEFAULT_TOKEN=''

# Token symbol
DEFAULT_QUOTE=''

# Full URL to the blockchain's faucet
FAUCET_URL=''

# Full URL to your mainnet DEX instance
DEX_URL=''

# Chain ID of the blockchain
DEFAULT_CHAIN_ID=''

# Blockchain API endpoints (websocket)
BLOCKCHAIN_ENDPOINTS=''
```

## Starting after installation and ENV configuration
### Development
```
npm start
```
### Production
Build the production distribution:
```
npm run build
```
Static files will be created in `./dist` and can be served with a web server like [NGINX](https://www.nginx.com/).
#### Exmaple NGINX Configuration:
nginx.conf
```
server {
    listen 80;
    root /srv/www/peerplays-dex;
    index index.html index.htm;
    location / {
       try_files $uri /index.html;
    }
}
```


## Docker
Install the latest version of [Docker](https://docs.docker.com/get-docker/).

### Build
After [configuring your ENV](#ENV-configuration), build the image:

#### Development
```
docker build . -f dev.Dockerfile -t peerplays/peerplays-dex-dev
```

#### Production
```
docker build . -f prod.Dockerfile -t peerplays/peerplays-dex
```

### Run
After building the image, run a container:

#### Development
```
docker run -d -p 8080:8080 peerplays/peerplays-dex-dev 
```
The application will be available at http://localhost:8080.
#### Production
```
docker run -d -p 80:80 peerplays/peerplays-dex
```
The application will be available at http://localhost.
