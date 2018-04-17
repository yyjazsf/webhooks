import crypto from "crypto";
import bufferEq from "buffer-equal-constant-time";

const secret = "123"; // TODO: load from db

function sign(data) {
  return (
    "sha1=" +
    crypto
      .createHmac("sha1", secret)
      .update(data)
      .digest("hex")
  );
}

function verify(signature, data) {
  return bufferEq(
    Buffer.from(signature),
    Buffer.from(sign(JSON.stringify(data)))
  );
}

export default async (ctx, next) => {
  ctx.body = { ok: true };
  const signature = ctx.request.header["x-hub-signature"];
  const event = ctx.request.header["x-github-event"]; // push
  if (event !== "push") {
    return;
  }
  const data = ctx.request.body;
  if (signature) {
    if (!verify(signature, data)) {
      throw new Error("X-Hub-Signature does not match blob signature");
    }
  }
  const {
    repository: { name, pushed_at },
    ref,
    pusher
  } = data;

  console.log(name, pushed_at, sender);
  // TODO: do auto deploy

  await next();
};
