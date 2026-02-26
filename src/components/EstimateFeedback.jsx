import React, { useState, useCallback, useMemo } from 'react';
import { MessageSquareWarning, FileUp, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { extractTextFromPdf } from '../utils/pdfText';
import { partsData, commonItems } from '../checker_data';

const PART_NAMES = Object.keys(partsData);
const COMMON_ITEM_NAMES = (commonItems.items || []).map((i) => i.name);

/**
 * PDF テキストから見積内容を解析し、漏れチェック用の指摘リストを生成
 */
function buildFeedback(text) {
  const items = [];
  const normalized = text.replace(/\s+/g, ' ');
  const lower = normalized.toLowerCase();

  for (const partName of PART_NAMES) {
    if (!normalized.includes(partName)) continue;
    const part = partsData[partName];
    const keyItems = (part.items || []).filter((i) => i.isKeyPoint);
    for (const item of keyItems) {
      const mentioned = normalized.includes(item.name) || (item.hint && normalized.includes(item.hint));
      items.push({
        type: mentioned ? 'confirm' : 'suggest',
        part: partName,
        item: item.name,
        hint: item.hint || item.desc?.slice(0, 80),
        message: mentioned
          ? `「${item.name}」の記載がありました。内容・金額の確認を推奨します。`
          : `「${partName}」の見積の場合、漏れがないか確認を推奨: ${item.name}${item.hint ? `（${item.hint}）` : ''}`
      });
    }
  }

  for (const name of COMMON_ITEM_NAMES) {
    if (normalized.includes(name)) continue;
    const item = (commonItems.items || []).find((i) => i.name === name);
    if (!item?.isKeyPoint) continue;
    items.push({
      type: 'suggest',
      part: '共通',
      item: name,
      hint: item.hint || '',
      message: `共通項目の確認推奨: ${name}${item.hint ? `（${item.hint}）` : ''}`
    });
  }

  return items;
}

export default function EstimateFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError('PDF ファイルを選択してください');
      return;
    }
    setError('');
    setFeedback([]);
    setLoading(true);
    try {
      const text = await extractTextFromPdf(file);
      const list = buildFeedback(text);
      setFeedback(list);
      setFileName(file.name);
    } catch (err) {
      setError('PDF の読み取りに失敗しました。' + (err?.message || ''));
    } finally {
      setLoading(false);
    }
  }, []);

  const suggestList = useMemo(() => feedback.filter((f) => f.type === 'suggest'), [feedback]);
  const confirmList = useMemo(() => feedback.filter((f) => f.type === 'confirm'), [feedback]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <MessageSquareWarning className="w-6 h-6 text-amber-600" />
          見積の指摘
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          作成した見積 PDF をアップロードすると、漏れチェックリストに基づいて確認すべき項目を指摘します。記載の有無や重要項目の抜け漏れ確認にご利用ください。
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-2 block">見積 PDF ファイル</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 file:font-medium hover:file:bg-amber-100"
            />
          </label>
          {fileName && !loading && <p className="mt-2 text-xs text-slate-500">解析済み: {fileName}</p>}
          {loading && (
            <p className="mt-2 text-sm text-amber-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              解析中…
            </p>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>

        {feedback.length > 0 && (
          <div className="space-y-6">
            {suggestList.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b border-amber-200 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <h2 className="font-bold text-amber-800">確認推奨（{suggestList.length}件）</h2>
                </div>
                <ul className="divide-y divide-slate-100">
                  {suggestList.map((f, i) => (
                    <li key={i} className="p-4 hover:bg-slate-50">
                      <p className="text-sm font-medium text-slate-800">{f.item}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{f.part}</p>
                      <p className="text-sm text-slate-600 mt-2">{f.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {confirmList.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-200 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <h2 className="font-bold text-blue-800">記載あり・内容確認推奨（{confirmList.length}件）</h2>
                </div>
                <ul className="divide-y divide-slate-100">
                  {confirmList.map((f, i) => (
                    <li key={i} className="p-4 hover:bg-slate-50">
                      <p className="text-sm font-medium text-slate-800">{f.item}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{f.part}</p>
                      <p className="text-sm text-slate-600 mt-2">{f.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {suggestList.length === 0 && confirmList.length === 0 && (
              <p className="text-center text-slate-500 py-8">指摘項目はありませんでした。必要に応じて見積もり漏れチェッカーで確認してください。</p>
            )}
          </div>
        )}

        {feedback.length === 0 && !loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-dashed border-slate-300 p-12 text-center text-slate-500">
            PDF を選択すると、見積内容に基づいた指摘がここに表示されます。
          </div>
        )}
      </div>
    </div>
  );
}
