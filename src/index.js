const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const logger = require("koa-logger");
const compress = require("koa-compress");

const router = require("./api/index");

const app = new Koa();

/**
 * Environment.
 */
const env = process.env.NODE_ENV || "development";

// logging
if ("test" !== env) {
  app.use(logger());
}
app.use(compress());
app.use(bodyParser());

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("server is running");
});
