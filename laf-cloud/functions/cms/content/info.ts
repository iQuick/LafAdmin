import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';
import {INVALID_COLLECTION, INVALID_SCHEMA, PARAMS_EMPTY} from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const { schemaId, _id } = ctx.body;
  if (!schemaId || !_id) {
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

  // check collection
  const collection = schema.collectionName;
  const { data } = await db.collection(collection).doc(_id).get();
  if (!data) {
    return fail(INVALID_COLLECTION);
  }

  return ok(data);
}
