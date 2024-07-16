import cloud from '@lafjs/cloud'
import * as call from '@/system/call'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { authorization: token, uid } = ctx.headers;

  // 默认 token 有效期为 7 天
  const expire = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const payload = {
    uid: uid,
    type: 'user',
    exp: expire,
  };

  const access_token = cloud.getToken(payload);

  await db.collection('user-token').add({
    uid: uid,
    token: access_token,
    expired_at: expire * 1000,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  return call.ok({
    access_token,
    uid: uid,
    expire,
  });
}