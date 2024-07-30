import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.read');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { page, pageSize } = ctx.body;
  const { total } = await db.collection('schema').count();

  const skip = page === 0 ? 0 : page - 1;
  const r = await db
    .collection('schema')
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
