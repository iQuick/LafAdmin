import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';
import { INVALID_ADMIN, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'admin.delete');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // check params
  const { _id } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  // check id
  const { data: admin } = await db.collection('admin').where({ _id }).getOne();
  if (!admin) {
    return fail(INVALID_ADMIN);
  }

  // delete
  const rsp = await db.collection('admin').doc(_id).remove();

  return ok(rsp);
}
