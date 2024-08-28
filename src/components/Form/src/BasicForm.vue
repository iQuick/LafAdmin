<template>
  <n-form v-bind="getBindValue" :model="formModel" ref="formElRef" label-width="auto">
    <n-grid v-bind="getGrid">
      <n-gi v-bind="schema.giProps" v-for="schema in getSchema" :key="schema.field">
        <n-form-item :label="schema.label" :path="schema.field">
          <!--标签名右侧温馨提示-->
          <template #label v-if="schema.labelMessage">
            {{ schema.label }}
            <n-tooltip trigger="hover" :style="schema.labelMessageStyle">
              <template #trigger>
                <n-icon size="18" class="text-gray-400 cursor-pointer">
                  <QuestionCircleOutlined />
                </n-icon>
              </template>
              {{ schema.labelMessage }}
            </n-tooltip>
          </template>

          <!--判断插槽-->
          <template v-if="schema.slot">
            <slot
              :name="schema.slot"
              :model="formModel"
              :field="schema.field"
              :value="formModel[schema.field]"
            ></slot>
          </template>

          <!-- NInputTextArea -->
          <template v-else-if="schema.component === 'NInputTextArea'">
            <n-input
              type="textarea"
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>

          <!--NInputMobile-->
          <template v-else-if="schema.component === 'NInputMobile'">
            <n-input
              :input-props="{ type: 'tel' }"
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>

          <!--NInputPassword-->
          <template v-else-if="schema.component === 'NInputPassword'">
            <n-input
              :input-props="{ type: 'password' }"
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>

          <!--NInputEmail-->
          <template v-else-if="schema.component === 'NInputEmail'">
            <n-input
              :input-props="{ type: 'email' }"
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>

          <!--NInputUrl-->
          <template v-else-if="schema.component === 'NInputUrl'">
            <n-input
              :input-props="{ type: 'url' }"
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>

          <!--NCheckbox-->
          <template v-else-if="schema.component === 'NCheckbox'">
            <n-checkbox-group v-model:value="formModel[schema.field]">
              <n-space>
                <n-checkbox
                  v-for="(value, key) in schema.componentProps.options"
                  :key="key"
                  :value="value"
                  :label="value"
                />
              </n-space>
            </n-checkbox-group>
          </template>

          <!--NRadioGroup-->
          <template v-else-if="schema.component === 'NRadioGroup'">
            <n-radio-group v-model:value="formModel[schema.field]">
              <n-space>
                <n-radio
                  v-for="(value, key) in schema.componentProps.options"
                  :key="key"
                  :value="value"
                  :label="value"
                />
              </n-space>
            </n-radio-group>
          </template>
          <!--NDynamicTags-->
          <template v-else-if="schema.component === 'NDynamicTags'">
            <n-dynamic-tags
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>
          <!--NEnum-->
          <template v-else-if="schema.component === 'NEnum'">
            <n-select
              @updateValue="(v) => handleEnumSelectUpdate(schema, v)"
              v-model:value="enumSelected[schema.field]"
              :options="schema.componentProps.options"
              :multiple="schema.componentProps.multiple"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>
          <!--NSelect-->
          <template v-else-if="schema.component === 'NSelect'">
            <n-select
              v-model:value="formModel[schema.field]"
              :options="schema.componentProps.options"
              :multiple="schema.componentProps.multiple"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>

          <!--NSelectRemote-->
          <template v-else-if="schema.component === 'NSelectRemote'">
            <n-select
              v-model:value="formModel[schema.field]"
              :options="schema.componentProps.options"
              :multiple="schema.componentProps.multiple"
              remote
              clearable
              @search="schema.componentProps.onSearch"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>
          <!--NRate-->
          <template v-else-if="schema.component === 'NRate'">
            <n-rate
              v-model:value="formModel[schema.field]"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>

          <!--NUploader-->
          <template v-else-if="schema.component === 'NUpload'">
            <n-upload
              :multiple="schema.componentProps.multiple"
              :max="schema.componentProps.multiple ? 99 : 1"
              :custom-request="customRequest"
              v-model:file-list="uploadFileList[schema.field]"
              @update:file-list="
                (list) => handleFileListChange(schema.field, schema.componentProps.multiple, list)
              "
              @beforeUpload="(file) => handleUploadBefore(schema.type, file)"
              @finish="handleUploadFinish"
              @remove="handleUploadRemove"
            >
              <n-upload-dragger>
                <div style="margin-bottom: 12px">
                  <n-icon size="48" :depth="3">
                    <archive-icon />
                  </n-icon>
                </div>
                <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传</n-text>
              </n-upload-dragger>
            </n-upload>
          </template>

          <!--NDateTimePicker-->
          <template v-else-if="schema.component === 'NDateTimePicker'">
            <n-date-picker
              v-model:value="formModel[schema.field]"
              type="datetime"
              :class="{ isFull: schema.isFull != false && getProps.isFull }"
            />
          </template>

          <!--RichText-->
          <template v-else-if="schema.component === 'NRichText'">
            <div style="border: 1px solid #ccc" :style="editorStyle">
              <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="editorMode" />
              <Editor
                style="height: 500px; overflow-y: hidden"
                v-model="formModel[schema.field]"
                :defaultConfig="editorConfig"
                :mode="editorMode"
                @onCreated="handleEditorCreated"
              />
            </div>
          </template>

          <!--Markdown-->
          <template v-else-if="schema.component === 'NMarkdown'">
            <v-md-editor v-model="formModel[schema.field]" height="400px" />
          </template>

          <!--动态渲染表单组件-->
          <component
            v-else
            v-bind="getComponentProps(schema)"
            :is="schema.component"
            v-model:value="formModel[schema.field]"
            :multiple="schema.componentProps.multiple"
            :class="{ isFull: schema.isFull != false && getProps.isFull }"
          />
          <!--组件后面的内容-->
          <template v-if="schema.suffix">
            <slot
              :name="schema.suffix"
              :model="formModel"
              :field="schema.field"
              :value="formModel[schema.field]"
            ></slot>
          </template>
        </n-form-item>
      </n-gi>
      <!--提交 重置 展开 收起 按钮-->
      <n-gi
        :span="isInline ? '' : 24"
        :suffix="isInline ? true : false"
        #="{ overflow }"
        v-if="getProps.showActionButtonGroup"
      >
        <n-space
          align="center"
          :justify="isInline ? 'end' : 'start'"
          :style="{ 'margin-left': `${isInline ? 12 : getProps.labelWidth}px` }"
        >
          <n-button
            v-if="getProps.showSubmitButton"
            v-bind="getSubmitBtnOptions"
            @click="handleSubmit"
            :loading="loadingSub"
            >{{ getProps.submitButtonText }}
          </n-button>
          <n-button v-if="getProps.showResetButton" v-bind="getResetBtnOptions" @click="resetFields"
            >{{ getProps.resetButtonText }}
          </n-button>
          <n-button
            type="primary"
            text
            icon-placement="right"
            v-if="isInline && getProps.showAdvancedButton"
            @click="unfoldToggle"
          >
            <template #icon>
              <n-icon size="14" class="unfold-icon" v-if="overflow">
                <DownOutlined />
              </n-icon>
              <n-icon size="14" class="unfold-icon" v-else>
                <UpOutlined />
              </n-icon>
            </template>
            {{ overflow ? '展开' : '收起' }}
          </n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts">
  import '@wangeditor/editor/dist/css/style.css'; // 引入 css

  import {
    defineComponent,
    reactive,
    ref,
    computed,
    unref,
    onMounted,
    onBeforeUnmount,
    watch,
    shallowRef,
  } from 'vue';
  import { createPlaceholderMessage } from './helper';
  import { useFormEvents } from './hooks/useFormEvents';
  import { useFormValues } from './hooks/useFormValues';

  import { basicProps } from './props';
  import { DownOutlined, UpOutlined, QuestionCircleOutlined } from '@vicons/antd';
  import { useMessage } from 'naive-ui';

  import type { Ref } from 'vue';
  import type { GridProps } from 'naive-ui/lib/grid';
  import type { FormSchema, FormProps, FormActionType } from './types/form';
  import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5';

  import { isArray } from '@/utils/is/index';
  import { deepMerge } from '@/utils';
  import { uploadFile } from '@/api/cloud';
  import { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
  import { Recordable } from 'vite-plugin-mock';
  import { Toolbar, Editor } from '@wangeditor/editor-for-vue';

  export default defineComponent({
    name: 'BasicForm',
    components: { DownOutlined, UpOutlined, QuestionCircleOutlined, Toolbar, Editor, ArchiveIcon },
    props: {
      ...basicProps,
    },
    emits: ['reset', 'handleSubmit', 'register'],
    setup(props, { emit, attrs }) {
      const defaultFormModel = ref<Recordable>({});
      const formModel = reactive<Recordable>({});
      const propsRef = ref<Partial<FormProps>>({});
      const schemaRef = ref<Nullable<FormSchema[]>>(null);
      const formElRef = ref<Nullable<FormActionType>>(null);
      const gridCollapsed = ref(true);
      const loadingSub = ref(false);
      const isUpdateDefaultRef = ref(false);
      const message = useMessage();

      // 编辑器实例，必须用 shallowRef
      const editorRef = shallowRef();
      const editorMode = 'default';
      const editorStyle = ref('');
      const toolbarConfig = {};
      const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} };
      editorConfig.MENU_CONF['uploadImage'] = {
        // 自定义上传
        async customUpload(file: File, insertFn: InsertFnType) {
          console.log('upload image');
          const dt = await uploadFile(file, props['name'], (progress) => {
            console.log('upload progress :', progress);
          });
          const { url } = dt;
          insertFn(url, '', '');
        },
      };
      editorConfig.MENU_CONF['uploadVideo'] = {
        // 自定义上传
        async customUpload(file: File, insertFn: InsertFnType) {
          console.log('upload video');
          const dt = await uploadFile(file, props['name'], (progress) => {
            console.log('upload progress :', progress);
          });
          const { url } = dt;
          insertFn(url, '');
        },
      };

      const handleEditorCreated = (editor) => {
        editorRef.value = editor; // 记录 editor 实例，重要！
        editorRef.value.on('fullScreen', () => {
          editorStyle.value = 'z-index: 1001';
        });
        editorRef.value.on('unFullScreen', () => {
          editorStyle.value = '';
        });
      };

      onBeforeUnmount(() => {
        const editor = editorRef.value;
        if (editor == null) return;
        editor.destroy();
      });

      const getProps = computed((): FormProps => {
        const formProps = { ...props, ...unref(propsRef) } as FormProps;
        const rulesObj: any = {
          rules: {},
        };
        const schemas: any = formProps.schemas || [];
        schemas.forEach((item) => {
          if (item.rules && isArray(item.rules)) {
            rulesObj.rules[item.field] = item.rules;
          }
        });
        return { ...formProps, ...unref(rulesObj) };
      });

      const isInline = computed(() => {
        const { layout } = unref(getProps);
        return layout === 'inline';
      });

      const getGrid = computed((): GridProps => {
        const { gridProps } = unref(getProps);
        return {
          ...gridProps,
          collapsed: isInline.value ? gridCollapsed.value : false,
          responsive: 'screen',
        };
      });

      const getBindValue = computed(
        () => ({ ...attrs, ...props, ...unref(getProps) } as Recordable)
      );

      const getSchema = computed((): FormSchema[] => {
        const schemas: FormSchema[] = unref(schemaRef) || (unref(getProps).schemas as any);
        for (const schema of schemas) {
          const { defaultValue } = schema;
          // handle date type
          // dateItemType.includes(component as string)
          if (defaultValue) {
            schema.defaultValue = defaultValue;
          }
        }
        return schemas as FormSchema[];
      });

      watch(getSchema, (schemas) => {
        loadUploadFile(schemas);
        loadEnumSelected(schemas);
      });

      const uploadFileList = reactive({});
      const loadUploadFile = (schemas) => {
        for (const schema of schemas) {
          uploadFileList[schema.field] = [];
          if (!(schema.component === 'NUpload')) {
            continue;
          }
          if (!schema.defaultValue) {
            continue;
          }
          if (schema.componentProps?.multiple) {
            (schema.defaultValue as []).forEach((url) => {
              uploadFileList[schema.field].push({
                name: url,
                url: url,
                thumbnailUrl: url,
                status: 'finished',
              });
            });
          } else {
            uploadFileList[schema.field].push({
              name: schema.defaultValue,
              url: schema.defaultValue,
              thumbnailUrl: schema.defaultValue,
              status: 'finished',
            });
          }
        }
      };
      const customRequest = async (options: UploadCustomRequestOptions) => {
        const { file, onProgress, onFinish, onError } = options;
        uploadFile(file?.file as File, '', (progress) => {
          onProgress({ percent: progress });
        })
          .then((info) => {
            file.url = info.url;
            file.thumbnailUrl = info.url;
            onFinish();
          })
          .catch((e) => {
            message.error('上传失败');
            onError();
          });
      };

      const enumSelected = reactive({});
      const loadEnumSelected = (schemas) => {
        for (const schema of schemas) {
          if (!(schema.component === 'NEnum')) {
            continue;
          }
          if (!schema.defaultValue) {
            continue;
          }
          if (schema.componentProps?.multiple) {
            enumSelected[schema.field] = schema.defaultValue.map((_) => _.value);
          } else {
            enumSelected[schema.field] = schema.defaultValue.value;
          }
        }
      };
      const handleEnumSelectUpdate = (schema, value) => {
        const values = schema.componentProps?.options.filter((_) => {
          return value.indexOf(_.value) !== -1;
        });
        if (schema.componentProps?.multiple) {
          formModel[schema.field] = values;
        } else {
          if (values.length > 0) {
            formModel[schema.field] = values[0];
          } else {
            formModel[schema.field] = '';
          }
        }
      };

      const handleUploadBefore = (type: any, data: any) => {
        console.log('handleUploadBefore ');
        if (type === 'Image' && !data.file.file?.type.startsWith('image/')) {
          message.error('请上传图片文件');
          return false;
        }
        if (type === 'Video' && !data.file.file?.type.startsWith('video/')) {
          message.error('请上传视频文件');
          return false;
        }
        if (type === 'Audio' && !data.file.file?.type.startsWith('audio/')) {
          message.error('请上传音频文件');
          return false;
        }
        return true;
      };

      const handleUploadFinish = (data: any) => {
        // formModel[res] = uploadFileUrl.value;
      };

      const handleUploadRemove = (data: any) => {
        // formModel[res] = '';
      };

      const handleFileListChange = (res: any, multiple: Boolean, list: UploadFileInfo[]) => {
        if (multiple) {
          formModel[res] = list.map((item) => {
            return item.url;
          });
        } else {
          if (list.length > 0) {
            formModel[res] = list[0].url;
          } else {
            formModel[res] = '';
          }
        }
      };

      const getSubmitBtnOptions = computed(() => {
        return Object.assign(
          {
            size: props.size,
            type: 'primary',
          },
          props.submitButtonOptions
        );
      });

      const getResetBtnOptions = computed(() => {
        return Object.assign(
          {
            size: props.size,
            type: 'default',
          },
          props.resetButtonOptions
        );
      });

      function getComponentProps(schema) {
        const compProps = schema.componentProps ?? {};
        const component = schema.component;
        return {
          clearable: true,
          placeholder: createPlaceholderMessage(unref(component)),
          ...compProps,
        };
      }

      const { handleFormValues, initDefault } = useFormValues({
        defaultFormModel,
        getSchema,
        formModel,
      });

      const { handleSubmit, validate, resetFields, getFieldsValue, clearValidate, setFieldsValue } =
        useFormEvents({
          emit,
          getProps,
          formModel,
          getSchema,
          formElRef: formElRef as Ref<FormActionType>,
          defaultFormModel,
          loadingSub,
          handleFormValues,
        });

      function unfoldToggle() {
        gridCollapsed.value = !gridCollapsed.value;
      }

      async function setProps(formProps: Partial<FormProps>): Promise<void> {
        propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
      }

      const formActionType: Partial<FormActionType> = {
        getFieldsValue,
        setFieldsValue,
        resetFields,
        validate,
        clearValidate,
        setProps,
        submit: handleSubmit,
      };

      watch(
        () => getSchema.value,
        (schema) => {
          if (unref(isUpdateDefaultRef)) {
            return;
          }
          if (schema?.length) {
            initDefault();
            isUpdateDefaultRef.value = true;
          }
        }
      );

      onMounted(() => {
        initDefault();
        emit('register', formActionType);
      });

      return {
        editorRef,
        editorMode,
        editorStyle,
        toolbarConfig,
        editorConfig,
        formElRef,
        formModel,
        getGrid,
        getProps,
        getBindValue,
        getSchema,
        getSubmitBtnOptions,
        getResetBtnOptions,
        handleSubmit,
        resetFields,
        loadingSub,
        isInline,
        getComponentProps,
        uploadFileList,
        unfoldToggle,
        customRequest,
        enumSelected,
        handleEnumSelectUpdate,
        handleUploadBefore,
        handleUploadFinish,
        handleUploadRemove,
        handleFileListChange,
        handleEditorCreated,
      };
    },
  });
</script>

<style lang="less">
  h1 {
    font-size: 2.2em;
    font-weight: bold;
  }

  h2 {
    font-size: 1.8em;
    font-weight: bold;
  }

  h3 {
    font-size: 1.5em;
    font-weight: bold;
  }

  h4 {
    font-size: 1.2em;
    font-weight: bold;
  }

  h5 {
    font-size: 1em;
    font-weight: bold;
  }

  .isFull {
    width: 100%;
    justify-content: flex-start;
  }

  .unfold-icon {
    display: flex;
    align-items: center;
    height: 100%;
    margin-left: -3px;
  }
</style>
