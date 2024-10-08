interface FieldType {
  name: string;
  type: SchemaFieldType;
  description?: string;
}

/**
 * 当期支持的字段类型
 */
export const FieldTypes: FieldType[] = [
  // 字符串：单行
  {
    type: 'String',
    name: '单行字符串',
  },
  // 字符串：多行
  {
    type: 'MultiLineString',
    name: '多行字符串',
  },
  // 数字：整形、浮点型
  {
    type: 'Number',
    name: '数字',
  },
  // 布尔值
  {
    type: 'Boolean',
    name: '布尔值',
  },
  {
    type: 'SingleSelect',
    name: '单选',
  },
  {
    type: 'MultipleSelect',
    name: '多选',
  },
  {
    type: 'Enum',
    name: '枚举',
  },
  {
    type: 'Rate',
    name: '评分',
  },
  // {
  //   type: 'SingleEnum',
  //   name: '单选枚举',
  // },
  // {
  //   type: 'MultipleEnum',
  //   name: '多选枚举',
  // },
  // 时间
  {
    type: 'Date',
    name: '日期',
    description: '只包含日期，如 2020-09-01',
  },
  {
    type: 'DateTime',
    name: '日期与时间',
    description: '包含日期和时间，如 2020-09-01 10:11:07',
  },
  // **颜色：Color**
  // 文件：File
  {
    type: 'File',
    name: '文件',
  },
  // 图片：Image
  {
    type: 'Image',
    name: '图片',
  },
  {
    type: 'Audio',
    name: '音频',
  },
  {
    type: 'Video',
    name: '视频',
  },
  // {
  //   type: 'Attachment',
  //   name: '附件',
  // },
  // {
  //   type: 'Media',
  //   name: '多媒体',
  // },
  // 邮箱地址
  {
    type: 'Email',
    name: '邮箱地址',
  },
  // 电话号码
  {
    type: 'Tel',
    name: '电话号码',
  },
  // 网址
  {
    type: 'Url',
    name: '网址',
  },
  // 富文本
  {
    type: 'RichText',
    name: '富文本',
  },
  // Markdown
  {
    type: 'Markdown',
    name: 'Markdown',
  },
  {
    type: 'Connect',
    name: '关联',
  },
  {
    type: 'Array',
    name: '数组',
  },
  // {
  //   type: 'Object',
  //   name: 'JSON 对象',
  //   description: '可以自由存储类 JSON 对象和数组（非 JSON 字符串）',
  // },
];

export const DOC_ID_FIELD = {
  displayName: '文档 ID',
  id: '_id',
  name: '_id',
  type: 'String',
  isSystem: true,
  copyable: true,
  isHidden: true,
  description: 'CMS 系统字段，请勿随意修改',
};

/**
 * 系统默认字段
 */
export const SYSTEM_FIELDS: any[] = [
  DOC_ID_FIELD,
  {
    displayName: '创建时间',
    id: '_createTime',
    name: '_createTime',
    type: 'DateTime',
    isSystem: true,
    dateFormatType: 'timestamp-ms',
    description: 'CMS 系统字段，请勿随意修改。通过 CMS 系统录入的数据会默认添加该字段',
  },
  {
    displayName: '修改时间',
    id: '_updateTime',
    name: '_updateTime',
    type: 'DateTime',
    isSystem: true,
    dateFormatType: 'timestamp-ms',
    description: 'CMS 系统字段，请勿随意修改。通过 CMS 系统录入的数据会默认添加该字段',
  },
];
