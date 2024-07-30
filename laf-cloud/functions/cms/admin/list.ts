import cloud from '@lafjs/cloud';
import { checkToken, checkPermission } from '@/system/sys';
import { ok, fail } from '@/system/call';

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'admin.read');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // body, query 为请求参数, auth 是授权对象
  const { body } = ctx;

  const { page, pageSize } = body;

  // 数据库操作
  const db = cloud.database();
  const { total } = await db.collection('admin').count();

  const skip = page === 0 ? 0 : page - 1;
  const r = await db
    .collection('admin')
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
