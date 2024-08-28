import cloud from '@lafjs/cloud'
import * as call from '@/system/call'
import { connectSchemaRelation } from '@/system/db'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { id, collection } = ctx.headers;
  const { data: schema } = await db.collection('schema').where({ collectionName: collection }).getOne();
  if (id) {
    const { data } = await connectSchemaRelation(
      schema,
      db.collection(collection).where({ _id: id })
    ).getOne();
    return call.ok(data);
  } else {
    const params = { status: 1 } as any;
    schema.fields.forEach((field) => {
      if (['created_at', 'updated_at'].indexOf(field.name) == -1) {
        const k = field.name;
        const v = ctx.query[field.name];
        if (k && v) {
          if (field.type === 'Boolean') {
            params[k] = v === 'true';
          } else if (field.type === 'Number') {
            params[k] = parseInt(v);
          } else if (field.type === 'Enum') {
            params[k] = { value: (field.enumElementType === 'number' ? parseInt(v) : v) };
          } else {
            params[k] = v;
          }
        }
      }
    });

    const { order } = ctx.query;
    let { page, count } = ctx.query;
    if (!page) {
      page = 1;
    }
    if (!count) {
      count = 10;
    }

    const dbq = connectSchemaRelation(
      schema,
      db.collection(collection).where(params)
    )
    let dbc = dbq
      .skip((page - 1) * count)
      .limit(parseInt(count));

    if (order) {
      dbc = dbc.orderBy(order, 'asc');
    }

    const resData = await dbc.get();
    const resCount = await dbq.count();
    const totalPage = Math.ceil(resCount.total / count);

    return call.page(resData.data, {
      count: resCount.total,
      cur: page,
      total: totalPage,
      hasNext: page < totalPage,
    });
  }
}
