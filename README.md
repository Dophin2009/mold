# Mold

A web demo project where the user can upload an image, perform some
transformations on it, and download the result.

## Getting Started

To start the development server on port 8000:

``` shell
git clone https://github.com/mirryi/mold
cd mold
npm install
npm run start
```

Build for development:

``` shell
npm run build:dev
```

Build for production:

``` shell
npm run build:dev
```

### Docker

The `Dockerfile` produces a production build and serves it with NginX:

``` shell
docker build --tag=mold .
docker run -it -p 8000:80/tcp mold
```
