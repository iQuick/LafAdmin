import cloud from '@lafjs/cloud';
import { getSts, createS3 } from '@/system/oss';
import { random } from '@/utils/util';
import { fail, ok } from '@/system/call';
import { UPOLOAD_NO_FILE } from '@/system/fail';

const fs = require('fs');
const path = require('path');
const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const bucket = `${cloud.appid}-public`;
  const { path: dir } = ctx.body;

  const sts = await getSts();
  const s3 = await createS3(sts);
  const { endpoint } = sts;

  if (ctx.files) {
    const data = [];
    for (const file of ctx.files) {
      console.log(file);
      let key = `${random(6)}_${file.originalname}`;
      if (dir) {
        key = path.join(dir, key);
      }
      const url = `${endpoint}/${bucket}/${key}`;
      const rsp = await db.collection('oss-manager').add({
        key: key,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        url: url,
        finished: false,
        created_at: Date.now(),
        updated_at: Date.now(),
      });
      const stream = fs.createReadStream(file.path);
      await s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: stream,
        ContentType: file.mimetype,
      });
      await db.collection('oss-manager').doc(rsp.id).update({
        finished: true,
        updated_at: Date.now(),
      });
      data.push({ key, url });
    }
    // eslint-disable-next-line prettier/prettier
    return ok(data)
  } else {
    return fail(UPOLOAD_NO_FILE);
  }
}
