import cloud from '@lafjs/cloud';
import { PHONE, EMAIL } from '@/utils/regex';
import { ok, fail } from '@/system/call';
import { INVALID_EMAIL, INVALID_PHONE } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { uid } = ctx.headers;
  const { nickname, avatar, phone, email } = ctx.body;

  const data = { updated_at: Date.now() } as any;
  if (nickname) {
    data.nickname = nickname;
  }
  if (avatar) {
    data.avatar = [avatar];
  }
  if (phone) {
    if (!PHONE.test(phone)) {
      return fail(INVALID_PHONE);
    }
    data.phone = phone;
  }
  if (email) {
    if (!EMAIL.test(email)) {
      return fail(INVALID_EMAIL);
    }
    data.email = email;
  }

  const r = await db
    .collection('user')
    .doc(uid)
    .update({
      ...data,
      updated_at: Date.now(),
    });

  return ok();
}
