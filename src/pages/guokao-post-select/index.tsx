import { useMount, useMemoizedFn, useSafeState } from 'ahooks';
import { Table, Form, Input, Button, message, Checkbox, Alert } from 'antd';
import { useParams } from 'react-router-dom';
import { TableProps } from 'antd/lib/table';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SubjectPicker from '@/components/major-picker';
import TextOverflow from '@/components/text-overflow';
import ContentOverflow from '@/components/content-overflow';
import {
  GuoKaoRecruitmentItem,
  GuokaoPostRecruitmentItemKeyMapper,
} from '@/interface';
import { readJSON } from '@/utils';
import './index.scss';

interface FormSubmit {
  workPosition: string;
  majorType: string;
  postCode: string;
  departmentCode: string;
  isRegularDegreeAndNoExp: boolean;
  isNotPartyMember: boolean;
}

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

const columns: TableProps['columns'] = [
  {
    title: GuokaoPostRecruitmentItemKeyMapper.bureauName,
    width: 150,
    dataIndex: 'bureauName',
    fixed: 'left',
    render: (value, record) => (
      <div>
        <CopyComponent value={value} />
        <div className="col-tips">
          <span>{GuokaoPostRecruitmentItemKeyMapper.institutionNature}：</span>
          <span>{record.institutionNature}</span>
        </div>
      </div>
    ),
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.postName,
    width: 100,
    dataIndex: 'postName',
    align: 'center',
    render: (value, record) => (
      <div>
        {value}
        <div className="col-tips">
          {GuokaoPostRecruitmentItemKeyMapper.postDistribution}：
          {record.postDistribution}
        </div>
      </div>
    ),
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.postCode,
    width: 100,
    dataIndex: 'postCode',
    align: 'center',
    render: (value, record) => (
      <div>
        <CopyComponent value={value} />
        <div className="col-tips">
          {GuokaoPostRecruitmentItemKeyMapper.postType}：{record.postType}
        </div>
      </div>
    ),
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.postIntro,
    width: 100,
    dataIndex: 'postIntro',
    align: 'center',
    render: (value, record) => (
      <div>
        {value}
        <div className="col-tips">
          {GuokaoPostRecruitmentItemKeyMapper.institutionLevel}：
          {record.institutionLevel}
        </div>
      </div>
    ),
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.departmentName,
    width: 100,
    dataIndex: 'departmentName',
    align: 'center',
    render: (value, record) => (
      <div>
        {value}
        <div>
          {GuokaoPostRecruitmentItemKeyMapper.departmentCode}：
          <CopyComponent value={record.departmentCode} />
        </div>
      </div>
    ),
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.recruitmentNumber,
    width: 100,
    dataIndex: 'recruitmentNumber',
    align: 'center',
    render: (value, record) => (
      <div>
        {value}
        <div className="col-tips">
          {GuokaoPostRecruitmentItemKeyMapper.examType}：{record.examType}
        </div>
      </div>
    ),
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.ratioOfInterviewees,
    width: 100,
    dataIndex: 'ratioOfInterviewees',
    align: 'center',
    render: (value, record) => (
      <div>
        {value}
        <div className="col-tips">
          {
            GuokaoPostRecruitmentItemKeyMapper.isProfessionalAbilityTestAtInterview
          }
          ：{record.isProfessionalAbilityTestAtInterview}
        </div>
      </div>
    ),
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.workPosition,
    width: 100,
    dataIndex: 'workPosition',
    align: 'center',
    render: (value, record) => (
      <div>
        {value}
        <div className="col-tips">
          {GuokaoPostRecruitmentItemKeyMapper.residencePosition}：
          {record.residencePosition}
        </div>
      </div>
    ),
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.majorType,
    width: 150,
    dataIndex: 'majorType',
    render: (text) => {
      return <TextOverflow text={text} />;
    },
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.education,
    width: 150,
    dataIndex: 'education',
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
        text: '仅限本科',
        value: '仅限本科',
      },
      {
        text: '仅限博士研究生',
        value: '仅限博士研究生',
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
    onFilter: (value, record) => record.education === value,
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.degree,
    width: 100,
    dataIndex: 'degree',
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
        text: '与最高学历相对应的学位',
        value: '与最高学历相对应的学位',
      },
    ],
    onFilter: (value, record) => record.degree === value,
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.politicalStatus,
    width: 100,
    dataIndex: 'politicalStatus',
    align: 'center',
    filters: [
      {
        text: '中共党员',
        value: '中共党员',
      },
      {
        text: '中共党员或共青团员',
        value: '中共党员或共青团员',
      },
      {
        text: '不限',
        value: '不限',
      },
    ],
    onFilter: (value, record) => record.politicalStatus === value,
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.grassrootsWorkMinExperience,
    width: 100,
    dataIndex: 'grassrootsWorkMinExperience',
    align: 'center',
    filters: [
      {
        text: '二年',
        value: '二年',
      },
      {
        text: '无限制',
        value: '无限制',
      },
    ],
    onFilter: (value, record) => record.grassrootsWorkMinExperience === value,
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.grassrootsWorkProjectExperience,
    width: 100,
    dataIndex: 'grassrootsWorkProjectExperience',
    align: 'center',
    filters: [
      {
        text: '大学生村官',
        value: '大学生村官',
      },
      {
        text: '大学生村官、“三支一扶”计划',
        value: '大学生村官、“三支一扶”计划',
      },
      {
        text: '“三支一扶”计划、大学生志愿服务西部计划',
        value: '“三支一扶”计划、大学生志愿服务西部计划',
      },
      {
        text: '大学生村官、“三支一扶”计划、大学生志愿服务西部计划',
        value: '大学生村官、“三支一扶”计划、大学生志愿服务西部计划',
      },
      {
        text: '农村义务教育阶段学校教师特设岗位计划、大学生志愿服务西部计划',
        value: '农村义务教育阶段学校教师特设岗位计划、大学生志愿服务西部计划',
      },
      {
        text: '大学生村官、农村义务教育阶段学校教师特设岗位计划、“三支一扶”计划、大学生志愿服务西部计划',
        value:
          '大学生村官、农村义务教育阶段学校教师特设岗位计划、“三支一扶”计划、大学生志愿服务西部计划',
      },
      {
        text: '大学生村官、农村义务教育阶段学校教师特设岗位计划、“三支一扶”计划、大学生志愿服务西部计划、在军队服役5年（含）以上的高校毕业生退役士兵',
        value:
          '大学生村官、农村义务教育阶段学校教师特设岗位计划、“三支一扶”计划、大学生志愿服务西部计划、在军队服役5年（含）以上的高校毕业生退役士兵',
      },
      {
        text: '无限制',
        value: '无限制',
      },
    ],
    onFilter: (value, record) =>
      record.grassrootsWorkProjectExperience === value,
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.remark,
    width: 150,
    dataIndex: 'remark',
    render: (text) => {
      return <TextOverflow text={text} />;
    },
  },
  {
    title: GuokaoPostRecruitmentItemKeyMapper.departmentWebsite,
    width: 150,
    dataIndex: 'departmentWebsite',
    render: (text, record) => {
      return (
        <ContentOverflow>
          <div>
            {text.includes('.') ? (
              <a href={text} target="_blank" rel="noreferrer">
                <Button className="btn-link" type="link">
                  {text}
                </Button>
              </a>
            ) : (
              <span>{text}</span>
            )}
          </div>
          <div>
            {GuokaoPostRecruitmentItemKeyMapper.contactWay1}：
            {record.contactWay1}
          </div>
          <div>
            {GuokaoPostRecruitmentItemKeyMapper.contactWay2}：
            {record.contactWay2}
          </div>
          <div>
            {GuokaoPostRecruitmentItemKeyMapper.contactWay3}：
            {record.contactWay3}
          </div>
        </ContentOverflow>
      );
    },
  },
];

