// 对xls或者pdf文件格式进行转换
import { useMount } from 'ahooks';
import xlsx from 'xlsx';

const Test: React.FC = () => {
  const getJSONFromXlsx = async () => {
    const f = await fetch('./list.xls');
    const ab = await f.arrayBuffer();
    const wb = xlsx.read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(ws);
    const parseData = data.slice(1).map((item: any) => {
      return {
        id: String(item.__EMPTY_3),
        name: item.__EMPTY_2,
        rank: item.__EMPTY_6,
        post: item.__EMPTY,
        postId: String(item.__EMPTY_1),
        score: item.__EMPTY_4,
      };
    });
    console.log(JSON.stringify(parseData));
  };
  useMount(() => {
    getJSONFromXlsx();
  });
  return <div></div>;
};

export default Test;
