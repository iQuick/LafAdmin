import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import { ALREADY_EXIST_ROLE, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'role.create');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { name, label, permissions } = ctx.body;
  if (!name || !label) {
    return fail(PARAMS_EMPTY);
  }

  // check exist
  const { total } = await db.collection('role').where({ name }).count();
  if (total > 0) {
    return fail(ALREADY_EXIST_ROLE);
  }

  // add permission
  const r = await db.collection('role').add({
    name,
    label,
    permissions: permissions ?? [],
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return ok(r);
}
