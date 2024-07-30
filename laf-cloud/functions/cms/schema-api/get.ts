import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.api.read');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { collectionName } = ctx.body;
  const { data: api } = await db
    .collection('schema-api')
    .where({ collectionName: collectionName })
    .getOne();

  return ok(api);
}
