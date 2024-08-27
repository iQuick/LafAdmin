import cloud from '@lafjs/cloud'
import { isNull } from '@/utils/util'
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from "@/system/sys";
import { INVALID_COLLECTION, INVALID_SCHEMA, PARAMS_EMPTY } from "@/system/fail";

const db = cloud.database();

export async function main(ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const { schemaId, _id, status } = ctx.body;
  if (!_id || isNull(status)) {
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

  const collectionName = schema.collectionName;
  const op = db.collection(collectionName).doc(_id);
  const { data: collection } = await op.get();
  if (!collection) {
    return fail(INVALID_COLLECTION);
  }

  // add permission
  const r = await op.update({
    status,
    updated_at: Date.now(),
  });

  return ok(r);
}

