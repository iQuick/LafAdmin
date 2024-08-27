<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row._id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1090"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, onMounted } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getUserTokenList, deleteUserToken, enableUserToken } from '@/api/cms/user-token';
  import { getAllRoles } from '@/api/cms/role';
  import { columns } from './columns';

  import { useUserStoreWidthOut } from '@/store/modules/user';
  import { logger } from '@/utils/Logger';

  const userStore = useUserStoreWidthOut();
  const { permissions } = userStore;

  const allRoles = reactive<
    {
      value: string;
      label: string;
    }[]
  >([]);

  const getAllPermissionList = async () => {
    const res = await getAllRoles();

    allRoles.splice(0, allRoles.length, ...res.map((_) => ({ value: _.name, label: _.label })));
  };

  onMounted(() => {
    getAllPermissionList();
  });

  const actionRef = ref();
  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '删除',
            type: 'error',
            popConfirm: {
              title: '确定删除吗？',
              confirm: handleDelete.bind(null, record),
            },
            // 根据业务控制是否显示 isShow 和 auth 是并且关系
            ifShow: () => {
              return permissions.includes('pms.user.token.delete');
            },
          },
        ],
        dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            // 根据业务控制是否显示: 非enable状态的不显示启用按钮
            ifShow: () => {
              return !record.status && permissions.includes('pms.user.token.edit');
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return record.status && permissions.includes('pms.user.token.edit');
            },
          },
        ],
        select: (key) => {
          switch (key) {
            case 'enabled':
              handleEnable(record, true);
              break;
            case 'disabled':
              handleEnable(record, false);
              break;
          }
        },
      });
    },
  });

  const message = useMessage();

  const loadDataTable = async (params) => {
    const ret = await getUserTokenList(params);
    logger.log(ret);
    return ret;
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  async function handleDelete(record) {
    await deleteUserToken(record._id);

    message.success('删除成功');
    reloadTable();
  }

  async function handleEnable(record, enable: Boolean) {
    await enableUserToken(record._id, enable);
    if (enable) {
      message.success('已启用');
    } else {
      message.success('已禁用');
    }
    reloadTable();
  }
</script>

<style lang="less" scoped></style>