const TableForm: React.FC<{
  onFinish: (values: FormSubmit) => void;
  suffix: React.ReactElement;
}> = ({ onFinish, suffix }) => {
  const [form] = Form.useForm();
  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        workPosition: '',
        majorType: '',
        postCode: '',
        departmentCode: '',
        isRegularDegreeAndNoExp: false,
        isNotPartyMember: false,
      }}
      layout="inline"
      form={form}
    >
      {/* <Form.Item name="majorType" className="form-item__major-type">
        <SubjectPicker />
      </Form.Item> */}
      <Form.Item name="majorType" className="form-item__major-type">
        <Input placeholder="专业名称或代码，多个用+连接" allowClear />
      </Form.Item>
      {/* <Form.Item
        name="bureauName"
        className="form-item__recruitment-institution"
      >
        <Input placeholder="请输入招录单位" allowClear />
      </Form.Item> */}
      <Form.Item
        name="workPosition"
        className="form-item__recruitment-institution"
      >
        <Input placeholder="请输入城市" allowClear />
      </Form.Item>
      <Form.Item name="departmentCode" className="form-item__post-id">
        <Input placeholder="请输入部门代码" allowClear />
      </Form.Item>
      <Form.Item name="postCode" className="form-item__post-id">
        <Input placeholder="请输入职位代码" allowClear />
      </Form.Item>
      <Form.Item name="isRegularDegreeAndNoExp" valuePropName="checked">
        <Checkbox>本科学历且无基层经验</Checkbox>
      </Form.Item>
      <Form.Item name="isNotPartyMember" valuePropName="checked">
        <Checkbox>非中共党员（群众）</Checkbox>
      </Form.Item>
      <Form.Item className="form-item__operation">
        <Button.Group>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            htmlType="reset"
            onClick={() =>
              onFinish({
                workPosition: '',
                majorType: '',
                postCode: '',
                departmentCode: '',
                isRegularDegreeAndNoExp: false,
                isNotPartyMember: false,
              })
            }
          >
            重置
          </Button>
        </Button.Group>
        {suffix}
      </Form.Item>
    </Form>
  );
};

