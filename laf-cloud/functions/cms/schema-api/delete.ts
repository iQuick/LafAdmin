import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkPermission, checkToken } from '@/system/sys';
import { PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.api.delete');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { _id, collectionName } = ctx.body;
  if (!_id && !collectionName) {
    return fail(PARAMS_EMPTY);
  }

  // check id
  const where = [];
  if (_id) {
    where.push({ _id: _id });
  }
  if (collectionName) {
    where.push({ collectionName: collectionName });
  }
  const { total } = await db.collection('schema-api').where(db.command.or(where)).count();
  if (total <= 0) {
    return { code: 0 };
  }

  // delete schema
  const res = await db.collection('schema-api').where(db.command.or(where)).remove();

  return ok(res);
}
