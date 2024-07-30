import cloud from '@lafjs/cloud';
import { updateSchema } from '@/system/schema';
import { ok, fail } from '@/system/call';
import { FAIL_SCHEMA_UPDATE } from '@/system/fail';
import { checkToken, checkPermission, WHITE_COLLECTION_LIST } from '@/system/sys';
import { INVALID_COLLECTION_NAME, INVALID_SCHEMA, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();
const mongodb = cloud.mongo.db;

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { _id, collectionName, fields, displayName, description } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  // check id
  const { data: schema } = await db.collection('schema').doc(_id).get();
  if (!schema) {
    return fail(INVALID_SCHEMA);
  }

  if (schema.collectionName && WHITE_COLLECTION_LIST.indexOf(schema.collectionName) > -1) {
    return fail(INVALID_COLLECTION_NAME);
  }

  const session = cloud.mongo.client.startSession();
  try {
    session.startTransaction();
    await updateSchema(token.uid, schema, { collectionName, displayName, description, fields });
    // 更新数据库名称
    if (collectionName && collectionName !== schema.collectionName) {
      await mongodb.renameCollection(schema.collectionName, collectionName);
    }
    await session.abortTransaction()
    // await session.commitTransaction();
    return ok('success');
  } catch (err) {
    await session.abortTransaction();
    console.log('Error update schema : ', err)
    return fail(FAIL_SCHEMA_UPDATE);
  } finally {
    await session.endSession();
  }
}
