import cloud from '@lafjs/cloud'
import * as call from '@/system/call'

const db = cloud.database();
const hashPassword = cloud.shared.get('hashPassword');

export default async function (ctx: FunctionContext) {
  const { username, password } = ctx.body;
  if (!username || !password) {
    return call.FAIL_ACCOUNT_PASSWD_EMPTY;
  }

  const { data: user } = await db
    .collection('user')
    .where({ username })
    .withOne({
      query: db.collection('password').where({ type: 'user', status: "active" }),
      localField: '_id',
      foreignField: 'uid',
      as: 'password',
    })
    .getOne();

  // check username and password
  const isMatchPassword = user.password?.password === hashPassword(password);
  if (!user || !isMatchPassword) {
    return call.FAIL_ACCOUNT_PASSWD_INVALID;
  }

  // 默认 token 有效期为 7 天
  const expire = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const payload = {
    uid: user._id,
    type: 'user',
    exp: expire,
  };

  const access_token = cloud.getToken(payload);


  await db.collection('user-token').where({ 'uid': user._id }).remove({ multi: true });
  await db.collection('user-token').add({
    uid: user._id,
    token: access_token,
    expired_at: expire * 1000,
    created_at: Date.now(),
    updated_at: Date.now()
  });

  return call.ok({
    access_token,
    uid: user._id,
    expire,
  });
}