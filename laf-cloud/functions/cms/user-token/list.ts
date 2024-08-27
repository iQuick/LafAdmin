import cloud from '@lafjs/cloud'
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'user.token.read');
  if (pms.code !== 0) {
    return fail(pms);
  }
  
  // body, query 为请求参数, auth 是授权对象
  const { page, pageSize } = ctx.body;

  // 数据库操作
  const db = cloud.database();
  const { total } = await db.collection('user-token').count();

  const skip = page === 0 ? 0 : page - 1;
  const r = await db
    .collection('user-token')
    .skip(skip * pageSize)
    .limit(pageSize)
    .get();

  return ok({
    list: r.data,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  });
}