import { http } from '@/utils/http/axios';

export function requestSchemaApiGet(method: string, collection: string, data) {
  return http.request({
    url: '/api/schema/request',
    headers: {
      method: method,
      collection: collection,
    },
    method: 'GET',
    data,
  });
}

export function requestSchemaApiPost(method: string, collection: string, data) {
  return http.request({
    url: '/api/schema/request',
    headers: {
      method: method,
      collection: collection,
    },
    method: 'POST',
    data,
  });
}
