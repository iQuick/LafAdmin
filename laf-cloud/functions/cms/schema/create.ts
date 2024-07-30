import cloud from '@lafjs/cloud';
import { createSchema } from '@/system/schema';
import { ok, fail } from '@/system/call';
import { FAIL_SCHEMA_CREATE } from '@/system/fail';
import { WHITE_COLLECTION_LIST, checkPermission, checkToken } from '@/system/sys';
import { ALREADY_EXIST_SCHEMA, INVALID_COLLECTION_NAME, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();
const mongodb = cloud.mongo.db;

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.create');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { displayName, collectionName, fields = [], description } = ctx.body;
  if (!displayName || !collectionName) {
    return fail(PARAMS_EMPTY);
  }

  // check collectionName
  if (WHITE_COLLECTION_LIST.indexOf(collectionName) > -1) {
    return fail(INVALID_COLLECTION_NAME);
  }

  // check exist
  const { total } = await db.collection('schema').where({ collectionName }).count();
  if (total > 0) {
    return fail(ALREADY_EXIST_SCHEMA);
  }

  // add collection to schema
  const session = cloud.mongo.client.startSession();
  try {
    session.startTransaction();
    await createSchema(token.uid, displayName, collectionName, fields, description);
    // add collection to mongodb
    await mongodb.createCollection(collectionName);
    await session.commitTransaction();
    return ok('success');
  } catch (err) {
    await session.abortTransaction()
    console.log('Error create schema : ', err)
    return fail(FAIL_SCHEMA_CREATE);
  } finally {
    await session.endSession();
  }
}
