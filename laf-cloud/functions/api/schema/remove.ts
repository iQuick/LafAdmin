import cloud from '@lafjs/cloud'
import * as call from '@/system/call'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { id, collection } = ctx.headers;
  const res = await db.collection(collection).doc(id).remove();
  return call.ok(res);
}
