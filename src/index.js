const Koa = require("koa");
const App = new Koa();

app.use(async ctx => {
  ctx.body = "webhooks ci";
});

app.listen(3000);
