// 对xls或者pdf文件格式进行转换
import { Input } from 'antd';
import { useMount } from 'ahooks';
import { ScoreItem } from '@/interface'; // 进面名单文件需要转换成的json格式类型
import xlsx from 'xlsx';

const Test: React.FC = () => {
  // 获取省考岗位数据
  const getPostJSONFromXlsx = async (filepath = './post.xls') => {
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
      console.log(titles);
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
    getScoreJSONFromXlsx();
  });
  return (
    <div>
      <Input
        type="file"
        placeholder="这里上传省考进面名单信息"
        onChange={(e) => {
          console.log(e);
        }}
      />
    </div>
  );
};

export default Test;
