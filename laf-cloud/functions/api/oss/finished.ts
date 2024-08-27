import cloud from '@lafjs/cloud';
import * as call '@/system/call';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { id, finished } = ctx.body;
  const data = await db
    .collection('oss-manager')
    .doc(id)
    .update({
      finished,
    });
  return call.ok(data);
}
