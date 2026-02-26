/**
 * PDF から全ページのテキストを抽出する
 * @param {File} file - PDF ファイル
 * @returns {Promise<string>} 結合されたテキスト
 */
export async function extractTextFromPdf(file) {
  const pdfjsLib = await import('pdfjs-dist');
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5/build/pdf.worker.min.mjs';
  }
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  const parts = [];
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(' ');
    parts.push(text);
  }
  return parts.join('\n');
}

const LABELS = [
  ['お客様名', 'お客様名'],
  ['車種', '車種'],
  ['ナンバー', 'ナンバー'],
  ['カラー№', 'カラーNo'],
  ['カラーNo', 'カラーNo'],
  ['担当者', '担当者']
];

/**
 * テキストから見積メタ（お客様名・車種・ナンバー・カラー№・担当者）を抽出
 * @param {string} text
 * @returns {{ お客様名: string, 車種: string, ナンバー: string, カラーNo: string, 担当者: string }}
 */
export function extractMetaFromText(text) {
  const result = { お客様名: '', 車種: '', ナンバー: '', カラーNo: '', 担当者: '' };
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (const [label, key] of LABELS) {
    if (!(key in result)) continue;
    const patterns = [
      new RegExp(`${escapeRegex(label)}\\s*[:：]?\\s*([^\n]+)`, 'i'),
      new RegExp(`${escapeRegex(label)}\\s*[:：]?\\s*([^\n]+)`, '')
    ];
    for (const re of patterns) {
      const m = normalized.match(re);
      if (m && m[1]) {
        const value = m[1].trim().replace(/\s+/g, ' ').slice(0, 100);
        if (value) result[key] = value;
        break;
      }
    }
  }
  return result;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
