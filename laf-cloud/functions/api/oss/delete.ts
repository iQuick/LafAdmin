import cloud from '@lafjs/cloud';
import { createS3Default } from '@/system/oss';
import { fail, ok } from '@/system/call';
import { PARAMS } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { key } = ctx.body;

  if (!key) {
    return fail(PARAMS);
  }

  db.collection('oss-manager').where({ key }).remove();

  try {
    const bucket = `${cloud.appid}-public`;
    const s3 = await createS3Default();
    await s3.deleteObject({
      Bucket: bucket,
      Key: key,
    });
  } catch(e) {
    console.log('Error oss delete :', e)
  }

  return ok();
}
