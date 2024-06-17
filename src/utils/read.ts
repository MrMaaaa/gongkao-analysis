import { message } from 'antd';
import ErrorUtils from '@/utils/error';

export const readJSON = <T>(fetchFunction: () => T) => {
  try {
    const list = fetchFunction();
    return list;
  } catch (e) {
    const errMsg = ErrorUtils.getErrorMessage(e);
    if (errMsg.startsWith('Cannot find module')) {
      message.error('数据文件未找到');
    }
    console.log(e);
    return [];
  }
};
