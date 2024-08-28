import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';
import { findSchemaField } from '@/system/db';
import { INVALID_SCHEMA, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  // body, query 为请求参数, auth 是授权对象
  const { schemaId, page, pageSize, filters } = ctx.body;
  if (!schemaId || !page || !pageSize) {
    return fail(PARAMS_EMPTY);
  }

  // get schema
  const { data: schema } = await db
    .collection('schema')
    .where(db.command.or({ _id: schemaId }, { collectionName: schemaId }))
    .getOne();
  if (!schema) {
    return fail(INVALID_SCHEMA);
  }

  // check permission
  const pms = await checkPermission(token.uid, `content.${schema.collectionName}.read`);
  if (pms.code !== 0) {
    return fail(pms);
  }

  const collection = schema.collectionName;
  const { total } = await db.collection(collection).count();
  const skip = page === 0 ? 0 : page - 1;
  const relations = [];
  for (const field of schema.fields) {
    if (field.type == 'Connect') {
      relations.push({
        query: db.collection(field.connectCollection),
        localField: field.name, // 主表连接键，即 article.id
        foreignField: '_id', // 子表连接键，即 tag.article_id
        as: `relation-${field.connectCollection}`, // 查询结果中字段重命名，缺省为子表名
      });
    }
  }

  const where = {};
  for (const key in filters) {
    const va = filters[key];
    if (va) {
      try {
        const field = findSchemaField(schema, key)
        if (field && field.type === 'Enum') {
          where[key] = { value: (field.enumElementType === 'number' ? parseInt(va) : va) };;
        } else {
          where[key] = new RegExp(`${va}`);
        }
      } catch (err) {
      }
    }
  }

  let query = db
    .collection(collection)
    .where(db.command.and(where))
    .skip(skip * pageSize)
    .limit(pageSize);
  for (const relation of relations) {
    query = query.withOne(relation);
  }
  const r = await query.get();

  return ok({
    list: r.data,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  });
}
