import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import { ALREADY_EXIST_PERMISSION, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'permission.create');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { name, label } = ctx.body;
  if (!name || !label) {
    return fail(PARAMS_EMPTY);
  }

  // check exist
  const { total } = await db.collection('permission').where({ name }).count();
  if (total > 0) {
    return fail(ALREADY_EXIST_PERMISSION);
  }

  // add permission
  const r = await db.collection('permission').add({
    name,
    label,
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return ok(r);
}
