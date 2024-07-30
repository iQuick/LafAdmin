import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';

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

  const { _id } = ctx.body;
  const { data: schema } = await db
    .collection('schema')
    .where(db.command.or({ _id: _id }, { collectionName: _id }))
    .getOne();

  return ok(schema);
}
