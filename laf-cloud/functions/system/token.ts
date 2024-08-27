import cloud from '@lafjs/cloud'

const db = cloud.database();

export async function clearUserToken(uid) {
  await db.collection('user-token').where({ uid: uid }).remove({ multi: true });
  return 'ok';
}

export async function refreshUserToken(uid) {
  return createUserToken(uid);
}

export async function createUserToken(uid) {
  // 默认 token 有效期为 7 天
  const access_token_expire = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const refresh_token_expire = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14;
  const access_token = cloud.getToken({
    uid: uid,
    type: 'user',
    exp: access_token_expire,
  });
  const refresh_token = cloud.getToken({
    uid: uid,
    type: 'refresh-user',
    exp: refresh_token_expire,
  });

  await db.collection('user-token').where({ uid: uid }).remove({ multi: true });
  await db.collection('user-token').add({
    uid: uid,
    token: access_token,
    token_expired_at: access_token_expire * 1000,
    refresh_token: refresh_token,
    refresh_token_expired_at: refresh_token_expire * 1000,
    status: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return {
    access_token,
    access_token_expire,
    refresh_token,
    refresh_token_expire
  }
}

export async function createAdminToken(aid) {
  // 默认 token 有效期为 7 天
  const expire = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const payload = {
    uid: aid,
    type: 'admin',
    exp: expire,
  };
  const access_token = cloud.getToken(payload);
  return { access_token, expire };
}
