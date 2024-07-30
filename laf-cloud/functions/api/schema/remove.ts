import cloud from '@lafjs/cloud'
import { ok, fail } from '@/system/call'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { id, collection } = ctx.headers;
  await db.collection(collection).doc(id).remove();
  return ok();
}
