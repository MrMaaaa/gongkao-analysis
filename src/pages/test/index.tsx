// 对xls或者pdf文件格式进行转换
import { Input } from 'antd';
import { useMount, useSafeState } from 'ahooks';
import { useRef, useState, useMemo, useCallback } from 'react';
import { ScoreItem } from '@/interface'; // 进面名单文件需要转换成的json格式类型
import xlsx from 'xlsx';
import './index.scss';

const Test: React.FC = () => {
  // 获取省考岗位数据
  const getPostJSONFromXlsx = async (filepath = './guokao-2025.xls') => {
    // 注意，这里的相对路径是相对于/public目录
    const f = await fetch(filepath);
    const ab = await f.arrayBuffer();
    const wb = xlsx.read(ab);
    let titles: Record<string, string | number> = {};
    const name2key: Record<string, string> = {
      '专业（学科）类别': 'majorType',
      体检标准: 'physicalExaminationStandard',
      其他要求: 'otherRequirement',
      学位要求: 'degreeRequirement',
      学历要求: 'educationRequirement',
      工作经历: 'workExperience',
      年龄要求: 'ageRequirement',
      招录人数: 'recruitmentNumber',
      招录单位: 'recruitmentInstitution',
      是否进行体能测评: 'isPhysicalFitnessTest',
      职位代码: 'postId',
      职位名称: 'postName',
      备注: 'remark',
    };
    const data = wb.SheetNames.map((name) => {
      const ws: Record<string, string | number>[] = xlsx.utils.sheet_to_json(
        wb.Sheets[name],
      );
      titles = ws[1];
      return ws.slice(2).map((item) => {
        return Object.entries(item)
          .map(([key, value]) => {
            return {
              [name2key[titles[key]]]: value,
            };
          })
          .reduce((p, c) => ({ ...p, ...c }), {});
      });
    }).reduce((p, c) => [...p, ...c], []);
    console.log(JSON.stringify(data));
  };

  // 获取省考岗位数据
  const getGuokaoPostJSONFromXlsx = async (filepath = './guokao-2025.xls') => {
    // 注意，这里的相对路径是相对于/public目录
    const f = await fetch(filepath);
    const ab = await f.arrayBuffer();
    const wb = xlsx.read(ab);
    let titles: Record<string, string | number> = {};
    const name2key: Record<string, string> = {
      部门代码: 'departmentCode',
      部门名称: 'departmentName',
      用人司局: 'bureauName',
      机构性质: 'institutionNature',
      招考职位: 'postName',
      职位属性: 'postType',
      职位分布: 'postDistribution',
      职位简介: 'postIntro',
      职位代码: 'postCode',
      机构层级: 'institutionLevel',
      考试类别: 'examType',
      招考人数: 'recruitmentNumber',
      专业: 'majorType',
      学历: 'education',
      学位: 'degree',
      政治面貌: 'politicalStatus',
      基层工作最低年限: 'grassrootsWorkMinExperience',
      服务基层项目工作经历: 'grassrootsWorkProjectExperience',
      是否在面试阶段组织专业能力测试: 'isProfessionalAbilityTestAtInterview',
      面试人员比例: 'ratioOfInterviewees',
      工作地点: 'workPosition',
      落户地点: 'residencePosition',
      备注: 'remark',
      部门网站: 'departmentWebsite',
      咨询电话1: 'contactWay1',
      咨询电话2: 'contactWay2',
      咨询电话3: 'contactWay3',
    };
    const data = wb.SheetNames.map((name) => {
      const ws: Record<string, string | number>[] = xlsx.utils.sheet_to_json(
        wb.Sheets[name],
      );
      titles = ws[0];
      return ws.slice(2).map((item) => {
        return Object.entries(item)
          .map(([key, value]) => {
            return {
              [name2key[titles[key]]]: value || '',
            };
          })
          .reduce((p, c) => ({ ...p, ...c }), {});
      });
    }).reduce((p, c) => [...p, ...c], []);
    console.log(JSON.stringify(data));
  };

  const getScoreJSONFromXlsx = async (
    filepath = './shengkao-zhengzhou-2024-score.xlsx',
  ) => {
    // 注意，这里的相对路径是相对于/public目录
    const f = await fetch(filepath);
    const ab = await f.arrayBuffer();
    const wb = xlsx.read(ab);
    const olist = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    const list = olist.slice(2);
    const result = list.map((item: any) => {
      return {
        id: item.__EMPTY_2,
        rank: item.__EMPTY_8,
        name: item.__EMPTY_3,
        post: item.__EMPTY,
        postId: item.__EMPTY_1,
        score: Number(item.__EMPTY_7),
        xingce: Number(item.__EMPTY_4),
        shenlun: Number(item.__EMPTY_5),
        gongan: item.__EMPTY_6 === '-' ? '' : Number(item.__EMPTY_6),
      };
    });
    console.log(JSON.stringify(result));
  };
  useMount(() => {
    // getScoreJSONFromXlsx();
    // getGuokaoPostJSONFromXlsx();
  });
  const [milestone] = useSafeState([
    {
      stage: '一审',
      filingDate: '2008-08-28',
    },
    {
      nodeName: '一审立案',
      initDate: '2008-08-28',
      taskStatus: 1,
      taskType: 1,
    },
    {
      nodeName: '一审立案',
      initDate: '2008-08-28',
      taskStatus: 0,
      taskType: 1,
    },
    {
      nodeName: '一审立案',
      initDate: '2008-08-28',
      taskStatus: 1,
      taskType: 2,
    },
    {
      nodeName: '一审立案',
      initDate: '2008-08-28',
      taskStatus: 0,
      taskType: 2,
    },
  ]);
  const milestoneRef = useRef<any>(null);
  const scrollTo = useCallback((direct: 'left' | 'right') => {
    const scrollLeft = milestoneRef?.current?.scrollLeft;
    const scrollDistance = 200;
    if (direct === 'left') {
      milestoneRef.current.scrollLeft = scrollLeft - scrollDistance;
    } else {
      milestoneRef.current.scrollLeft = scrollLeft + scrollDistance;
    }
  }, []);
  const [percent, setPercent] = useState('5');
  const percentColor = useMemo(() => {
    const percentNumber = Number(percent);
    if (isNaN(percentNumber)) {
      return '';
    } else if (percentNumber < 60) {
      return '#bd3124';
    } else if (percentNumber < 100) {
      return '#e29836';
    } else {
      return '#81b337';
    }
  }, [percent]);

  return (
    <div>
      <Input
        type="file"
        placeholder="这里上传省考进面名单信息"
        onChange={(e) => {
          console.log(e);
        }}
      />
      <div className="match-percent">
        <div
          className="match-percent-line"
          style={{ width: percent + '%', backgroundColor: percentColor }}
        >
          <span
            className={
              percentColor === '#bd3124'
                ? 'match-percent-text match-percent-text-fixed'
                : 'match-percent-text'
            }
            style={{ color: Number(percent) < 40 ? '#bd3124' : '#fff' }}
          >
            {percent}%
          </span>
        </div>
      </div>
      <div className="milestone">
        <div
          className="scroll-icon"
          onClick={() => {
            scrollTo('left');
          }}
        >
          <div className="scroll-icon-left"></div>
        </div>

        <div className="milestone-container" ref={milestoneRef}>
          {milestone.map((item, index) => {
            return (
              <div className="milestone-item" key={index}>
                <div className="milestone-circle">
                  <div
                    className={`${
                      !!item.stage
                        ? 'milestone-circle-stage'
                        : `milestone-circle-task-${item.taskType}-${
                            item.taskStatus === 0 ? 'unfinish' : 'finished'
                          }`
                    }`}
                  ></div>
                </div>
                <div
                  className={`milestone-status ${
                    !!item.stage ? 'milestone-status-bolder' : ''
                  }`}
                >
                  {item.stage || item.nodeName || '-'}
                </div>
                <div className="milestone-date">
                  {item.filingDate || item.initDate || '-'}
                </div>
              </div>
            );
          })}
        </div>
        <div
          className="scroll-icon"
          onClick={() => {
            scrollTo('right');
          }}
        >
          <div className="scroll-icon-right"></div>
        </div>
      </div>
    </div>
  );
};

export default Test;
