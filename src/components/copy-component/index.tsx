import React from 'react';
import { message } from 'antd';
import { useMemoizedFn } from 'ahooks';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './index.scss';

const CopyComponent: React.FC<{ value: string }> = ({ value }) => {
  const onCopySuccess = useMemoizedFn(() => {
    message.success('复制成功');
  });
  return (
    <CopyToClipboard text={value} onCopy={onCopySuccess}>
      <span className="copy-wrapper">
        {value}
        <CopyOutlined className="copy-icon" />
      </span>
    </CopyToClipboard>
  );
};

export default CopyComponent;
