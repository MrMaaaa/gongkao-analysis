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

// 河南省考成绩pdf格式化方法
export const gongkaoluoyangFormat = async (doc: PDFDocumentProxy) => {
  let titles: string[] = [];
  let pdfTexts: any[] = [];
  for (let idx = 1; idx <= doc.numPages; idx++) {
    const page = await doc.getPage(idx);
    const content = await page.getTextContent();
    const oriData = content.items
      .map((el: any) => el.str)
      .reduce((prev, curr) => {
        if (curr === ' ' || curr === '') {
          return prev;
        }
        if (
          curr === '（' ||
          curr === '参公' ||
          curr === '）' ||
          curr === '）（' ||
          curr === '洛阳市人民政府发展研究中心'
        ) {
          const last = prev.splice(-1);
          return [...prev, last + curr];
        }
        return [...prev, curr];
      });

    if (idx === 1) {
      const data = oriData.slice(15).slice(0, -7);
      titles = oriData.slice(5, 15);
      pdfTexts = [...pdfTexts, ...data];
    } else {
      const data = oriData.slice(11).slice(0, -7);
      pdfTexts = [...pdfTexts, ...data];
    }
  }
  const formatData: any = [];
  for (let index = 0; index < pdfTexts.length; index += 10) {
    const data: any[] = pdfTexts.slice(index, index + 10);
    formatData.push(
      data.reduce((prev, curr, currIndex) => {
        const obj = {
          ...prev,
          [titles[currIndex]]: curr,
        };

        obj.score = Number(obj.score);
        obj.xingce = Number(obj.xingce);
        obj.shenlun = Number(obj.shenlun);
        obj.gongan = Number(obj.gongan);
        return obj;
      }, {}),
    );
  }
};
