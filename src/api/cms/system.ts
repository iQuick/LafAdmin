import { http } from '@/utils/http/axios';

/**
 * @description: 获取用户信息
 */
export function getSetting(params) {
  return http.request({
    url: '/cms/setting/get',
    method: 'post',
    params,
  });
}

export function updateSetting(params) {
  return http.request({
    url: '/cms/setting/update',
    method: 'post',
    params,
  });
}
