import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.1.392/pdf.worker.mjs';

export const parsePDF2JSON = (
  file: Blob,
  fn: (doc: PDFDocumentProxy) => void,
) => {
  const reader = new FileReader();

  reader.readAsArrayBuffer(file);
  reader.addEventListener('loadend', (e) => {
    const loadingTask = pdfjsLib.getDocument(e.target?.result as ArrayBuffer);
    loadingTask.promise.then(async (doc) => {
      fn(doc);
    });
  });
};

const isTransform4BetweenPosition = (transform4: number) => {
  return transform4 > 90 && transform4 < 270;
};

const name2Key: Record<string, string> = {
  公安: 'gongan',
  准考证号: 'id',
  名次: 'rank',
  姓名: 'name',
  序号: 'no',
  总成绩: 'score',
  报考单位: 'post',
  申论: 'shenlun',
  职位代码: 'postId',
  行测: 'xingce',
};

// 河南省考成绩pdf格式化方法
export const gongkaoluoyangFormat = async (doc: PDFDocumentProxy) => {
  let titles: string[] = [];
  let pdfTexts: any[] = [];
  for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();
    let isMergePrev = false;
    const oriData: any[] = content.items
      .filter((el: any) => el.str !== '' && el.str !== ' ')
      .reduce((prev: any[], curr: any) => {
        if (isTransform4BetweenPosition(curr.transform[4])) {
          if (
            isMergePrev &&
            isTransform4BetweenPosition(prev[prev.length - 1].transform[4])
          ) {
            const last = prev.splice(-1)[0];
            curr.str = last.str + curr.str;
            return [...prev, curr];
          } else {
            isMergePrev = true;
          }
        }
        return [...prev, curr];
      }, [])
      .map((el) => el.str);

    let data = null;

    // 如果第一页
    if (pageNum === 1) {
      // 删除前1个字符，后3个字符
      data = oriData.slice(11).slice(0, -3);
      // 取第5-15个内容作为json字段
      titles = oriData.slice(1, 11);
    } else {
      // 如果不是第一页
      // 需要将前n（1、2、3...）个字符合并（是序号，只有每页第一行会分成多个字符）
      let numberIndex = 0;
      for (let oi = 1; oi < oriData.length - 1; oi++) {
        if (/[0-9]+/.test(oriData[oi])) {
          numberIndex = oi;
        } else {
          break;
        }
      }
      data = oriData.slice(numberIndex).slice(0, -3);
    }

    pdfTexts = [...pdfTexts, ...data];
  }
  const formatData: any = [];
  for (let index = 0; index < pdfTexts.length; index += 10) {
    const data: any[] = pdfTexts.slice(index, index + 10);
    formatData.push(
      data.reduce((prev, curr, currIndex) => {
        const obj = {
          ...prev,
          [name2Key[titles[currIndex] as any]]: curr,
        };

        obj.score = Number(obj.score);
        obj.xingce = Number(obj.xingce);
        obj.shenlun = Number(obj.shenlun);
        obj.gongan = Number(obj.gongan);
        return obj;
      }, {}),
    );
  }
  console.log('formatData', JSON.stringify(formatData));
};
