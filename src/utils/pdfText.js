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

// 各項目に対応するラベルのバリエーション（実務の見積書でよく使われる表記）
const LABEL_MAP = {
  お客様名: ['お客様名', 'お客様', '顧客名', '顧客', '得意先名', '得意先', '宛名', '会社名', '契約者'],
  車種: ['車種', '車種名', '車名', '車両名', '型式', 'メーカー', '品番'],
  ナンバー: ['ナンバー', 'ナンバープレート', '登録番号', '車両番号', 'No.', 'No．', '№', '番号'],
  カラーNo: ['カラー№', 'カラーNo', 'カラーNo.', 'カラー', '色', '塗装色', 'カラー番号'],
  担当者: ['担当者', '担当', '営業担当', '担当者名', '係', '窓口']
};

const ALL_LABELS = [...new Set(Object.values(LABEL_MAP).flat())].sort((a, b) => b.length - a.length);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 指定レイアウトに沿った抽出（優先）
 * - お客様名: 「様」の左1列分
 * - 車種: 「車 種」(空欄あり可) の右15文字程度
 * - ナンバー: 「登録番号」の右10文字程度
 * - カラーNo: 「カラーNo」の右8文字程度
 * - 担当者: 「受付担当」の右8文字程度
 */
function extractByLayout(text) {
  const result = { お客様名: '', 車種: '', ナンバー: '', カラーNo: '', 担当者: '' };
  if (!text || typeof text !== 'string') return result;
  const n = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\s+/g, ' ');

  const idxSama = n.indexOf('様');
  if (idxSama !== -1) {
    const before = n.slice(0, idxSama).trim();
    const segments = before.split(/\s+/);
    const oneColumn = segments.length > 0 ? segments[segments.length - 1] : before.slice(-50).trim();
    if (oneColumn.length > 0 && oneColumn.length < 80) result.お客様名 = oneColumn;
  }

  const mCar = n.match(/車\s*種\s*(.{1,15})/);
  if (mCar && mCar[1]) result.車種 = mCar[1].trim().replace(/\s+/g, ' ').slice(0, 15);

  const mNum = n.match(/登録番号\s*(.{1,10})/);
  if (mNum && mNum[1]) result.ナンバー = mNum[1].trim().replace(/\s+/g, ' ').slice(0, 10);

  const mColor = n.match(/カラーNo\s*(.{1,8})/);
  if (mColor && mColor[1]) result.カラーNo = mColor[1].trim().replace(/\s+/g, ' ').slice(0, 8);

  const mTanto = n.match(/受付担当\s*(.{1,8})/);
  if (mTanto && mTanto[1]) result.担当者 = mTanto[1].trim().replace(/\s+/g, ' ').slice(0, 8);

  return result;
}

/**
 * テキストから見積メタ（お客様名・車種・ナンバー・カラー№・担当者）を抽出
 * まず指定レイアウトで試し、未取得分は従来ロジックで補う
 */
export function extractMetaFromText(text) {
  const result = extractByLayout(text);
  if (!text || typeof text !== 'string') return result;
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\s+/g, ' ');
  const lines = text.split(/\r\n|\r|\n/).map((l) => l.replace(/\s+/g, ' ').trim()).filter(Boolean);

  for (const [key, labels] of Object.entries(LABEL_MAP)) {
    if (result[key]) continue;
    for (const label of labels) {
      if (!normalized.includes(label)) continue;
      const pos = normalized.indexOf(label);
      const after = normalized.slice(pos + label.length).trim();
      const colonMatch = after.match(/^\s*[:：]\s*/);
      const valueStart = colonMatch ? colonMatch[0].length : 0;
      let value = after.slice(valueStart);
      const nextLabelPos = ALL_LABELS.filter((l) => l !== label).reduce((min, l) => {
        const i = normalized.indexOf(l, pos + label.length);
        return i === -1 ? min : (min === -1 ? i : Math.min(min, i));
      }, -1);
      if (nextLabelPos !== -1) {
        value = normalized.slice(pos + label.length, nextLabelPos).trim();
      } else {
        const endOfLine = value.indexOf('\n');
        value = endOfLine === -1 ? value : value.slice(0, endOfLine);
      }
      value = value.replace(/^\s*[:：]\s*/, '').replace(/\s+/g, ' ').trim().slice(0, 120);
      if (value.length > 0) {
        result[key] = value;
        break;
      }
    }
  }

  // 行単位で「ラベル」の次行を値とみなす（表形式）
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    if (!nextLine) continue;
    for (const [key, labels] of Object.entries(LABEL_MAP)) {
      if (result[key]) continue;
      const found = labels.some((label) => {
        const re = new RegExp(`^${escapeRegex(label)}\\s*[:：]?\\s*$`);
        return re.test(line) || line === label || line.endsWith(label);
      });
      if (found && nextLine && nextLine.length < 150 && !ALL_LABELS.some((l) => nextLine.includes(l))) {
        result[key] = nextLine.slice(0, 100);
        break;
      }
    }
  }

  // 同一行内「ラベル: 値」「ラベル 値」
  for (const [key, labels] of Object.entries(LABEL_MAP)) {
    if (result[key]) continue;
    for (const label of labels) {
      const re = new RegExp(`${escapeRegex(label)}\\s*[:：]?\\s*([^\\n]{1,100})`, '');
      const m = normalized.match(re);
      if (m && m[1]) {
        const v = m[1].trim().replace(/\s+/g, ' ').slice(0, 100);
        if (v) result[key] = v;
        break;
      }
    }
  }

  return result;
}
