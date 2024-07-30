import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'system.setting.read');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { key } = ctx.body;
  const { data } = await db.collection('setting').where({ key }).getOne();

  return ok(data);
}
