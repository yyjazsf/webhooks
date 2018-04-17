import Router from "koa-router";
import webhooks from "./webhooks";

const router = new Router();

router.post("/webhooks", webhooks);

export default router;
