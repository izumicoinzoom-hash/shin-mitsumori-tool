import React, { useState, useCallback } from 'react';
import { FileUp, Send, Loader2 } from 'lucide-react';
import { extractTextFromPdf, extractMetaFromText } from '../utils/pdfText';

const DEFAULT_META = { お客様名: '', 車種: '', ナンバー: '', カラーNo: '', 担当者: '' };

export default function PdfImport({ reportMeta, onApply, onSwitchToChecker }) {
  const [meta, setMeta] = useState(DEFAULT_META);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [rawTextPreview, setRawTextPreview] = useState('');

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') {
      setError('PDF ファイルを選択してください');
      return;
    }
    setError('');
    setRawTextPreview('');
    setLoading(true);
    try {
      const text = await extractTextFromPdf(file);
      setRawTextPreview(text ? text.slice(0, 1500) : '');
      const extracted = extractMetaFromText(text);
      setMeta(extracted);
      setFileName(file.name);
    } catch (err) {
      setError('PDF の読み取りに失敗しました。' + (err?.message || ''));
      setMeta(DEFAULT_META);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleApply = useCallback(() => {
    onApply?.(meta);
    onSwitchToChecker?.();
  }, [meta, onApply, onSwitchToChecker]);

  const handleMetaChange = (field, value) => {
    setMeta((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <FileUp className="w-6 h-6 text-blue-600" />
          PDF から受付情報を読み込み
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          見積 PDF を選ぶと、お客様名・車種・ナンバー・カラー№・担当者を自動で読み取ります。内容を確認して「見積チェッカーに入力」を押すと、見積もり漏れチェッカーの受付情報欄に反映されます。
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 mb-2 block">PDF ファイル</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-medium hover:file:bg-blue-100"
            />
          </label>
          {fileName && !loading && <p className="mt-2 text-xs text-slate-500">読み込み済み: {fileName}</p>}
          {loading && (
            <p className="mt-2 text-sm text-blue-600 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              読み取り中…
            </p>
          )}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {rawTextPreview && Object.values(meta).every((v) => !v) && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm">
              <p className="font-medium text-amber-800 mb-2">自動で項目を認識できませんでした。下のテキストを参考に、手動で入力してください。</p>
              <pre className="text-xs text-slate-700 whitespace-pre-wrap break-words max-h-48 overflow-y-auto bg-white p-2 rounded border border-amber-100">{rawTextPreview}</pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h2 className="text-base font-bold text-slate-800 mb-4">読み取った内容（編集可）</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(meta).map(([key, value]) => (
              <label key={key} className="block">
                <span className="text-xs font-medium text-slate-500 block mb-1">{key}</span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleMetaChange(key, e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder={`${key}を入力`}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Send size={18} />
            見積チェッカーに入力
          </button>
        </div>
      </div>
    </div>
  );
}
