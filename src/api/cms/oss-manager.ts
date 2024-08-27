import { http } from '@/utils/http/axios';

export function getList(params) {
  return http.request({
    url: '/cms/oss-manager/list',
    method: 'POST',
    data: params,
  });
}

export function deleteFile(_id) {
  return http.request({
    url: '/cms/oss-manager/delete',
    method: 'POST',
    data: {
      _id,
    },
  });
}

export function createUploadRecord(params) {
  return http.request({
    url: '/cms/oss-manager/create',
    method: 'POST',
    data: params,
  });
}

export function updateUploadRecord(_id) {
  return http.request({
    url: '/cms/oss-manager/update',
    method: 'POST',
    data: {
      _id,
    },
  });
}
