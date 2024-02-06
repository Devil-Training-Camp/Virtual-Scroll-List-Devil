const Koa = require('koa')
var cors = require('koa2-cors')
const router = require('./src/router/index.js')

const app = new Koa()

app.use(cors())

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(9527, () => {
  console.log('server start');
})