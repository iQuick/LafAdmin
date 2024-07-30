import cloud from '@lafjs/cloud';
import { deleteSchema } from '@/system/schema';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import { INVALID_SCHEMA, PARAMS_EMPTY, FAIL_DELETE_SCHEMA } from '@/system/fail';

const db = cloud.database();
const mongo = cloud.mongo.db;

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.delete');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { schemaId, deleteCollection } = ctx.body;
  if (!schemaId) {
    return fail(PARAMS_EMPTY);
  }

  // check id
  const { data: schema } = await db.collection('schema').doc(schemaId).get();
  if (!schema) {
    return fail(INVALID_SCHEMA);
  }


  const session = cloud.mongo.client.startSession();
  try {
    session.startTransaction();
    await deleteSchema(token.uid, schema);
    // delete collection
    if (deleteCollection) {
      await mongo.dropCollection(schema.collectionName);
    } else {
      await mongo.renameCollection(schema.collectionName, `${schema.collectionName}-${Date.now()}`);
    }
    await session.commitTransaction();
    return ok('success')
  } catch (err) {
    await session.abortTransaction()
    console.log('Error delete schema : ', err)
    return fail(FAIL_DELETE_SCHEMA)
  } finally {
    await session.endSession();
  }
}
