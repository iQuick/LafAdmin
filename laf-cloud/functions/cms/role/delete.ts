import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import { INVALID_ROLE, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'role.delete');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // body, query 为请求参数, auth 是授权对象
  const { _id } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  // check id
  const { data: role } = await db.collection('role').where({ _id }).getOne();
  if (!role) {
    return fail(INVALID_ROLE);
  }

  // 数据库操作
  const r = await db.collection('role').doc(_id).remove();

  return ok(r);
}
