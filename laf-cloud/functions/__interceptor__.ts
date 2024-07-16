import cloud from '@lafjs/cloud';
import * as call from '@/system/call'
import { middlewares, logger, record } from '@/system/middleware'

const db = cloud.database();
const app = middlewares([logger, record]);

const getApi = (apis, name: string) => {
    let func = name
    switch (name.toLowerCase()) {
        case "get":
            func =  "read";
            break
        case "post":
            func = "add";
            break
        case "put":
            func = "update";
            break
        case "delete":
            func = "remove"
            break
    }
    return apis[func];
}

const validateUser = async (ctx: FunctionContext) => {
    const { authorization: token } = ctx.headers;

    if (!token) {
        return call.FAIL_USER_NOT_LOGIN;
    }

    const parsed = cloud.parseToken(token);
    const tuid = parsed.uid;
    if (!tuid) {
        return call.FAIL_USER_TOKEN_INVALID;
    }

    const { data: td } = await db.collection('user-token').where({ 'uid': tuid, 'token': token }).getOne();

    if (!td) {
        return call.FAIL_USER_TOKEN_INVALID;
    }

    if (td.expired_at < Date.now()) {
        return call.FAIL_USER_TOKEN_EXPIRE;
    }

    // 保存 uid 信息
    ctx.headers['uid'] = tuid;
    return null;
}

const handlerApiFunc = async (ctx: FunctionContext, api) => {
    if (api.token) {
        const invalid = await validateUser(ctx);
        if (invalid) {
            return invalid
        }
    }
    const res = await require(`@/${api.target}`);
    if (res.default && typeof res.default === 'function') {
        return await res.default(ctx)
    } else {
        return res.default
    }
}

export default async function (ctx: FunctionContext, next: Function) {
    try {
        await app(ctx);
        const { path } = ctx.request;
        const path_list = path.split("\/").filter(it => it && it.trim());
        if (path.startsWith("/api/")) {
            const { data: sapi } = await db.collection('schema-api').where(
                { collectionName: (path_list[2]) }
            ).getOne();

            if (sapi && sapi.enable) {
                const method = ctx.method.toUpperCase();
                const funcName = path_list[1] === 'schema' ? method : path_list[3];
                if (path_list[1] === 'schema') {
                    if (path_list[3]) {
                        ctx.headers['id'] = path_list[3];
                    }
                    ctx.headers['collection'] = sapi.collectionName;
                }
                const api = getApi(sapi.apis, funcName)
                const rsp = await handlerApiFunc(ctx, api)
                if (rsp) {
                    return ctx.response.send(rsp);
                }
            }
        }
    } catch (err) {
        console.log(err)
    }
    return await next(ctx)
}





