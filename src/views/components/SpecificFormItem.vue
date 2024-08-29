<script setup lang="ts">
  import { ref, toRefs, watch } from 'vue';
  import { SelectOption } from 'naive-ui';

  const props = defineProps<{
    type: SchemaFieldType;
    options: {
      formValue: SchemaField;
      schemas: Schema[];
      selectField: Partial<SchemaField> | undefined;
      c: 'edit' | 'create';
      connectSchema?: Schema;
    };
  }>();

  const { type, options } = toRefs(props);
  const { fieldAction, formValue, schemas } = options.value;

  const enumSelectedDef = ref(null);
  watch(enumSelectedDef, (vls) => {
    if (vls && ['Enum', 'SingleEnum', 'MultipleEnum'].includes(type.value)) {
      const data = formValue.enumElements.filter((_) => {
        if (!_.value) {
          return false;
        }
        if (Array.isArray(vls)) {
          return vls.indexOf(_.value) !== -1;
        } else {
          return vls === _.value;
        }
      });
      if (formValue.isMultiple) {
        formValue.defaultValue = data;
      } else {
        if (data.length > 0) {
          formValue.defaultValue = data[0];
        }
      }
    }
  });

  if (type.value === 'Date') {
    formValue.dateFormatType = 'timestamp-ms';
  }

  const handleAddEnumElement = () => {
    if (!formValue.enumElements) formValue.enumElements = [];
    formValue.enumElements.push({ label: '', value: '' });
  };
  const handleConnectCollection = (value: string, option: SelectOption) => {
    for (let schema of schemas) {
      if (schema._id == value) {
        formValue.connectCollection = schema.collectionName;
        break;
      }
    }
  };
  const handleEnumSelectUpdate = (v) => {
    console.debug(v);
  };
</script>

<template>
  <n-grid :x-gap="12" :cols="2" v-if="['String', 'MultiLineString', 'Number'].includes(type)">
    <n-grid-item>
      <n-form-item :label="type === 'Number' ? '最小值' : '最小长度'" path="min">
        <n-input-number
          v-model:value="formValue.min"
          :placeholder="type === 'Number' ? '请输入最小值' : '请输入最小长度'"
        />
      </n-form-item>
    </n-grid-item>
    <n-grid-item>
      <n-form-item :label="type === 'Number' ? '最大值' : '最大长度'" path="max">
        <n-input-number
          v-model:value="formValue.max"
          :placeholder="type === 'Number' ? '请输入最大值' : '请输入最大长度'"
        />
      </n-form-item>
    </n-grid-item>
  </n-grid>

  <!-- <n-grid :x-gap="12" :cols="1" v-else-if="['Date', 'DateTime'].includes(type)">
    <n-grid-item>
      <n-form-item label="时间存储格式" path="dateFormatType">
        <n-select
          v-model:value="formValue.dateFormatType"
          placeholder="请选择时间存储格式"
          size="small"
          :options="[
            { label: 'Unix Timestamp 毫秒', value: 'timestamp-ms' },
            { label: 'Unix Timestamp 秒', value: 'timestamp-s' },
            { label: 'Date 对象', value: 'date' },
            { label: '时间字符串', value: 'string' },
          ]"
        />
      </n-form-item>
    </n-grid-item>
  </n-grid> -->

  <n-grid :x-gap="12" :cols="1" v-else-if="['SingleSelect', 'MultipleSelect'].includes(type)">
    <n-grid-item>
      <n-form-item label="默认值" path="selectType">
        <n-radio-group v-if="!formValue.isMultiple" v-model:value="formValue.defaultValue">
          <n-space>
            <n-radio
              v-for="(value, key) in formValue.selectElements"
              :key="key"
              :value="value"
              :label="value"
            />
          </n-space>
        </n-radio-group>
        <n-checkbox-group v-else v-model:value="formValue.defaultValue">
          <n-space>
            <n-checkbox
              v-for="(value, key) in formValue.selectElements"
              :key="key"
              :value="value"
              :label="value"
            />
          </n-space>
        </n-checkbox-group>
      </n-form-item>
    </n-grid-item>

    <n-grid-item disabled hidden>
      <n-form-item label="选项类型" path="selectType">
        <n-input v-model:value="formValue.isMultiple" />
      </n-form-item>
    </n-grid-item>
    <n-grid-item>
      <n-form-item label="选项列表" path="selectElements">
        <n-dynamic-tags v-model:value="formValue.selectElements" type="info" />
      </n-form-item>
    </n-grid-item>
  </n-grid>

  <n-grid :x-gap="12" :cols="1" v-else-if="['Enum', 'SingleEnum', 'MultipleEnum'].includes(type)">
    <n-grid-item>
      <n-form-item label="默认值" path="selectType">
        <n-select
          @updateValue="(v) => handleEnumSelectUpdate(v)"
          v-model:value="enumSelectedDef"
          :options="formValue.enumElements"
          :multiple="formValue.isMultiple"
        />
      </n-form-item>
    </n-grid-item>

    <n-grid-item>
      <n-grid :x-gap="12" :cols="2">
        <n-grid-item>
          <n-form-item label="单选/多选" path="enumSelect">
            <n-select
              v-model:value="formValue.isMultiple"
              placeholder="请选择单选/多选"
              size="small"
              :disabled="fieldAction === 'edit'"
              :options="[
                { label: '单选', value: false },
                { label: '多选', value: true },
              ]"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item label="枚举元素类型" path="enumType">
            <n-select
              v-model:value="formValue.enumElementType"
              placeholder="请选择枚举元素类型"
              default-value="string"
              size="small"
              :options="[
                { label: '字符串', value: 'string' },
                { label: '数字', value: 'number' },
              ]"
            />
          </n-form-item>
        </n-grid-item>
      </n-grid>
    </n-grid-item>

    <template v-for="(el, index) in formValue.enumElements" :key="el.value">
      <n-grid-item>
        <n-form-item :label="`枚举元素 ${index + 1}`" path="enumElements">
          <n-input
            style="width: 40%; margin-right: 10px"
            v-model:value="el.label"
            placeholder="枚举元素展示别名，如 已发布"
          />
          <n-input
            style="width: 40%; margin-right: 10px"
            v-model:value="el.value"
            placeholder="枚举元素值，如 published"
          />
          <n-button type="error" @click="() => formValue.enumElements.splice(index, 1)">
            删除
          </n-button>
        </n-form-item>
      </n-grid-item>
    </template>

    <n-grid-item>
      <n-form-item>
        <n-button style="width: 100%" @click="handleAddEnumElement">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          添加枚举元素
        </n-button>
      </n-form-item>
    </n-grid-item>
  </n-grid>

  <n-grid :x-gap="12" :cols="2" v-else-if="type === 'Connect'">
    <n-grid-item>
      <n-form-item label="关联模型" path="connectResource">
        <n-select
          v-model:value="formValue.connectResource"
          placeholder="请选择关联模型"
          size="small"
          @update:value="handleConnectCollection"
          :options="schemas.map((schema) => ({ label: schema.displayName, value: schema._id }))"
        />
      </n-form-item>
    </n-grid-item>

    <n-grid-item>
      <n-form-item label="展示字段" path="connectField">
        <n-select
          v-model:value="formValue.connectField"
          placeholder="请选择关联字段"
          size="small"
          :options="
            schemas
              .find((_) => _._id === formValue.connectResource)
              ?.fields.map((field) => ({
                label: field.displayName,
                value: field.name,
              })) || []
          "
        />
      </n-form-item>
    </n-grid-item>
  </n-grid>
</template>
