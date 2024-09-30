import cloud from '@lafjs/cloud'
import { ok, fail } from '@/system/call'
import { FAIL_CONTENT_UPDATE } '@/system/fail'
import { connectSchemaRelation } from '@/system/db'

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

  const result = await db.collection(collection).doc(id).update(data);
  if (result.ok) {
    const { data: schema } = await db.collection('schema').where({ collectionName: collection }).getOne();
    return ok(
      (await connectSchemaRelation(
        schema,
        db.collection(collection).where({ _id: id })
      ).getOne()).data
    );
  } else {
    return fail(FAIL_CONTENT_UPDATE)
  }
}
