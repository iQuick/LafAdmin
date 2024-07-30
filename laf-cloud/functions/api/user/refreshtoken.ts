import cloud from '@lafjs/cloud';
import { refreshUserToken  } from '@/system/token';
import { ok, fail } from '@/system/call';
import { INVALID_USER_REFRESH_TOKEN, EXPIRE_USER_REFRESH_TOKEN } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { uid, refreshToken } = ctx.headers;

  const user_token = db.collection('user-token')
    .where({ uid, refreshToken })
    .getOne()

  if (!user_token) {
    return fail(INVALID_USER_REFRESH_TOKEN);
  }

  const refresh_payload = cloud.parseToken(refreshToken);
  if (!refresh_payload || refresh_payload != 'refresh-user') {
    return fail(INVALID_USER_REFRESH_TOKEN);
  }

  if (refresh_payload.exp > Date.now()) {
    return fail(EXPIRE_USER_REFRESH_TOKEN);
  }

  const token = await refreshUserToken(uid);

  return ok({
    uid: uid,
    ...token
  });
}