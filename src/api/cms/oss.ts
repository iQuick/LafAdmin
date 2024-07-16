import { http } from '@/utils/http/axios';

export function getList(params) {
  return http.request({
    url: 'cms/oss/list',
    method: 'POST',
    data: params,
  });
}

export function deleteFile(_id) {
  return http.request({
    url: 'cms/oss/delete',
    method: 'POST',
    data: {
      _id,
    },
  });
}
