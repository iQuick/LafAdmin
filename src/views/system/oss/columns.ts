import dayjs from 'dayjs';
import { h } from 'vue';

export const columns = [
  {
    title: '名称',
    key: 'originalname',
    width: 200,
  },
  {
    title: 'Key',
    key: 'key',
    width: 160,
  },
  {
    title: '文件类型',
    key: 'mimetype',
    width: 80,
  },
  {
    title: '是否完成',
    key: 'finished',
    width: 80,
    render(row) {
      if (row.finished) {
        return h("p", { class: 'item-yes' }, "已完成");
      } else {
        return h("p", { class: 'item-no' }, "未上传");
      }
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
