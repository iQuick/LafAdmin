import cloud from '@lafjs/cloud'


const db = cloud.database();

export const connectSchemaRelation = (schema, sql) => {
  const relations = [];
  for (const field of schema.fields) {
    if (field.type == 'Connect') {
      relations.push({
        query: db.collection(field.connectCollection),
        localField: field.name, // 主表连接键，即 article.id
        foreignField: '_id', // 子表连接键，即 tag.article_id
        as: field.name, // 查询结果中字段重命名，缺省为子表名
      });
    }
  }
  relations.forEach(relation => {
    sql = sql.withOne(relation);
  });
  return sql;
}

export const findSchemaField = (schema, name) => {
  for (const filed of schema.fields) {
    if (filed.name === name) {
      return filed;
    }
  }
  return null;
}