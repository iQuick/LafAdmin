// 用户验证
export const UNAUTHORIZED = { code: 401, msg: '未登录' };
export const USER_TOKEN_EXPIRE = { code: 402, msg: 'Token 已过期!' };
export const USER_TOKEN_INVALID = { code: 403, msg: '无效的 Token!' };

// 权限问题
export const PERMISSION = { code: 1001, msg: '权限错误' };
export const ROLES = { code: 1002, msg: '无效的角色' };

// 参数
export const PARAMS = { code: 10011, msg: '参数错误' };
export const PARAMS_INVALID = { code: 10012, msg: '无效的参数' };
export const PARAMS_EMPTY = { code: 10013, msg: '缺少参数' };
export const PARAMS_EMPTY_SITE_NAME = {code:10014, msg:"网站名称不能为空"};
export const PARAMS_EMPTY_SITE_LOGO = {code:10015, msg:"网站Logo不能为空"};

// 参数 - 账号
export const ACCOUNT_PASSWD_EMPTY = { code: 10021, msg: '账号和密码不可为空' };
export const ACCOUNT_PASSWD_INVALID = { code: 10022, msg: '账号或密码错误' };
export const ACCOUNT_ALREADY_EXIST = { code: 10023, msg: '账号已存在' };

// 参数 - 密码
export const PASSWD_OR_NEWPASSWD_EMPTY = { code: 10031, msg: '原密码或新密码不能为空' };
export const PASSWD_OR_NEWPASSWD_ACCORD = { code: 10032, msg: '原密码不能与新密码一致' };
export const PASSWD_OLD_INACCURACY = { code: 10033, msg: '原密码不正确' };

// Exists
export const EXISTS = { code:10100, msg:"不存在"};
export const INVALID_ADMIN = {code:10101, msg:"无效的用户"};
export const INVALID_USER = {code:10102, msg:"无效的用户"};
export const INVALID_ROLE = {code:10103,msg:"无效的角色"};
export const INVALID_SCHEMA = {code:10104,msg:"无效的集合"};
export const INVALID_COLLECTION = {code:10105, msg:"无效的集合"};
export const INVALID_PERMISSION = {code:10106, msg:"无效的权限"};
export const INVALID_COLLECTION_NAME = {code:10107, msg:"不可使用的集合名称"};
export const INVALID_SETTING = { code: 10108, msg: "无效的设置项" };
export const INVALID_USER_TOKEN = { code: 10109, msg: "无效的用户Token" };
export const INVALID_USER_REFRESH_TOKEN = { code: 10110, msg: "无效的用户刷新Token" };
export const INVALID_ADMIN_ACCOUNT = { code: 10111, msg: "无效的账号" };
export const INVALID_USER_ACCOUNT = { code: 10112, msg: "无效的账号" };

// EXPIRE
export const EXPIRE_USER_REFRESH_TOKEN = { code: 10201, msg: 'RefreshToken 已过期!' };


// Already exist
export const ALREADY_EXIST_PERMISSION = {code:10301, msg:"权限已存在"};
export const ALREADY_EXIST_ROLE = {code:10302, msg:"权限已存在"};
export const ALREADY_EXIST_SCHEMA = {code:10303, msg:"Schema 已存在"};


// 文件上传
export const UPOLOAD_NO_FILE = { code: 11001, msg: '未检测到上传文件' };

// 格式验证
export const INVALID_PHONE = { code: 12001, msg: '手机号格式不正确' };
export const INVALID_EMAIL = { code: 12002, msg: '邮箱地址格式不正确' };

// Schema
export const FAIL_SCHEMA_CREATE = { code: 21001, msg: '创建失败' };
export const FAIL_SCHEMA_DELETE = { code: 21002, msg: '删除失败' };
export const FAIL_SCHEMA_UPDATE = { code: 21003, msg: '更新失败' };

// 未知错误
export const UNKNOWN = { code: 99999, msg: '未知错误' };
