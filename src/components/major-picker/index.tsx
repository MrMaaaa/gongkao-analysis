import { Select } from 'antd';
import { MajorItem } from '@/interface';
import majorList from './major.json';

const MajorPicker: React.FC<{
  onChange?: (majorCode: string, item: MajorItem | MajorItem[]) => void;
}> = ({ onChange }) => {
  return (
    <Select
      showSearch
      filterOption={(input: string, option?: MajorItem) =>
        (option?.majorName ?? '').toLowerCase().includes(input.toLowerCase())
      }
      allowClear
      defaultValue={null}
      placeholder={'请选择普通高等学校本科专业'}
      options={majorList}
      notFoundContent={<span>未查到该专业</span>}
      fieldNames={{
        label: 'majorName',
        value: 'majorCode',
      }}
      onChange={onChange}
    />
  );
};

export default MajorPicker;
