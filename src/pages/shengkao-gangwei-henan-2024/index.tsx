import { useMemoizedFn, useSafeState } from 'ahooks';
import { Table, Form, Input, Button } from 'antd';
import { TableProps } from 'antd/lib/table';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SubjectPicker from '@/components/major-picker';
import { PostRecruitmentItemKeyMapper } from '@/interface';
import postList from '@/files/shengkao-gangwei-henan-2024.json';
import './index.scss';

interface FormSubmit {
  recruitmentInstitution: string;
  majorType: string;
  postId: string;
}

const columns: TableProps['columns'] = [
  {
    title: PostRecruitmentItemKeyMapper.recruitmentInstitution,
    width: 200,
    dataIndex: 'recruitmentInstitution',
    fixed: 'left',
    render: (value) => (
      <>
        <CopyToClipboard text={value}>
          <>
            {value}
            <CopyOutlined />
          </>
        </CopyToClipboard>
      </>
    ),
  },
  {
    title: PostRecruitmentItemKeyMapper.postName,
    width: 100,
    dataIndex: 'postName',
    align: 'center',
  },
  {
    title: PostRecruitmentItemKeyMapper.postId,
    width: 100,
    dataIndex: 'postId',
    align: 'center',
    render: (value) => (
      <>
        <CopyToClipboard text={value}>
          <>
            {value}
            <CopyOutlined />
          </>
        </CopyToClipboard>
      </>
    ),
  },
  {
    title: PostRecruitmentItemKeyMapper.recruitmentNumber,
    width: 100,
    dataIndex: 'recruitmentNumber',
    align: 'center',
  },
  {
    title: PostRecruitmentItemKeyMapper.ageRequirement,
    width: 100,
    dataIndex: 'ageRequirement',
    align: 'center',
    filters: [
      {
        text: '18周岁以上、25周岁以下',
        value: '18周岁以上、25周岁以下',
      },
      {
        text: '18周岁以上、30周岁以下',
        value: '18周岁以上、30周岁以下',
      },
      {
        text: '18周岁以上、30周岁以下，应届硕士、博士研究生（非在职）为35周岁以下',
        value:
          '18周岁以上、30周岁以下，应届硕士、博士研究生（非在职）为35周岁以下',
      },
      {
        text: '18周岁以上、35周岁以下',
        value: '18周岁以上、35周岁以下',
      },
    ],
    onFilter: (value, record) => record.ageRequirement === value,
  },
  {
    title: PostRecruitmentItemKeyMapper.educationRequirement,
    width: 100,
    dataIndex: 'educationRequirement',
    align: 'center',
    filters: [
      {
        text: '本科或硕士研究生',
        value: '本科或硕士研究生',
      },
      {
        text: '本科及以上',
        value: '本科及以上',
      },
      {
        text: '大专及以上',
        value: '大专及以上',
      },
      {
        text: '高等学校本科及以上',
        value: '高等学校本科及以上',
      },
      {
        text: '仅限本科',
        value: '仅限本科',
      },
      {
        text: '仅限博士研究生',
        value: '仅限博士研究生',
      },
      {
        text: '仅限高等学校本科',
        value: '仅限高等学校本科',
      },
      {
        text: '仅限高等学校硕士研究生',
        value: '仅限高等学校硕士研究生',
      },
      {
        text: '仅限硕士研究生',
        value: '仅限硕士研究生',
      },
      {
        text: '硕士研究生及以上',
        value: '硕士研究生及以上',
      },
    ],
    onFilter: (value, record) => record.educationRequirement === value,
  },
  {
    title: PostRecruitmentItemKeyMapper.degreeRequirement,
    width: 100,
    dataIndex: 'degreeRequirement',
    align: 'center',
    filters: [
      {
        text: '博士',
        value: '博士',
      },
      {
        text: '硕士',
        value: '硕士',
      },
      {
        text: '无要求',
        value: '无要求',
      },
      {
        text: '学士',
        value: '学士',
      },
      {
        text: '与学历相对应的学位',
        value: '与学历相对应的学位',
      },
    ],
    onFilter: (value, record) => record.degreeRequirement === value,
  },
  {
    title: PostRecruitmentItemKeyMapper.majorType,
    width: 200,
    dataIndex: 'majorType',
  },
  {
    title: PostRecruitmentItemKeyMapper.otherRequirement,
    width: 100,
    dataIndex: 'otherRequirement',
    align: 'center',
  },
  {
    title: PostRecruitmentItemKeyMapper.physicalExaminationStandard,
    width: 100,
    dataIndex: 'physicalExaminationStandard',
    align: 'center',
  },
  {
    title: PostRecruitmentItemKeyMapper.isPhysicalFitnessTest,
    width: 100,
    dataIndex: 'isPhysicalFitnessTest',
    align: 'center',
    filters: [
      {
        text: '是',
        value: '是',
      },
      {
        text: '否',
        value: '否',
      },
    ],
    onFilter: (value, record) => record.isPhysicalFitnessTest === value,
  },
  {
    title: PostRecruitmentItemKeyMapper.remark,
    width: 100,
    dataIndex: 'remark',
    align: 'center',
  },
];

const TableForm: React.FC<{
  onFinish: (values: FormSubmit) => void;
  suffix: React.ReactElement;
}> = ({ onFinish, suffix }) => {
  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        recruitmentInstitution: '',
        majorType: '',
        postId: '',
      }}
      layout="inline"
    >
      <Form.Item name="majorType">
        <SubjectPicker />
      </Form.Item>
      <Form.Item name="recruitmentInstitution">
        <Input placeholder="请输入招录单位" allowClear />
      </Form.Item>
      <Form.Item name="postId">
        <Input placeholder="请输入职位代码" allowClear />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">查询</Button>
        {suffix}
      </Form.Item>
    </Form>
  );
};

const Index: React.FC = () => {
  const [postShowList, setPostShowList] = useSafeState(postList);
  const onFinish = useMemoizedFn((values: FormSubmit) => {
    console.log(values);
    setPostShowList(
      postList
        .filter((item) => {
          if (!values.recruitmentInstitution) {
            return true;
          } else if (!values.recruitmentInstitution.includes(' ')) {
            return item.recruitmentInstitution.includes(
              values.recruitmentInstitution,
            );
          } else {
            const conditions = values.recruitmentInstitution.split(' ');
            return conditions.reduce((p, c) => {
              return p && item.recruitmentInstitution.includes(c);
            }, true);
          }
        })
        .filter((item) => {
          if (!item.postId) {
            return true;
          } else {
            return String(item.postId).includes(values.postId);
          }
        })
        .filter((item) => {
          if (!item.majorType) {
            return true;
          } else {
            return item.majorType.includes(values.majorType);
          }
        }),
    );
  });

  return (
    <div className="shengkao-gangwei-henan-2024">
      <div className="form">
        <TableForm
          onFinish={onFinish}
          suffix={
            <span className="post-count">
              共查询到
              <span className="post-count-num">{postShowList.length}</span>
              个岗位
            </span>
          }
        />
      </div>
      <Table
        className="table"
        dataSource={postShowList}
        columns={columns}
        scroll={{ x: 800, y: 600 }}
        bordered
        size={'middle'}
      />
    </div>
  );
};

export default Index;