import cloud from '@lafjs/cloud'
import { isNull } from '@/utils/util'
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from "@/system/sys";
import { INVALID_USER, PARAMS_EMPTY } from "@/system/fail";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'user.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { _id, status } = ctx.body;
  if (!_id || isNull(status)) {
    return fail(PARAMS_EMPTY);
  }


  // check id
  const op = db.collection('user').doc(_id);
  const { data: user } = await op.get();
  if (!user) {
    return fail(INVALID_USER);
  }

  // add permission
  const r = await op.update({
    status,
    updated_at: Date.now(),
  });

  return ok(r);
}

