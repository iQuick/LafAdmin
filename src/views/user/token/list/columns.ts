import dayjs from 'dayjs';
import { h } from 'vue';

export const columns = [
  {
    title: '权限',
    key: 'name',
    width: 140,
  },
  {
    title: '名称',
    key: 'label',
    width: 140,
  },
  {
    title: '状态',
    key: 'status',
    width: 140,
    render(row) {
      return row.status
        ? h('p', { class: 'item-enable' }, '启用')
        : h('p', { class: 'item-disenable' }, '禁用');
    },
  },
  {
    title: '创建时间',
    key: 'created_at',
    width: 200,
    render(row) {
      return dayjs(row.created_at).format('YYYY-MM-DD HH:mm');
    },
  },
];
