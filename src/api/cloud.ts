import { S3 } from '@aws-sdk/client-s3';
import { Upload, Progress } from '@aws-sdk/lib-storage';
import { nanoid } from 'nanoid';

import { getSts } from '@/api/cms/oss';
import { createUploadRecord } from '@/api/cms/oss-manager';

const APPID = import.meta.env.VITE_APPID;
const bucket = `${APPID}-public`;

// 上传图片
const uploadFile = async (
  file: File,
  dir = '',
  progressCallback?: ((progress: number) => void) | null
) => {
  const { credentials, endpoint, region } = await getSts();

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

  const key = `resource/${dir ? dir : 'admin'}/${nanoid(6)}_${file.name}`;
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: file.type,
    },
    leavePartsOnError: false, // 可选参数，上传错误时是否保留已上传的部分
  });

  upload.on('httpUploadProgress', (progress: Progress) => {
    if (progressCallback && progress.loaded && progress.total) {
      progressCallback(progress.loaded / progress.total);
    }
  });

  await upload.done();
  const url = `${endpoint}/${bucket}/${key}`;

  // console.log('upload', file);
  // console.log(await db.collection('device').getOne());

  await createUploadRecord({
    key: key,
    filename: file.name,
    originalname: file.name,
    mimetype: file.type,
    url: url,
    finished: true,
  });

  return { url, key };
};

export { uploadFile };
