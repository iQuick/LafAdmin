import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'oss.manager.read');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // 数据库操作
  const { page, pageSize } = ctx.body;
  const { total } = await db.collection('oss-manager').count();

  const skip = page === 0 ? 0 : page - 1;
  const r = await db
    .collection('oss-manager')
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
