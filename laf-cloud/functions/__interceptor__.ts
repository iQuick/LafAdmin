import cloud from '@lafjs/cloud';
import { checkToken } from '@/system/sys';
import { fail } from '@/system/call';
import { middlewares, logger, record } from '@/system/middleware';

const db = cloud.database();
const app = middlewares([logger, record]);

const getApi = (apis, name: string) => {
  let func = name;
  switch (name.toLowerCase()) {
    case 'get':
      func = 'read';
      break;
    case 'post':
      func = 'add';
      break;
    case 'put':
      func = 'update';
      break;
    case 'delete':
      func = 'remove';
      break;
  }
  return apis[func];
};

const handlerApiFunc = async (ctx: FunctionContext, api) => {
  if (api.token) {
    const token = await checkToken(ctx);
    if (token.code !== 0) {
      return fail(token);
    }
    ctx.headers['uid'] = token.uid;
  }
  const res = await require(`@/${api.target}`);
  if (res.default && typeof res.default === 'function') {
    return await res.default(ctx);
  } else {
    return res.default;
  }
};

export default async function (ctx: FunctionContext, next: Function) {
  try {
    await app(ctx);
    const { path } = ctx.request;
    const path_list = path.split('/').filter((it) => it && it.trim());
    if (path.startsWith('/api/')) {
      const { data: sapi } = await db
        .collection('schema-api')
        .where({ collectionName: path_list[2] })
        .getOne();

      console.log('sapi', sapi)
      if (sapi && sapi.enable) {
        const method = ctx.method.toUpperCase();
        const funcName = path_list[1] === 'schema' ? method : path_list[3];
        if (path_list[1] === 'schema') {
          if (path_list[3]) {
            ctx.headers['id'] = path_list[3];
          }
          ctx.headers['collection'] = sapi.collectionName;
        }
        const api = getApi(sapi.apis, funcName);
        if (api.enable) {
          const rsp = await handlerApiFunc(ctx, api);
          if (rsp) {
            return ctx.response.send(rsp);
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
  return await next(ctx);
}
