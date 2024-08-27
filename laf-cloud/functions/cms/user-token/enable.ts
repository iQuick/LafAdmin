import cloud from '@lafjs/cloud'
import { isNull } from '@/utils/util'
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from "@/system/sys";
import { INVALID_USER_TOKEN, PARAMS_EMPTY } from "@/system/fail";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'user.token.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { _id, status } = ctx.body;
  if (!_id || isNull(status)) {
    return fail(PARAMS_EMPTY);
  }


  // check id
  const op = db.collection('user-token').doc(_id);
  const { data: tk } = await op.get();
  if (!tk) {
    return fail(INVALID_USER_TOKEN);
  }

  // add permission
  const r = await op.update({
    status,
    updated_at: Date.now(),
  });

  return ok(r);
}

