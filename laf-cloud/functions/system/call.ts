import { JsonResult } from '@/system/types'

// 成功返回值
export function ok(
  data: object | any | null = null,
  msg: string = 'ok',
  code: number = 0
): JsonResult {
  return {
    code: code,
    msg: msg,
    data: data
  }
}

// 成功返回，分页
export function page(
  data: object | any | null = null,
  page: object = null,
  msg: string = 'ok',
  code: number = 0
): JsonResult {
  return {
    code: code,
    msg: msg,
    data: data,
    page: page
  }
}

// 失败返回值
export function fail(msg: string = 'fail', code: number = -1): JsonResult {
  return {
    code: code,
    msg: msg,
    data: null
  }
}


// 用户验证
export const FAIL_USER_NOT_LOGIN = fail("用户未登录", 401)
export const FAIL_USER_TOKEN_EXPIRE = fail("用户 Token 已过期!", 402)
export const FAIL_USER_TOKEN_INVALID = fail("无效的用户Token!", 403)

// 参数
export const FAIL_PARAMS = fail("无效的参数!", 10011)
export const FAIL_ACCOUNT_PASSWD_EMPTY = fail("账号和密码不可为空", 10012)
export const FAIL_ACCOUNT_PASSWD_INVALID = fail("账号或密码错误", 10013)
export const FAIL_ACCOUNT_ALREADY_EXIST = fail("账号已存在", 10014)

// 密码
export const FAIL_PASSWD_OR_NEWPASSWD_EMPTY = fail("原密码或新密码不能为空", 10021);
export const FAIL_PASSWD_OR_NEWPASSWD_ACCORD = fail("原密码不能与新密码一致", 10022)
export const FAIL_OLDPASSWD_INACCURACY = fail("原密码不正确", 10023)


// 文件上传
export const FAIL_UPOLOAD_NO_FILE = fail("未检测到上传文件", 11001)

// 格式验证
export const FAIL_PHONE = fail("手机号格式不正确", 12001)
export const FAIL_EMAIL = fail("邮箱地址格式不正确", 12002)
