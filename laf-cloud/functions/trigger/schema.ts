import cloud from '@lafjs/cloud';
import { ok } from '@/system/call';

export default async function (ctx: FunctionContext) {
  const pipeline = [
    { $match: { operationType: { $in: ['insert', 'delete', 'update', 'replace'] } } }
  ];

  cloud.mongo
    .db
    .collection('schema')
    .watch(pipeline)
    .on('change', (change: any) => {
      const operationType = change.operationType;
      const document = change.fullDocument;
      console.log('Unknown operation:', operationType, document);
      if (operationType === 'insert') {
        // 插入
      } else if (operationType === 'delete') {
        // 删除
      } else if (operationType === 'update' || operationType === 'replace') {
        // 更新
      }
    });
    
  return ok('success');
}
