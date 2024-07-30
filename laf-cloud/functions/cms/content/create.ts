import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';
import { INVALID_SCHEMA, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const { schemaId, params } = ctx.body;
  // check params
  if (!schemaId || !params) {
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
  const pms = await checkPermission(token.uid, `content.${schema.collectionName}.create`);
  if (pms.code !== 0) {
    return fail(pms);
  }

  const collection = schema.collectionName;
  const r = await db.collection(collection).add({
    ...params,
    status: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  return ok(r);
}
