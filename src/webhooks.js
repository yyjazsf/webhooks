export default async (ctx, next) => {
  ctx.body = JSON.stringify(ctx.request.body);
  console.log(ctx.request.body);
  await next();
};
