import { http } from '@/utils/http/axios';

export function getSts() {
  return http.request({
    url: '/cms/oss/sts',
    method: 'POST',
    data: {},
  });
}
