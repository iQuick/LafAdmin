import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { PHONE, EMAIL } from '@/utils/regex';
import { checkToken, checkPermission, hashPassword } from '@/system/sys';
import { INVALID_EMAIL, INVALID_PHONE, INVALID_USER, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'user.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // 参数验证
  const { _id, username, password, avatar, nickname, phone, email } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  // 验证 user _id 是否合法
  const { data: user } = await db.collection('user').where({ _id: _id }).getOne();
  if (!user) {
    return fail(INVALID_USER);
  }

  const old = user;

  // update user
  const data = { updated_at: Date.now() };

  // update password
  if (password) {
    data['password'] = hashPassword(password);
  }

  // username
  if (username && username != old.username) {
    const { total } = await db.collection('user').where({ username }).count();
    if (total) return { code: 'INVALID_PARAM', error: 'username already exists' };
    data['username'] = username;
  }

  // name
  if (nickname && nickname != old.nickname) {
    const { total } = await db.collection('user').where({ nickname }).count();
    if (total) return { code: 'INVALID_PARAM', error: 'nickname already exists' };
    data['nickname'] = nickname;
  }

  // avatar
  if (avatar && avatar != old.avatar) {
    data['avatar'] = avatar;
  }

  // phone
  if (phone && phone != old.phone) {
    if (!PHONE.test(phone)) {
      return fail(INVALID_PHONE);
    }
    data['phone'] = phone;
  }

  // email
  if (phone && email != old.email) {
    if (!EMAIL.test(email)) {
      return fail(INVALID_EMAIL);
    }
    data['email'] = phone;
  }

  const r = await db
    .collection('user')
    .where({ _id: _id })
    .update({
      ...data,
      updated_at: Date.now(),
    });

  return ok({ ...r, _id });
}
