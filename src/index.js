import Koa from "koa";
import bodyParser from "koa-bodyparser";
import logger from "koa-logger";
import compress from "koa-compress";

import router from "./api/index";

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
