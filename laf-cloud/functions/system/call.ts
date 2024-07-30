import { JsonResult } from '@/system/types';
import { UNKNOWN } from '@/system/fail';

/**
 * 成功
 * @param data
 * @param msg
 * @param code
 */
export function ok(data: object | any | null = null, msg = 'ok', code = 0): JsonResult {
  return {
    code: code,
    msg: msg,
    data: data,
  };
}

/**
 * 成功，分页
 * @param data
 * @param page
 * @param msg
 * @param code
 */
export function page(
  data: object | any | null = null,
  page: object = null,
  msg = 'ok',
  code = 0
): JsonResult {
  return {
    code: code,
    msg: msg,
    data: data,
    page: page,
  };
}

/**
 * 失败
 * @param failure
 * @param ctx
 */
export function fail(failure: { code?: number; msg?: string }, ctx?: FunctionContext): JsonResult {
  const { code = UNKNOWN.code, msg = UNKNOWN.msg } = failure;
  if (ctx && code < 1000) {
    ctx.response.status(code);
  }
  return create_failure(code, msg);
}

/**
 * 创建
 * @param code
 * @param msg
 */
function create_failure(code: number, msg: string) {
  return {
    code: code,
    msg: msg,
    data: null,
  };
}
