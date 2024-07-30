import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';
import { INVALID_COLLECTION, INVALID_SCHEMA, PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const { schemaId, _id, params } = ctx.body;
  if (!schemaId || !_id) {
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
  const pms = await checkPermission(token.uid, `content.${schema.collectionName}.edit`);
  if (pms.code !== 0) {
    return fail(pms);
  }

  // check collection
  const collection = schema.collectionName;
  const op = db.collection(collection).doc(_id);
  const { data } = await op.get();
  if (!data) {
    return fail(INVALID_COLLECTION);
  }

  // update
  const r = await op.update({
    ...params,
    updated_at: Date.now(),
  });

  return ok(r);
}
