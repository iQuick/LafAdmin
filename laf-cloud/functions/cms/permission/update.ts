import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from "@/system/sys";
import { INVALID_PERMISSION, PARAMS_EMPTY } from "@/system/fail";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'permission.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { name, label, _id } = ctx.body;
  if (!_id || !name || !label) {
    return fail(PARAMS_EMPTY);
  }

  // check id
  const op = db.collection('permission').doc(_id);
  const { data: permission } = await op.get();
  if (!permission) {
    return fail(INVALID_PERMISSION);
  }

  // add permission
  const r = await op.update({
    name,
    label,
    updated_at: Date.now(),
  });

  return ok(r);
}
