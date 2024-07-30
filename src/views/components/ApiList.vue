<script setup lang="ts">
  import { computed } from 'vue';
  import { toRefs } from 'vue';
  import { useUserStoreWidthOut } from '@/store/modules/user';

  const props = defineProps<{
    apiList: SchemaApi[];
    currentApi: SchemaApi | undefined;
  }>();

  const emit = defineEmits(['changeApi']);

  const userStore = useUserStoreWidthOut();
  const { permissions } = userStore;

  // const { apiList } = toRefs(props);

  const activeKey = computed(() => props.currentApi?._id);

  const hasPermission = (schema) => {
    if (schema.collectionName === 'user') {
      return permissions.includes('pms.menu.user');
    }
    if (schema.collectionName === 'user-token') {
      return permissions.includes('pms.menu.user.token');
    }
    if (schema.collectionName === 'oss') {
      return permissions.includes('pms.menu.oss.manager');
    }
    return permissions.includes(`pms.content.${schema.collectionName}.menu`);
  };

  const handleChangeApi = (key: string) => {
    emit('changeApi', key);
  };
</script>

<template>
  <n-menu
    class="schema-list-box"
    v-model:value="activeKey"
    mode="vertical"
    :options="apiList.filter((_) => hasPermission(_)).map((_) => ({ key: _._id, label: _.displayName }))"
    @update:value="handleChangeApi"
  />
</template>

<style>
  .schema-list-box {
    width: 200px;
    border: none;
    padding: 20px 0;
    background-color: #fff;
  }
</style>
