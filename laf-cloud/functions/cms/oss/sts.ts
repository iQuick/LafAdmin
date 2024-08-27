import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { getSts } from '@/system/oss';
import { checkToken } from '@/system/sys';

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  // const pms = await checkPermission(token.uid, 'oss.sts.get');
  // if (pms.code !== 0) {
  //   return fail(pms);
  // }

  const data = await getSts();
  return ok(data);
}
