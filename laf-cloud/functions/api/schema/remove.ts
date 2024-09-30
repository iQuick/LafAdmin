import cloud from '@lafjs/cloud'
import { ok, fail } from '@/system/call'
import { FAIL_CONTENT_DELETE } '@/system/fail'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { id, collection } = ctx.headers;
  const result = await db.collection(collection).doc(id).remove();
  if (result.ok) {
    return ok()
  } else {
    return fail(FAIL_CONTENT_DELETE)
  }
}
