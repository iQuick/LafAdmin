import cloud from '@lafjs/cloud';
import { checkPermission, checkToken, getPermissions } from '@/system/sys';
import { ok, fail } from '@/system/call';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'admin.read');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const _id = token.uid;
  const { data: admin } = await db.collection('admin').doc(_id).get();

  delete admin['password'];
  const { permissions } = await getPermissions(admin._id);

  return ok({ ...admin, permissions });
}
