import cloud from '@lafjs/cloud'
import * as call from '@/system/call'

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const { id, collection } = ctx.headers;
  if (id) {
    const { data } = await db.collection(collection).where({ _id: id }).getOne();
    return call.ok(data);
  } else {
    const { order } = ctx.query;
    let { page, count } = ctx.query;
    if (!page) {
      page = 1;
    }
    if (!count) {
      count = 10;
    }

    let dbc = db
      .collection(collection)
      .skip((page - 1) * count)
      .limit(parseInt(count));
    if (order) {
      dbc = dbc.orderBy(order, 'asc');
    }
    
    const resData = await dbc.get();
    const resCount = await db.collection(collection).count();
    const totalPage = Math.ceil(resCount.total / count);

    return call.page(resData.data, {
      count: resCount.total,
      cur: page,
      total: totalPage,
      hasNext: page < totalPage,
    });
  }
}
