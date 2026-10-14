// 对xls或者pdf文件格式进行转换
import { Input, Button, Popover } from 'antd';
import { useMount, useSafeState } from 'ahooks';
import { useRef, useState, useMemo, useCallback, useEffect } from 'react';
import { ScoreItem } from '@/interface'; // 进面名单文件需要转换成的json格式类型
import xlsx from 'xlsx';
import TextOverflow from '@/components/text-overflow';
import { parsePDF2JSON, gongkaoluoyangFormat } from '@/utils/convert';
import { readJSON } from '@/utils';
import './index.scss';

const Test: React.FC = () => {
  // filepath 目录在/public下
  // 获取省考岗位数据
  const getShengkaoPostJSONFromXlsx = async (
    filepath = './2027.xls',
  ) => {
    // 注意，这里的相对路径是相对于/public目录
    const f = await fetch(filepath);
    const ab = await f.arrayBuffer();
    const wb = xlsx.read(ab);
    let titles: Record<string, string | number> = {};
    const name2key: Record<string, string> = {
      专业: 'majorType',
      体检标准: 'physicalExaminationStandard',
      其他要求: 'otherRequirement',
      学位要求: 'degreeRequirement',
      学历要求: 'educationRequirement',
      工作经历要求: 'workExperience',
      年龄要求: 'ageRequirement',
      招录人数: 'recruitmentNumber',
      '招录机关（单位）': 'recruitmentInstitution',
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

  const getShengkaoScoreFromPdf = async (
    filepath = './luoyang-shengkao-2026.pdf',
  ) => {
    const f = await fetch(filepath);
    const ab = await f.blob();
    const list = readJSON<any[]>(() =>
      require(`@/files/post-shengkao-henan-2026.json`),
    );
    parsePDF2JSON(ab, (res) => {
      gongkaoluoyangFormat(res, 3, list);
    });
  };

  // 获取国考岗位数据
  const getGuokaoPostJSONFromXlsx = async (filepath = './2027.xls') => {
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
    // getShengkaoPostJSONFromXlsx();
    // getGuokaoPostJSONFromXlsx();
    // getShengkaoScoreFromPdf();
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
  const milestoneRef = useRef<HTMLDivElement>(null);
  const scrollTo = useCallback((direct: 'left' | 'right') => {
    if (!!milestoneRef.current) {
      const scrollLeft = milestoneRef.current.scrollLeft;
      const scrollDistance = 200;
      if (direct === 'left') {
        milestoneRef.current.scrollLeft = scrollLeft - scrollDistance;
      } else {
        milestoneRef.current.scrollLeft = scrollLeft + scrollDistance;
      }
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

  const onResize = useCallback(() => {
    if (milestoneRef.current) {
      const width = milestoneRef.current.clientWidth;
      const scrollWidth = milestoneRef.current.scrollWidth;
      if (width >= scrollWidth) {
        milestoneRef.current.classList.add('hide-arrow');
      } else {
        milestoneRef.current.classList.remove('hide-arrow');
      }
    }
  }, [milestoneRef]);

  const popoverTextRef = useRef<HTMLElement>(null);
  const [isPopoverTextOver, setIsPopoverTextOver] = useSafeState(false);

  const downloadJSON = useCallback((json = '{}', filename = 'jsonfile') => {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.textContent = 'download';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, []);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize, false);
    return () => {
      window.removeEventListener('resize', onResize, false);
    };
  }, [onResize]);

  useEffect(() => {
    if (popoverTextRef.current) {
      setIsPopoverTextOver(
        Math.round(popoverTextRef.current.scrollWidth) >
          Math.round(popoverTextRef.current?.getBoundingClientRect().width),
      );
      console.log(
        'popoverTextRef.current',
        popoverTextRef.current.scrollWidth,
        popoverTextRef.current?.getBoundingClientRect().width,
        getComputedStyle(popoverTextRef.current).getPropertyValue(
          'line-height',
        ),
      );
    }
  }, [popoverTextRef.current]);

  const [toggleHiddenStyle, setToggleHiddenStyle] = useState(true);

  return (
    <div>
      <Input
        type="file"
        placeholder="这里上传省考进面名单信息"
        onChange={(e) => {
          const fd = new FormData();
          fd.append('file', e.target.files?.[0]!);
          const req = new XMLHttpRequest();
          req.open(
            'post',
            'http://39.170.31.244:8108/biz/modularityUpload/project1723274963761854/uploadLocalesToOss',
          );
          req.send(fd);
          req.onload = (res) => {
            console.log(res);
          };
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

      <div className="flex">
        <button
          className="tab-btn flex"
          data-tab-id="judicial"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-lucide="scale"
            aria-hidden="true"
            className="lucide lucide-scale w-4 h-4 text-red-600"
          >
            <path d="M12 3v18"></path>
            <path d="m19 8 3 8a5 5 0 0 1-6 0zV7"></path>
            <path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"></path>
            <path d="m5 8 3 8a5 5 0 0 1-6 0zV7"></path>
            <path d="M7 21h10"></path>
          </svg>
          <span>司法风险</span>
          <span className="num">
            2
          </span>
        </button>

        <button
          className="tab-btn flex"
          data-widget-id="1778722256249"
          data-tab-id="regulatory"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-lucide="shield-alert"
            aria-hidden="true"
            className="lucide lucide-shield-alert w-4 h-4 text-slate-400"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
          <span>监管风险</span>
          <span className="num">
            1
          </span>
        </button>

        <button
          className="tab-btn flex active"
          data-widget-id="1778722256249"
          data-tab-id="operational"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            data-lucide="activity"
            aria-hidden="true"
            className="lucide lucide-activity w-4 h-4 text-slate-400"
          >
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
          </svg>
          <span>经营风险</span>
          <span className="num">
            1
          </span>
        </button>
      </div>

      <div className="corner-mark-wrapper">
        <div className="corner-mark">
          主审案号
          <div className="corner-mark-icon corner-mark-icon-icr">ICR</div>
          <div className="corner-mark-icon corner-mark-icon-fy">法研</div>
        </div>
      </div>

      <div className={'textOverflowWrapperIOS'}>
        <div
          className={'textOverflowIOS' + ' raw-text-content'}
          style={{
            WebkitLineClamp: !toggleHiddenStyle ? 999 : 2,
          }}
        >
          {navigator.userAgent +
            (navigator.userAgent.includes('iPhone') ||
            navigator.userAgent.includes('iPad')
              ? 'true'
              : 'false') +
            '有些事情一旦到了年纪，看透了人情冷暖世态炎凉，悟透了何为人性，世界仿佛也更露骨了起来。大家为什么找詹呢？因为香蕉船兄弟声名在外十多年有些事情一旦到了年纪，看透了人情冷暖世态炎凉，悟透了何为人性，世界仿佛也更露骨了起来。大家为什么找詹呢？因为香蕉船兄弟声名在外十多年有些事情一旦到了年纪，看透了人情冷暖世态炎凉，悟透了何为人性，世界仿佛也更露骨了起来。大家为什么找詹呢？因为香蕉船兄弟声名在外十多年有些事情一旦到了年纪，看透了人情冷暖世态炎凉，悟透了何为人性，世界仿佛也更露骨了起来。大家为什么找詹呢？因为香蕉船兄弟声名在外十多年'}
        </div>
        {
          <Button
            className={'toggleHiddenBtnIOS'}
            onClick={() => {
              setToggleHiddenStyle((v) => !v);
            }}
            type="link"
          >
            {toggleHiddenStyle ? '展开' : '收起'}
          </Button>
        }
      </div>

      <div className="tag-container">
        <div className="tag-row" id="tagRow">
          <span className="tag-row-item">超甲级/甲级写字楼</span>
          <span className="tag-row-item">光伏储能</span>
          <span className="tag-row-item">整栋公寓</span>
        </div>
      </div>

      <span
        style={{
          display: 'block',
          width: '300px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          marginTop: 50,
        }}
        ref={popoverTextRef}
        title={
          isPopoverTextOver
            ? '这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字'
            : undefined
        }
      >
        这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字这是一段说明文字
      </span>
    </div>
  );
};

export default Test;
