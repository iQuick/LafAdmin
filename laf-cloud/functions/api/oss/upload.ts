import cloud from '@lafjs/cloud';
import { S3 } from '@aws-sdk/client-s3';
import { random } from '@/utils/util';
import * as call from '@/system/call'


const fs = require('fs');
const path = require('path');
const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const bucket = `${cloud.appid}-public`;
  const { credentials, endpoint, region } = await cloud.invoke('oss/sts/get');
  const { path: dir } = ctx.body;

  const s3 = new S3({
    endpoint: endpoint,
    region: region,
    credentials: {
      accessKeyId: credentials.AccessKeyId,
      secretAccessKey: credentials.SecretAccessKey,
      sessionToken: credentials.SessionToken,
      expiration: credentials.Expiration,
    },
    forcePathStyle: true,
  });


  if (ctx.files) {
    const data = [];
    for (const file of ctx.files) {
      console.log(file);
      let key = `${random(6)}_${file.originalname}`;
      if (dir) {
        key = path.join(dir, key);
      }
      const url = `${endpoint}/${bucket}/${key}`;
      await db.collection('oss-manager').add({
        key: key,
        filename: file.filename,
        originalname: file.originalname,
        mimetype: file.mimetype,
        url: url,
        finished: false
      });
      const stream = fs.createReadStream(file.path);
      await s3.putObject({
        Bucket: bucket,
        Key: key,
        Body: stream,
        ContentType: file.mimetype,
      });
      await db.collection('oss-manager').update({
        key: key,
        finished: true
      })
      data.push({ key, url })
    }
    return call.ok(data)
  } else {
    return call.FAIL_UPOLOAD_NO_FILE;
  }

}