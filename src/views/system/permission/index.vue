<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row._id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1090"
    >
      <template #tableTitle>
        <n-button type="primary" @click="handleCreate">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增权限
        </n-button>
      </template>
    </BasicTable>

    <n-modal
      v-model:show="showModal"
      :show-icon="false"
      style="width: 600px"
      preset="dialog"
      :mask-closable="false"
      :on-after-leave="resetFormParams"
      :title="modalType === 'create' ? '新建' : '编辑'"
    >
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        label-placement="left"
        :label-width="80"
        class="py-4"
      >
        <n-form-item label="权限" path="name">
          <n-input placeholder="请输入权限" v-model:value="formParams.name" />
        </n-form-item>
        <n-form-item label="名称" path="label">
          <n-input placeholder="请输入名称" v-model:value="formParams.label" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import {
    getPermissions,
    createPermission,
    deletePermission,
    updatePermission,
    enablePermission,
  } from '@/api/cms/permission';
  import { columns } from './columns';
  import { PlusOutlined } from '@vicons/antd';

  import { useUserStoreWidthOut } from '@/store/modules/user';
  import { logger } from '@/utils/Logger';

  type TPermission = {
    _id: string | null;
    name: string;
    label: string;
  };

  const userStore = useUserStoreWidthOut();
  const { permissions: userPermissions } = userStore;

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
              return userPermissions.includes('pms.permission.delete');
            },
          },
          {
            label: '编辑',
            onClick: handleEdit.bind(null, record),
            ifShow: () => {
              return userPermissions.includes('pms.permission.edit');
            },
          },
        ],
        dropDownActions: [
          {
            label: '启用',
            key: 'enabled',
            ifShow: () => {
              return !record.status && userPermissions.includes('pms.permission.edit');
            },
          },
          {
            label: '禁用',
            key: 'disabled',
            ifShow: () => {
              return record.status && userPermissions.includes('pms.permission.edit');
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
  const formRef: any = ref(null);
  const rules = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入权限',
    },
    label: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入权限名称',
    },
  };

  const showModal = ref(false);
  const modalType = ref('create');
  const formBtnLoading = ref(false);
  const formParams = reactive<TPermission>({
    name: '',
    label: '',
    _id: null,
  });
  const resetFormParams = () => {
    formParams._id = null;
    formParams.name = '';
    formParams.label = '';
  };

  function confirmForm(e) {
    e.preventDefault();
    formBtnLoading.value = true;
    formRef.value.validate(async (errors) => {
      if (!errors) {
        if (modalType.value === 'create') {
          const { _id, ...createParams } = formParams;
          await createPermission(createParams);
        } else {
          await updatePermission(formParams);
        }

        message.success(modalType.value === 'create' ? '创建成功' : '修改成功');
        showModal.value = false;
        reloadTable();
        resetFormParams();
      } else {
        message.error('请填写完整信息');
      }
      formBtnLoading.value = false;
    });
  }

  const loadDataTable = async (params) => {
    const ret = await getPermissions(params);
    logger.log(ret);
    return ret;
  };

  function reloadTable() {
    actionRef.value.reload();
  }

  function handleCreate() {
    showModal.value = true;
    modalType.value = 'create';
  }

  function handleEdit(record: TPermission) {
    showModal.value = true;
    modalType.value = 'edit';
    formParams.name = record.name;
    formParams.label = record.label;
    formParams._id = record._id;
  }

  async function handleDelete(record: TPermission) {
    await deletePermission(record._id);

    message.success('删除成功');
    reloadTable();
  }

  async function handleEnable(record: TPermission, enable: Boolean) {
    await enablePermission(record._id, enable);
    if (enable) {
      message.success('已启用');
    } else {
      message.success('已禁用');
    }
    reloadTable();
  }
</script>

<style lang="less" scoped></style>
