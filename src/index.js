import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import compress from "koa-compress";

import webhooks from "./webhooks";

const app = new Koa();
const router = new Router();

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

router.post("/webhooks", webhooks);

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("server is running");
});
