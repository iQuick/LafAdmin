import dayjs from 'dayjs';
import {h} from "vue";

export const columns = [
  {
    title: '用户ID',
    key: 'uid',
    width: 140,
  },
  {
    title: 'Token',
    key: 'token',
    width: 140,
  },
  {
    title: 'Token过期时间',
    key: 'token_expired_at',
    width: 100,
    render(row) {
      return dayjs(row.token_expired_at).format('YYYY-MM-DD HH:mm');
    },
  },
  {
    title: 'RefreshToken',
    key: 'refresh_token',
    width: 140,
  },
  {
    title: 'RefreshToken过期时间',
    key: 'refresh_token_expired_at',
    width: 110,
    render(row) {
      return dayjs(row.refresh_token_expired_at).format('YYYY-MM-DD HH:mm');
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 40,
    render(row) {
      return row.status
        ? h('p', { class: 'item-enable' }, '启用')
        : h('p', { class: 'item-disenable' }, '禁用');
    },
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 100,
    render(row) {
      return dayjs(row.created_at).format('YYYY-MM-DD HH:mm');
    },
  },
  {
    title: '更新时间',
    key: 'updated_at',
    width: 100,
    render(row) {
      return dayjs(row.updated_at).format('YYYY-MM-DD HH:mm');
    },
  },
];
