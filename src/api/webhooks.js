const util = require("util");
const child_process = require("child_process");
const chalk = require("chalk");
const bufferEq = require("buffer-equal-constant-time");
const crypto = require("crypto");

const execFile = util.promisify(child_process.execFile);
const log = console.log;
const successLog = chalk.green;
const errorLog = chalk.bold.red;
const warningLog = chalk.keyword("orange");

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

module.exports = async (ctx, next) => {
  // ctx.body = { ok: true };
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
    repository: { name },
    head_commit: { timestamp },
    ref,
    pusher
  } = data;

  log(name, ref, pusher, timestamp);
  log(successLog("start auto build"));
  const buildLog = await execFile("sh", [
    `${process.cwd()}/src/lib/auto_build.sh`,
    name
  ]);
  ctx.body = buildLog;
  // buildLog.stderr.toLocaleLowerCase().indexOf("error") !== -1
  // if (buildLog.stdout.toLocaleLowerCase().indexOf("error") !== -1) {
  //   log(errorLog(buildLog.stdout));
  // }
  log(buildLog);
  log(successLog("deploy complete"));
  // deploy

  await next();
};
