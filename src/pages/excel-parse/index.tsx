import { Upload, Button, Table, TableProps } from 'antd';
import xlsx from 'xlsx';
import { parsePDF2JSON, gongkaoluoyangFormat } from '@/utils/convert';
import { useCreation, useSafeState } from 'ahooks';

const getShengkaoPostJSONFromXlsx = async (
  filepath = './shengkao-2025.xls',
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
    工作经历: 'workExperience',
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
  filepath = './luoyang-shengkao-2025.pdf',
) => {
  const f = await fetch(filepath);
  const ab = await f.blob();
  parsePDF2JSON(ab, (res) => {
    gongkaoluoyangFormat(res);
  });
};

// 获取国考岗位数据
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

// 将上传的RCFile类型文件转为ArrayBuffer格式
const typeFile2ArrayBuffer = (file: File) => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.addEventListener('loadend', (e) => {
      if (e.target?.result) {
        resolve(e.target.result);
      }
    });
    fr.addEventListener('error', (e) => {
      reject(e);
    });
  });
};

const parseWorkBook2Array = (sheet: xlsx.WorkBook) => {
  sheet.SheetNames.map((name) => {
    const currentSheet = sheet.Sheets[name];
    const currentSheetRange = currentSheet['!ref']; // 这里的格式为A1:C4，表示数据涉及的范围，要注意在Z之后的列为AA，以此类推
    return {
      sheetName: name,
      sheetList: sheet.Sheets[name],
    };
  });
};

const ExcelParse: React.FC = () => {
  const [list, setList] = useSafeState<any[]>([]);
  // const [columns, setColumns] = useSafeState<TableProps<'columns'>[]>([]);
  const columns = useCreation(() => {
    if (list.length) {
      return [];
    } else {
      return [];
    }
  }, [list]);

  return (
    <div>
      <Upload
        onChange={async (e) => {
          console.log(e);
          if (e.file.originFileObj) {
            const ab = await typeFile2ArrayBuffer(e.file.originFileObj);
            const wb = xlsx.read(ab);
            // const list = parseWorkBook2Array(wb);
            // setList(list);
            console.log(list, wb);
          }
        }}
      >
        <Button>点击上传</Button>
      </Upload>
      <Table dataSource={list} columns={columns} pagination={{}} />
    </div>
  );
};

export default ExcelParse;
