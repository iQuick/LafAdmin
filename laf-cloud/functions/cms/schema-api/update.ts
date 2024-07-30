import cloud from '@lafjs/cloud';
import { ok, fail } from '@/system/call';
import { checkToken, checkPermission } from '@/system/sys';
import { PARAMS_EMPTY } from '@/system/fail';

const db = cloud.database();

export default async function (ctx: FunctionContext) {
  const token = await checkToken(ctx);
  if (token.code !== 0) {
    return fail(token);
  }

  const pms = await checkPermission(token.uid, 'schema.api.edit');
  if (pms.code !== 0) {
    return fail(pms);
  }

  const { _id, enable, apis } = ctx.body;
  if (!_id) {
    return fail(PARAMS_EMPTY);
  }

  const data = { updated_at: Date.now() } as any;
  if (enable === true || enable === false) {
    data.enable = enable;
  }
  if (apis) {
    data.apis = apis;
  }

  // update schema
  const sapi = db.collection('schema-api').doc(_id);
  if (apis) {
    await sapi.update({
      apis: db.command.remove(),
      updated_at: Date.now(),
    });
  }

  const r = await sapi.update(data);

  return ok(r);
}
