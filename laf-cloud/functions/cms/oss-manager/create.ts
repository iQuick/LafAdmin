import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'oss.manager.create');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { key, filename, originalname, mimetype, url, finished } = ctx.body;
  const data = await db.collection('oss-manager').add({
    key,
    filename,
    originalname,
    mimetype,
    url,
    finished,
  });
  return ok(data);
}
