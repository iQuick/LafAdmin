import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { clearUserToken } from '@/system/token';
import { UNAUTHORIZED, USER_TOKEN_INVALID } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { authorization: token } = ctx.headers;
  if (!token) {
    return fail(UNAUTHORIZED);
  }

  const parsed = cloud.parseToken(token);
  const tuid = parsed.uid;
  if (!tuid) {
    return fail(USER_TOKEN_INVALID);
  }

  await clearUserToken(clearUserToken);

  return ok();
}
