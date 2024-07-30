import cloud from '@lafjs/cloud';
import { hashPassword } from '@/system/sys';
import { ok, fail } from '@/system/call';
import { ACCOUNT_ALREADY_EXIST, ACCOUNT_PASSWD_EMPTY } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { username, password, avatar, phone, email } = ctx.body;

  if (!username || !password) {
    return fail(ACCOUNT_PASSWD_EMPTY);
  }

  let { nickname } = ctx.body;
  if (!nickname) {
    nickname = username;
  }

  // check exist
  const { total } = await db.collection('user').where({ username }).count();
  if (total > 0) {
    return fail(ACCOUNT_ALREADY_EXIST);
  }

  // add user
  const r = await db.collection('user').add({
    username,
    nickname,
    avatar: avatar ?? null,
    phone: phone ?? null,
    email: email ?? null,
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  await db.collection('password').add({
    uid: r.id,
    password: hashPassword(password),
    type: 'user',
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return ok();
}
