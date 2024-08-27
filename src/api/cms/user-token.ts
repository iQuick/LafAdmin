import { http } from '@/utils/http/axios';
import { BasicPageParams } from '@/api/been/basic';

/**
 * @description: 获取用户列表
 * @param {BasicPageParams} params
 * @return {*}
 */
export function getUserTokenList(params: BasicPageParams) {
  return http.request({
    url: '/cms/user-token/list',
    method: 'POST',
    params,
  });
}

/**
 * @description: 删除用户
 * @param {BasicPageParams} params
 * @return {*}
 */
export function deleteUserToken(_id) {
  return http.request({
    url: '/cms/user-token/delete',
    method: 'POST',
    data: {
      _id,
    },
  });
}

export function enableUserToken(_id, enable: Boolean) {
  return http.request({
    url: '/cms/user-token/enable',
    method: 'POST',
    data: {
      _id,
      status: enable ? 1 : 0,
    },
  });
}
