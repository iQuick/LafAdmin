import cloud from '@lafjs/cloud'
import { ok, fail } from '@/system/call'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { collection } = ctx.headers;
  const data = { created_at: Date.now(), updated_at: Date.now() } as any;
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
      } else {
        if (field.defaultValue) {
          data[k] = field.defaultValue;
        }
      }
    }
  });
  
  await db.collection(collection).add(data);
  return ok();
}
