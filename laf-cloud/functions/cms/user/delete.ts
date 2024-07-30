import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import { INVALID_USER, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'user.delete');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // check params
  const { _id } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  // check id
  const { data: user } = await db.collection('user').where({ _id }).getOne();
  if (!user) {
    return fail(INVALID_USER);
  }

  // delete
  const r = await db.collection('user').doc(_id).remove();
  // console.log(r);

  return ok(r);
}
