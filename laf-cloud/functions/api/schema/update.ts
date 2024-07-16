import cloud from '@lafjs/cloud'
import * as call from '@/system/call'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { id, collection } = ctx.headers;
  const data = { updated_at: Date.now() } as any;
  (
    await db.collection('schema').where({ collectionName: collection }).getOne()
  ).data.fields.forEach((field) => {
    if (['created_at', 'updated_at'].indexOf(field.name) == -1) {
      const k = field.name;
      const v = ctx.body[field.name];
      if (v) {
        if (field.type === 'Boolean') {
          data[k] = v === 'true';
        } else if (field.type === 'Number') {
          data[k] = parseInt(v);
        } else {
          data[k] = v;
        }
      }
    }
  });
  const res = await db.collection(collection).doc(id).update(data);
  return call.ok(res);
}
