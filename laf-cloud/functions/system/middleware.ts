import cloud from '@lafjs/cloud';
import rip from '@/utils/ip'
import filter_headers from '@/system/header'
const db = cloud.database();


export interface Middleware {
  (ctx, next: () => Promise<void>): Promise<void>;
}

export const middlewares = (ms: Middleware[]) => {
  return async (ctx) => {
    const exec = async (index: number) => {
      if (index === ms.length) return;

      const middleware = ms[index];

      const next = () => exec(index + 1);

      await middleware(ctx, next);
    };
    return exec(0);
  }
}

/**
 * 打印日志
 */
export const logger: Middleware = async (ctx, next) => {
  const data = {
    url: ctx.request.url,
    ip: ctx.headers['x-forwarded-for']
  };
  const headers = filter_headers(ctx.headers)
  if (headers) {
    data["headers"] = headers;
  }
  if (ctx.params && ctx.params.length > 0) {
    data['params'] = ctx.params;
  }
  if (ctx.body && ctx.body.length > 0) {
    data['body'] = ctx.body;
  }
  console.log(JSON.stringify(data));
  next();
}

/**
 * 记录请求信息
 */
export const record: Middleware = async (ctx, next) => {
  const requestId = ctx.requestId
  const ip = ctx.headers['x-real-ip'] ? ctx.headers['x-real-ip'] : ctx.headers['x-forwarded-for']
  const region = rip(ip)
  const func = ctx.request.params.name
  const referer = ctx.headers['referer']
  const userAgent = ctx.headers['user-agent']
  const data = {
    requestId,
    ip,
    referer,
    userAgent,
    func,
    region,
    created_at: new Date(),
    updated_at: new Date()
  };
  const headers = filter_headers(ctx.headers)
  if (headers) {
    data["headers"] = headers;
  }
  if (ctx.params && ctx.params.length > 0) {
    data['params'] = ctx.params;
  }
  if (ctx.body && ctx.body.length > 0) {
    data['body'] = ctx.body;
  }
  db.collection("request-record").add(data)
  next();
}

