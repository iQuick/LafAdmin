import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'user.read');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // body, query 为请求参数, auth 是授权对象
  const { page, pageSize } = ctx.body;

  // 数据库操作
  const db = cloud.database();
  const { total } = await db.collection('user').count();

  const skip = page === 0 ? 0 : page - 1;
  const r = await db
    .collection('user')
    .skip(skip * pageSize)
    .limit(pageSize)
    .get();

  return ok({
    list: r.data.map((_) => {
      Reflect.deleteProperty(_, 'password');
      return _;
    }),
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  });
}
