import { useMount, useMemoizedFn, useSafeState } from 'ahooks';
import { Table, Form, Input, Button, message, Checkbox } from 'antd';
import { useParams } from 'react-router-dom';
import { TableProps } from 'antd/lib/table';
import { CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SubjectPicker from '@/components/major-picker';
import {
  PostRecruitmentItemKeyMapper,
  PostRecruitmentItem,
  ScoreItem,
} from '@/interface';
import { readJSON } from '@/utils';
import './index.scss';

interface FormSubmit {
  recruitmentInstitution: string;
  majorType: string;
  postId: string;
  mustHavePastScore: boolean;
}

interface PostScoreRecruitmentItem extends PostRecruitmentItem {
  score?: {
    score: string;
    year: string | 'ave';
  }[];
}

const CopyComponent: React.FC<{ value: string }> = ({ value }) => {
  const onCopySuccess = useMemoizedFn(() => {
    message.success('复制成功');
  });
  return (
    <CopyToClipboard text={value} onCopy={onCopySuccess}>
      <div className="copy-wrapper">
        {value}
        <CopyOutlined className="copy-icon" />
      </div>
    </CopyToClipboard>
  );
};

const columns: TableProps['columns'] = [
  {
    title: PostRecruitmentItemKeyMapper.recruitmentInstitution,
    width: 200,
    dataIndex: 'recruitmentInstitution',
    fixed: 'left',
    render: (value) => <CopyComponent value={value} />,
  },
  {
    title: '历年进面成绩',
    width: 200,
    dataIndex: 'score',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.score?.[0]?.score - b.score?.[0]?.score,
    render: (value) => (
      <div>
        {value.length === 0 ? '暂无数据' : `过去三年平均分：${value[0].score}`}
      </div>
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
    render: (value) => <CopyComponent value={value} />,
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
    title: PostRecruitmentItemKeyMapper.workExperience,
    width: 100,
    dataIndex: 'workExperience',
    filters: [
      {
        text: '两年以上基层工作经历',
        value: '两年以上基层工作经历',
      },
    ],
    onFilter: (value, record) => record.workExperience === value,
  },
  {
    title: PostRecruitmentItemKeyMapper.otherRequirement,
    width: 100,
    dataIndex: 'otherRequirement',
    align: 'center',
  },
  // {
  //   title: PostRecruitmentItemKeyMapper.physicalExaminationStandard,
  //   width: 100,
  //   dataIndex: 'physicalExaminationStandard',
  //   align: 'center',
  // },
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
  const [form] = Form.useForm();
  return (
    <Form
      onFinish={onFinish}
      initialValues={{
        recruitmentInstitution: '',
        majorType: '',
        postId: '',
        mustHavePastScore: false,
      }}
      layout="inline"
      form={form}
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
      <Form.Item name="mustHavePastScore" valuePropName="checked">
        <Checkbox>只显示存在历年进面成绩岗位</Checkbox>
      </Form.Item>
      <Form.Item>
        <Button.Group>
          <Button htmlType="submit">查询</Button>
          <Button
            htmlType="reset"
            onClick={() =>
              onFinish({
                recruitmentInstitution: '',
                majorType: '',
                postId: '',
                mustHavePastScore: false,
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
  const [list, setList] = useSafeState<PostScoreRecruitmentItem[]>([]);
  const routerParams = useParams();
  const [postShowList, setPostShowList] = useSafeState<
    PostScoreRecruitmentItem[]
  >([]);
  const [postShowListLength, setPostShowListLength] = useSafeState(0); // postShowList.length 只能获取到通过查询修改的列表长度，对于使用table filter功能进行的过滤，只能在table onChange中感知到，因此需要单独设置变量记录
  const onFinish = useMemoizedFn((values: FormSubmit) => {
    console.log(values);
    const newList = list
      .filter((item) => {
        if (values.mustHavePastScore) {
          if (!item.score) return false;
          return item.score.length > 0;
        }

        return true;
      })
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
        if (!values.postId) {
          return true;
        } else {
          return String(item.postId).includes(values.postId);
        }
      })
      .filter((item) => {
        if (!values.majorType) {
          return true;
        } else {
          return item.majorType.includes(values.majorType);
        }
      });

    setPostShowList(newList);
    setPostShowListLength(newList.length);
  });

  useMount(() => {
    const list = readJSON<PostScoreRecruitmentItem[]>(() =>
      require(`@/files/post-shengkao-${routerParams.province}-${routerParams.year}.json`),
    );
    const listWithScore = postAddScore(list);
    setList(listWithScore);
    setPostShowList(listWithScore);
    setPostShowListLength(listWithScore.length);
  });

  const postAddScore = useMemoizedFn((list: PostScoreRecruitmentItem[]) => {
    const testScore1 = readJSON<ScoreItem[]>(() =>
      require(`@/files/score-shengkao-luoyang-${Number(
        routerParams.year,
      )}.json`),
    );
    const testScore2 = readJSON<ScoreItem[]>(() =>
      require(`@/files/score-shengkao-luoyang-${
        Number(routerParams.year) - 1
      }.json`),
    );
    const testScore3 = readJSON<ScoreItem[]>(() =>
      require(`@/files/score-shengkao-luoyang-${
        Number(routerParams.year) - 2
      }.json`),
    );
    return list.map((item) => {
      item.score = [];
      const score = {
        score: 0,
        num: 0,
      };
      const scoreItem1 = testScore1.find((i) =>
        i.post.includes(item.recruitmentInstitution),
      );
      if (!!scoreItem1) {
        // item.score.push({
        //   score: scoreItem1.score,
        //   year: 2024,
        // });
        score.score += scoreItem1.score;
        score.num++;
      }
      const scoreItem2 = testScore2.find((i) =>
        i.post.includes(item.recruitmentInstitution),
      );
      if (!!scoreItem2) {
        // item.score.push({
        //   score: scoreItem2.score,
        //   year: 2023,
        // });
        score.score += scoreItem2.score;
        score.num++;
      }
      const scoreItem3 = testScore3.find((i) =>
        i.post.includes(item.recruitmentInstitution),
      );
      if (!!scoreItem3) {
        // item.score.push({
        //   score: scoreItem3.score,
        //   year: 2022,
        // });
        score.score += scoreItem3.score;
        score.num++;
      }

      if (score.score > 0) {
        item.score.push({
          score: (score.score / score.num).toFixed(2),
          year: 'ave',
        });
      }

      return item;
    });
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
      <Table
        className="table"
        dataSource={postShowList}
        columns={columns}
        scroll={{ x: 800, y: 600 }}
        bordered
        size={'middle'}
        onChange={(pagination, filters, sorter, extra) => {
          setPostShowListLength(extra.currentDataSource.length);
        }}
      />
    </div>
  );
};

export default Index;
