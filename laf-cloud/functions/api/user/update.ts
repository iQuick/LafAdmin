import cloud from '@lafjs/cloud';
import * as call from '@/system/call'
import { PHONE, EMAIL } from '@/utils/regex';

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
      return call.FAIL_PHONE;
    }
    data.phone = phone;
  }
  if (email) {
    if (!EMAIL.test(email)) {
      return call.FAIL_EMAIL;
    }
    data.email = email;
  }


  const r = await db
    .collection('user')
    .where({ _id: uid })
    .update({
      ...data,
      updated_at: Date.now(),
    });

  return call.ok({ ...r, uid });
}
