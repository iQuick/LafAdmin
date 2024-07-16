import cloud from '@lafjs/cloud';
import { S3 } from '@aws-sdk/client-s3';
import * as call from '@/system/call'

const db = cloud.database();

export default async function (ctx: FunctionContext) {

  const { key } = ctx.body;

  if (!key) {
    return call.FAIL_PARAMS;
  }

  db.collection('oss-manager').where({ key }).remove();

  const bucket = `${cloud.appid}-public`;
  const { credentials, endpoint, region } = await cloud.invoke('oss/sts/get');

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

  await s3.deleteObject({
    Bucket: bucket,
    Key: key
  });

  return call.ok();
}