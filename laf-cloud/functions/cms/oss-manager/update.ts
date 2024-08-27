import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'oss.manager.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { id, finished } = ctx.body;
  const data = await db.collection('oss-manager').doc(id).update({
    finished,
    updated_at: Date.now(),
  });
  return ok(data);
}
