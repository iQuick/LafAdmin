import cloud from '@lafjs/cloud'
import { S3 } from '@aws-sdk/client-s3';
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts';

export async function getSts() {
  const sts: any = new STSClient({
    region: process.env.OSS_REGION,
    endpoint: process.env.OSS_INTERNAL_ENDPOINT,
    credentials: {
      accessKeyId: process.env.OSS_ACCESS_KEY || '',
      secretAccessKey: process.env.OSS_ACCESS_SECRET || '',
    },
  });

  const cmd = new AssumeRoleCommand({
    DurationSeconds: 3600,
    Policy:
      '{"Version":"2012-10-17","Statement":[{"Sid":"Stmt1","Effect":"Allow","Action":"s3:*","Resource":"arn:aws:s3:::*"}]}',
    RoleArn: 'arn:xxx:xxx:xxx:xxxx',
    RoleSessionName: cloud.appid,
  });

  const res = await sts.send(cmd);

  return {
    credentials: res.Credentials,
    endpoint: process.env.OSS_EXTERNAL_ENDPOINT,
    region: process.env.OSS_REGION,
  };
}

export async function createS3(sts): S3 {
  const { credentials, endpoint, region } = sts
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
  return s3;
}

export async function createS3Default(): S3 {
  return createS3(getSts());
}
