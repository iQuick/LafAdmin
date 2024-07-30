import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.api.read');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const r = await db.collection('schema-api').get();

  return ok(r.data);
}
