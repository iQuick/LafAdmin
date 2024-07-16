import cloud from '@lafjs/cloud'
import * as call from '@/system/call'
const path = require('path')

export default async function (ctx: FunctionContext) {
  const { path: dir, filename } = ctx.body;
  if (!filename) {
    return call.FAIL_PARAMS
  }
  var { validity } = ctx.body;
  const bucket = cloud.storage.bucket(`${cloud.appid}-public`)
  const file = dir ? path.join(dir, filename) : filename;
  if (!validity) {
    validity = 3600 * 1
  }
  const url = await bucket.getUploadUrl(file, validity);
  return call.ok(url)
}
