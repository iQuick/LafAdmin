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

  const { schemaId } = ctx.body;
  if (!schemaId) {
    return fail(PARAMS_EMPTY);
  }

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

  const r = await db.collection(collection).get();

  return ok(r.data);
}
