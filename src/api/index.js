const Router = require("koa-router");
const webhooks = require("./webhooks");

const router = new Router();

router.post("/webhooks", webhooks);

module.exports = router;