const Index: React.FC = () => {
  const routerParams = useParams();
  const [list, setList] = useSafeState<GuoKaoRecruitmentItem[]>([]);
  const [postShowList, setPostShowList] = useSafeState<GuoKaoRecruitmentItem[]>(
    [],
  );
  const [postShowListLength, setPostShowListLength] = useSafeState(0); // postShowList.length 只能获取到通过查询修改的列表长度，对于使用table filter功能进行的过滤，只能在table onChange中感知到，因此需要单独设置变量记录
  const onFinish = useMemoizedFn((values: FormSubmit) => {
    const newList = list
      .filter((item) => {
        if (!values.isRegularDegreeAndNoExp) {
          return true;
        } else {
          return (
            item.education.includes('本科') &&
            item.grassrootsWorkMinExperience.includes('无限制') &&
            item.grassrootsWorkProjectExperience.includes('无限制')
          );
        }
      })
      .filter((item) => {
        if (!values.isNotPartyMember) {
          return true;
        } else {
          return item.politicalStatus.includes('不限');
        }
      })
      .filter((item) => {
        if (!values.workPosition) {
          return true;
        } else {
          return item.workPosition.includes(values.workPosition);
        }
      })
      .filter((item) => {
        if (!values.postCode) {
          return true;
        } else {
          return String(item.postCode).includes(values.postCode);
        }
      })
      .filter((item) => {
        if (!values.departmentCode) {
          return true;
        } else {
          return String(item.departmentCode).includes(values.departmentCode);
        }
      })
      .filter((item) => {
        if (!values.majorType) {
          return true;
        } else if (!values.majorType.includes('+')) {
          return item.majorType.includes(values.majorType);
        } else {
          return values.majorType
            .split('+')
            .some((el) => item.majorType.includes(el));
        }
      });
    setPostShowList(newList);
    setPostShowListLength(newList.length);
  });

  useMount(() => {
    const list = readJSON<GuoKaoRecruitmentItem[]>(() =>
      require(`@/files/post-guokao-${routerParams.year}.json`),
    );
    setList(list);
    setPostShowList(list);
    setPostShowListLength(list.length);
  });

  return (
    <div className="shengkao-city-post-select">
      <div className="form">
        <TableForm
          onFinish={onFinish}
          suffix={
            <span className="post-count">
              共查询到
              <span className="post-count-num">{postShowListLength}</span>
              个岗位
            </span>
          }
        />
      </div>
      <div style={{ padding: '0 16px 16px' }}>
        <Alert
          message="筛选查询功能可能出现遗漏岗位，结果仅供参考"
          type="warning"
          showIcon
        />
      </div>
      <Table
        className="table"
        dataSource={postShowList}
        columns={columns}
        scroll={{ x: 800 }}
        bordered
        size={'small'}
        pagination={{
          position: ['topRight'],
        }}
        onChange={(pagination, filters, sorter, extra) => {
          setPostShowListLength(extra.currentDataSource.length);
        }}
      />
    </div>
  );
};

export default Index;
