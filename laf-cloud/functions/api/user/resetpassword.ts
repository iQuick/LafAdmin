import cloud from '@lafjs/cloud';
import { clearUserToken } from '@/system/token';
import { ok, fail } from '@/system/call';
import { hashPassword } from '@/system/sys';
import {
  PASSWD_OLD_INACCURACY,
  PASSWD_OR_NEWPASSWD_ACCORD,
  PASSWD_OR_NEWPASSWD_EMPTY,
} from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { uid } = ctx.headers;
  const { oldpassword, newpassword } = ctx.body;

  if (!oldpassword || !newpassword) {
    return fail(PASSWD_OR_NEWPASSWD_EMPTY);
  }

  if (oldpassword === newpassword) {
    return fail(PASSWD_OR_NEWPASSWD_ACCORD);
  }

  const inactive = await db
    .collection('password')
    .where({ uid: uid, type: 'user', password: hashPassword(oldpassword), status: 'active' })
    .update({
      status: 'inactive',
      updated_at: Date.now(),
    });

  if (inactive.updated == 0) {
    return fail(PASSWD_OLD_INACCURACY);
  }

  await db.collection('password').add({
    uid: uid,
    password: hashPassword(newpassword),
    type: 'user',
    status: 'active',
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  // 清理旧 token
  await clearUserToken(uid);

  return ok();
}
