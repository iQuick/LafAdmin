import cloud from '@lafjs/cloud';
import { createS3Default } from '@/system/oss';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import { INVALID_COLLECTION, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // check permission
  const pms = await checkPermission(token.uid, 'oss.manager.delete');
  if (pms.code !== 0) {
    return fail(pms);
  }

  // check params
  const { _id } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  // check id
  const { data: file } = await db.collection('oss-manager').where({ _id }).getOne();
  if (!file) {
    return fail(INVALID_COLLECTION);
  }


  try {
    const bucket = `${cloud.appid}-public`;
    const s3 = await createS3Default();
    await s3.deleteObject({
      Bucket: bucket,
      Key: file.key,
    });
  } catch (e) {
    console.log('Error oss delete :', e)
  }


  // delete
  const r = await db.collection('oss-manager').doc(_id).remove();
  // console.log(r);

  return ok(r);
}
