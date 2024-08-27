import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import { INVALID_USER_TOKEN, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'user.token.delete');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // check params
  const { _id } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  const op = db.collection('user-token').doc(_id);
  // check id
  const { data: token } = await op.get();
  if (!token) {
    return fail(INVALID_USER_TOKEN);
  }

  // delete
  const r = await op.remove();

  return ok(r);
}
