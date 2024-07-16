import cloud from '@lafjs/cloud'
import * as call from '@/system/call'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { authorization: token } = ctx.headers;
  if (!token) {
    return call.FAIL_USER_NOT_LOGIN;
  }

  const parsed = cloud.parseToken(token);
  const tuid = parsed.uid;
  if (!tuid) {
    return call.FAIL_USER_TOKEN_INVALID;
  }

  await db.collection('user-token').where({ 'uid': tuid, 'token': token }).remove();


  return call.ok()
}