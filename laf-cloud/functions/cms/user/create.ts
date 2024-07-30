import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { PHONE, EMAIL } from '@/utils/regex';
import { checkToken, checkPermission, hashPassword } from '@/system/sys';
import { ACCOUNT_ALREADY_EXIST, INVALID_EMAIL, INVALID_PHONE, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'user.create');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // check params
  const { username, password, avatar, nickname, phone, email } = ctx.body;
  if (!username || !nickname || !password) {
    return fail(PARAMS_EMPTY);
  }

  // check exist
  const { total } = await db.collection('user').where({ username }).count();
  if (total > 0) {
    return fail(ACCOUNT_ALREADY_EXIST);
  }

  if (phone && !PHONE.test(phone)) {
    return fail(INVALID_PHONE);
  }

  if (email && !EMAIL.test(email)) {
    return fail(INVALID_EMAIL);
  }

  // add user
  const r = await db.collection('user').add({
    username,
    nickname,
    avatar: avatar ?? null,
    phone: phone ?? null,
    email: email ?? null,
    status: 1,
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

  return ok(r);
}
