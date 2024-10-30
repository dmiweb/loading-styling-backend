const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const delay = require('koa-delay');
const { faker } = require('@faker-js/faker');

const app = new Koa();
const router = new Router();

app.use(delay(3000));

app.use((ctx, next) => {
  if (ctx.request.method !== 'OPTIONS') {
    next();
    return;
  }

  ctx.response.set('Access-Control-Allow-Headers', 'x-requested-with');
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set('Access-Control-Allow-Methods', 'GET');
  ctx.response.status = 204;
});

router.get('/news', (ctx) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');

  function createRandomNews() {
    return {
      "id": faker.string.uuid(),
      "title": faker.lorem.lines(1),
      "image": faker.image.urlLoremFlickr({ category: 'nature' }),
      "content": faker.lorem.sentences(3),
      "date": Date.now()
    }
  }

  const fakerNews = faker.helpers.multiple(createRandomNews, {
    count: 3,
  });

  const latestNews = {
    "status": "ok",
    "timestamp": Date.now(),
    "news": fakerNews
  }
  
  ctx.response.status = 200;
  ctx.response.body = JSON.stringify(latestNews);
});

app.use(router.routes()).use(router.allowedMethods());

const server = http.createServer(app.callback());

const port = process.env.PORT || 3000;

server.listen(port, (err) => {
  if (err) {
    console.log(err);

    return;
  }

  console.log('Server is listen: ' + port);
});