// 对xls或者pdf文件格式进行转换
import { useMount } from 'ahooks';
import xlsx from 'xlsx';

const Test: React.FC = () => {
  // 获取省考岗位数据
  const getJSONFromXlsx = async () => {
    // 注意，这里的相对路径是相对于/public目录
    const f = await fetch('./post.xls');
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
    // const parseData = data.slice(1).map((item: any) => {
    //   return {
    //     id: String(item.__EMPTY_3),
    //     name: item.__EMPTY_2,
    //     rank: item.__EMPTY_6,
    //     post: item.__EMPTY,
    //     postId: String(item.__EMPTY_1),
    //     score: item.__EMPTY_4,
    //   };
    // });
    // console.log(JSON.stringify(parseData));
  };
  useMount(() => {
    getJSONFromXlsx();
  });
  return <div></div>;
};

export default Test;
