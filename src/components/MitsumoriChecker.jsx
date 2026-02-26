import React, { useState, useMemo, useCallback } from 'react';
import { CheckSquare, Car, ClipboardList, Wrench, Check, X, HelpCircle, Printer, Info, AlertCircle } from 'lucide-react';
import { partsData, commonItems } from '../checker_data';

const CATEGORY_ORDER = ['labor', 'damage'];
const CATEGORY_LABEL = { damage: '損傷確認系', labor: '工賃系' };

function ensureItemCategory(item) {
  return { ...item, category: item.category || (item.isKeyPoint ? 'labor' : 'damage') };
}

const partsDataWithCategory = Object.fromEntries(
  Object.entries(partsData).map(([k, v]) => [
    k,
    { items: (v.items || []).map(ensureItemCategory) }
  ])
);
const commonItemsWithCategory = {
  items: (commonItems.items || []).map((i) => ensureItemCategory({ ...i, category: 'labor' }))
};

export default function MitsumoriChecker() {
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [workTypes, setWorkTypes] = useState({});
  const [checkedItems, setCheckedItems] = useState({});
  const [expandedHelp, setExpandedHelp] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [reportMeta, setReportMeta] = useState({
    お客様名: '', 車種: '', ナンバー: '', カラーNo: '', 担当者: ''
  });

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  }, []);

  const getActiveWorkTypes = useCallback(() => {
    const types = new Set();
    selectedAreas.forEach((area) => {
      if (area.areaKey === '共通項目') return;
      types.add(workTypes[area.label] || 'repair');
    });
    if (types.size === 0) types.add('repair');
    return Array.from(types);
  }, [selectedAreas, workTypes]);

  const getFilteredItems = useCallback((area) => {
    const dataObj = area.areaKey === '共通項目' ? commonItemsWithCategory : partsDataWithCategory[area.areaKey];
    const allItems = dataObj?.items || [];
    if (area.areaKey === '共通項目') {
      const activeTypes = getActiveWorkTypes();
      return allItems.filter((item) => {
        if (!item.appliesTo || item.appliesTo.includes('all')) return true;
        return activeTypes.some((t) => item.appliesTo.includes(t));
      });
    }
    const currentWorkType = workTypes[area.label] || 'repair';
    return allItems.filter((item) => !item.appliesTo || item.appliesTo.includes(currentWorkType));
  }, [workTypes, getActiveWorkTypes]);

  const groupItemsByCategory = (items) => {
    const grouped = { damage: [], labor: [] };
    items.forEach((item) => {
      const key = item.category === 'labor' ? 'labor' : 'damage';
      grouped[key].push(item);
    });
    return grouped;
  };

  const handleToggleArea = (areaKey, label) => {
    setSelectedAreas((prev) => {
      const exists = prev.find((p) => p.label === label);
      if (exists) return prev.filter((p) => p.label !== label);
      setWorkTypes((wt) => ({ ...wt, [label]: areaKey === '共通項目' ? 'common' : 'repair' }));
      return [...prev, { areaKey, label }];
    });
  };

  const handleWorkTypeChange = (label, type) => {
    setWorkTypes((prev) => ({ ...prev, [label]: type }));
    const targetArea = selectedAreas.find((a) => a.label === label);
    if (!targetArea) return;
    const dataObj = partsDataWithCategory[targetArea.areaKey];
    const allItems = dataObj?.items || [];
    const allowedNames = new Set(
      allItems
        .filter((item) => !item.appliesTo || item.appliesTo.includes(type))
        .map((item) => item.name)
    );
    setCheckedItems((prev) => {
      const next = { ...prev };
      Object.keys(prev).forEach((key) => {
        if (!key.startsWith(`${label}::`)) return;
        const [, itemName] = key.split('::');
        if (!allowedNames.has(itemName)) delete next[key];
      });
      return next;
    });
  };

  const handleToggleCheck = (itemKey) => {
    setCheckedItems((prev) => {
      const newState = { ...prev };
      if (newState[itemKey]) delete newState[itemKey];
      else newState[itemKey] = true;
      return newState;
    });
  };

  const handleToggleHelp = (e, itemKey) => {
    e.stopPropagation();
    setExpandedHelp((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  const executeReset = () => {
    setCheckedItems({});
    setSelectedAreas([]);
    setWorkTypes({});
    setExpandedHelp({});
    setReportMeta({ お客様名: '', 車種: '', ナンバー: '', カラーNo: '', 担当者: '' });
    setShowConfirm(false);
    showToast('リセットしました');
  };

  const handleMetaChange = (field, value) => {
    setReportMeta((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrintAndPdf = async () => {
    const el = document.getElementById('print-area');
    if (!el) {
      window.print();
      return;
    }
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const sanitize = (s) => (s ? String(s).replace(/[\s\\/:*?"<>|]/g, '_').slice(0, 50) : '');
      const filename = `${sanitize(reportMeta.お客様名) || 'お客様名'}_${sanitize(reportMeta.車種) || '車種'}_${sanitize(reportMeta.ナンバー) || 'ナンバー'}.pdf`;
      const clone = el.cloneNode(true);
      clone.id = 'print-area-clone';
      clone.classList.remove('hidden');
      clone.style.cssText = 'position:fixed; left:0; top:0; width:210mm; max-width:100%; display:block; background:#fff; z-index:9999; opacity:0.01; pointer-events:none;';
      document.body.appendChild(clone);
      const removeAndPrint = () => {
        if (clone.parentNode) clone.parentNode.removeChild(clone);
        window.print();
      };
      await html2pdf()
        .set({
          margin: 10,
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        })
        .from(clone)
        .save();
      removeAndPrint();
    } catch {
      window.print();
    }
  };

  const renderPartButton = ({ label, partName, className = '' }) => {
    const isSelected = selectedAreas.some((p) => p.label === label);
    const virtualArea = { areaKey: partName, label };
    const items = getFilteredItems(virtualArea);
    const total = items.length;
    const checkedCount = items.filter((item) => checkedItems[`${label}::${item.name}`]).length;
    const isComplete = total > 0 && checkedCount === total;
    const hasSomeChecks = checkedCount > 0;
    return (
      <button
        key={label}
        type="button"
        onClick={() => handleToggleArea(partName, label)}
        className={`relative flex flex-col items-center justify-center p-2 text-sm font-bold border-2 transition-all duration-200
          ${isSelected ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-[1.02] z-10' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}
          ${className}`}
        style={{ minHeight: '3.5rem' }}
      >
        <span>{label}</span>
        {hasSomeChecks && !isComplete && (
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow border border-white">
            {checkedCount}
          </span>
        )}
        {isComplete && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white w-5 h-5 flex items-center justify-center rounded-full shadow border border-white">
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen pb-24 print:pb-0 print:bg-white bg-gray-100">
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-fade-in { animation: fadeIn 0.2s ease-out; }
        .animate-fade-in-up { animation: fadeInUp 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
          .print-avoid-break { break-inside: avoid; page-break-inside: avoid; }
        }
      `}} />

      <header className="bg-slate-800 text-white p-4 shadow-md sticky top-0 z-30 print:hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-bold flex items-center tracking-wide">
            <CheckSquare className="mr-2 text-blue-400 w-6 h-6" />
            シューリーズ 見積もり漏れチェッカー
          </h1>
          <button type="button" onClick={() => setShowConfirm(true)} className="text-xs md:text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded border border-slate-500 transition-colors">
            リセット
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 mt-4 print:hidden">
        <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h2 className="text-base font-bold text-blue-900 mb-2">使い方</h2>
          <p className="text-sm text-blue-800 leading-relaxed">
            1) 下の「受付情報」を入力 → 2) 車両図から損傷部位を選択 → 3) 各部位で作業種別（修理・新品交換・中古交換）を選び項目をチェック → 4) 右下の「印刷する」で出力。
          </p>
        </div>

        <div className="mb-6 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm space-y-4">
          <p className="text-xs text-gray-500 font-medium">※ PDFのファイル名は「お客様名_車種_ナンバー」になります</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="text-sm">
              <span className="block text-gray-600 mb-1 font-medium">お客様名</span>
              <input value={reportMeta.お客様名} onChange={(e) => handleMetaChange('お客様名', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="例: 山田 太郎" />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1 font-medium">車種</span>
              <input value={reportMeta.車種} onChange={(e) => handleMetaChange('車種', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="例: トヨタ プリウス" />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1 font-medium">ナンバー</span>
              <input value={reportMeta.ナンバー} onChange={(e) => handleMetaChange('ナンバー', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="例: 品川300あ1234" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-gray-100 pt-3">
            <label className="text-sm">
              <span className="block text-gray-600 mb-1 font-medium">カラー№</span>
              <input value={reportMeta.カラーNo} onChange={(e) => handleMetaChange('カラーNo', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="例: 3R2" />
            </label>
            <label className="text-sm">
              <span className="block text-gray-600 mb-1 font-medium">担当者</span>
              <input value={reportMeta.担当者} onChange={(e) => handleMetaChange('担当者', e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="例：清田" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-center font-bold text-gray-700 mb-4 flex items-center justify-center">
                <Car className="mr-2 w-5 h-5 text-gray-500" />
                損傷部位を選択（複数可）
              </h2>
              <div className="mt-2 w-full max-w-[320px] mx-auto">
                {renderPartButton({ label: '共通・付帯作業 (必須)', partName: '共通項目', className: 'w-full bg-indigo-50 border-indigo-300 text-indigo-800 rounded-xl py-3 hover:bg-indigo-100' })}
              </div>
              <div className="flex flex-col items-center gap-1.5 w-full max-w-[320px] mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-inner">
                {renderPartButton({ label: 'フロントバンパー', partName: 'フロントバンパー', className: 'w-[85%] rounded-t-[2rem] rounded-b-md' })}
                <div className="flex w-full gap-1.5 h-20">
                  {renderPartButton({ label: '左Fフェンダー', partName: 'フロントフェンダー', className: 'w-1/4 rounded-tl-2xl rounded-bl-sm' })}
                  {renderPartButton({ label: 'ボンネット', partName: 'ボンネット', className: 'w-2/4 rounded-sm border-b-4 border-b-gray-400' })}
                  {renderPartButton({ label: '右Fフェンダー', partName: 'フロントフェンダー', className: 'w-1/4 rounded-tr-2xl rounded-br-sm' })}
                </div>
                <div className="flex w-full gap-1.5 h-20">
                  {renderPartButton({ label: '左Fドア', partName: 'フロントドア', className: 'w-1/4 rounded-sm' })}
                  {renderPartButton({ label: 'ルーフ', partName: 'ルーフ', className: 'w-2/4 rounded-sm' })}
                  {renderPartButton({ label: '右Fドア', partName: 'フロントドア', className: 'w-1/4 rounded-sm' })}
                </div>
                <div className="flex w-full gap-1.5 h-20">
                  {renderPartButton({ label: '左Rドア', partName: 'リアドア（スライドドア）', className: 'w-1/4 rounded-sm' })}
                  <div className="w-2/4 bg-slate-200/60 flex items-center justify-center rounded-sm border border-slate-300 border-dashed">
                    <span className="text-slate-400 text-xs font-medium">室内/フロア</span>
                  </div>
                  {renderPartButton({ label: '右Rドア', partName: 'リアドア（スライドドア）', className: 'w-1/4 rounded-sm' })}
                </div>
                <div className="flex w-full gap-1.5 h-16">
                  {renderPartButton({ label: '左クォーター', partName: 'クォーターパネル', className: 'w-1/4 rounded-bl-2xl rounded-tl-sm' })}
                  {renderPartButton({ label: 'バックドア', partName: 'バックドア', className: 'w-2/4 rounded-sm border-t-4 border-t-gray-400' })}
                  {renderPartButton({ label: '右クォーター', partName: 'クォーターパネル', className: 'w-1/4 rounded-br-2xl rounded-tr-sm' })}
                </div>
                {renderPartButton({ label: 'リヤバンパー', partName: 'リヤバンパー', className: 'w-[85%] rounded-b-[2rem] rounded-t-md' })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {selectedAreas.length === 0 ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white border border-gray-200 border-dashed rounded-2xl text-gray-400 p-6">
                <Wrench className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-center font-medium leading-relaxed">
                  左のイラストから損傷部位を<br />タップしてチェックを開始してください
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedAreas.map((area) => {
                  const currentWorkType = workTypes[area.label] || 'repair';
                  const filteredItems = getFilteredItems(area);
                  const groupedItems = groupItemsByCategory(filteredItems);
                  return (
                    <div key={area.label} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                      <div className="bg-slate-50 border-b border-gray-200 p-4">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg md:text-xl font-bold text-slate-800 flex items-center">
                            <ClipboardList className="mr-2 text-blue-600 w-6 h-6" />
                            {area.label}
                          </h2>
                          <button type="button" onClick={() => handleToggleArea(area.areaKey, area.label)} className="text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded p-1 shadow-sm transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        {area.areaKey !== '共通項目' && (
                          <div className="flex bg-slate-200/70 p-1 rounded-lg mt-4">
                            {['repair', 'new', 'used'].map((type) => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => handleWorkTypeChange(area.label, type)}
                                className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-all duration-200 ${currentWorkType === type ? 'bg-white shadow-sm text-blue-700 ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                {type === 'repair' ? '修理' : type === 'new' ? '新品交換' : '中古交換'}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-5">
                        {CATEGORY_ORDER.map((cat) => {
                          const sectionItems = groupedItems[cat];
                          if (!sectionItems || sectionItems.length === 0) return null;
                          return (
                            <div key={cat} className="space-y-3">
                              <div className={`text-sm font-bold px-3 py-1.5 rounded-lg border inline-block ${cat === 'damage' ? 'bg-slate-100 text-slate-700 border-slate-300' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                                {CATEGORY_LABEL[cat]}（{sectionItems.length}）
                              </div>
                              {sectionItems.map((item, idx) => {
                                const itemKey = `${area.label}::${item.name}`;
                                const isChecked = !!checkedItems[itemKey];
                                const isHelpExpanded = !!expandedHelp[itemKey];
                                return (
                                  <div
                                    key={`${cat}-${idx}`}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleToggleCheck(itemKey)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleToggleCheck(itemKey)}
                                    className={`flex items-start p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${isChecked ? 'bg-blue-50/50 border-blue-400 shadow-sm' : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-gray-50'} ${item.isKeyPoint && !isChecked ? 'border-yellow-300 bg-yellow-50/30' : ''}`}
                                  >
                                    <div className="flex-shrink-0 mt-0.5">
                                      <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isChecked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                                        {isChecked && <Check className="w-4 h-4 text-white stroke-[3]" />}
                                      </div>
                                    </div>
                                    <div className="ml-3 flex-1">
                                      <div className="flex justify-between items-center flex-wrap gap-x-2">
                                        <div className={`text-base font-bold transition-all ${isChecked ? 'text-blue-900 opacity-80' : 'text-gray-800'}`}>{item.name}</div>
                                        <div className="flex items-center gap-2">
                                          {item.estimate && (
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">{item.estimate}</span>
                                          )}
                                          {(item.desc || item.adjusterNote) && (
                                            <button type="button" onClick={(e) => handleToggleHelp(e, itemKey)} className={`p-1.5 rounded-full transition-colors flex-shrink-0 ${isHelpExpanded ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`} title="説明・アジャスター向け">
                                              <HelpCircle className="w-5 h-5" />
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                      {isHelpExpanded && (item.desc || item.adjusterNote) && (
                                        <div className="mt-2.5 mb-1 space-y-3 animate-fade-in" onClick={(e) => e.stopPropagation()} role="presentation">
                                          {item.desc && (
                                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed shadow-sm">
                                              <div className="flex items-center gap-1.5 mb-2 text-slate-500 font-bold text-xs uppercase tracking-wide">
                                                <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />説明
                                              </div>
                                              <div className="pl-5">{item.desc}</div>
                                            </div>
                                          )}
                                          {item.adjusterNote && (
                                            <div className="p-3.5 bg-amber-50/80 border-l-4 border-amber-400 rounded-r-xl text-sm shadow-sm">
                                              <div className="flex items-center gap-1.5 mb-2 text-amber-800 font-bold text-xs">【アジャスター向け】</div>
                                              <div className="text-amber-900/90 leading-relaxed">{item.adjusterNote}</div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                      {item.isKeyPoint && (
                                        <div className={`mt-2 text-sm flex items-start p-2 rounded-md border ${isChecked ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-yellow-100/70 border-yellow-200 text-yellow-800'}`}>
                                          <AlertCircle className="w-4 h-4 mr-1.5 flex-shrink-0 mt-0.5" />
                                          <span className="leading-snug">{item.hint}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                        {filteredItems.length === 0 && <p className="text-center text-sm text-gray-500 py-4">この作業でチェックすべき特有の項目はありません。</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 print:hidden">
        <button type="button" onClick={handlePrintAndPdf} className="flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full shadow-xl transition-transform active:scale-95 focus:outline-none">
          <Printer className="w-5 h-5 mr-2" />
          印刷 / PDF保存
        </button>
      </div>

      {/* 印刷用 */}
      <div id="print-area" className="hidden print:block text-black max-w-4xl mx-auto w-full p-2">
        <div className="border-b-2 border-black pb-3 mb-6 flex justify-between items-end">
          <h1 className="text-2xl font-bold flex items-center">
            <CheckSquare className="mr-2 w-8 h-8" />
            シューリーズ 見積もり漏れチェック結果
          </h1>
          <p className="text-sm font-medium">
            出力日時: {new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="mb-6 border-2 border-gray-600 rounded-lg p-3 space-y-2 text-sm print-avoid-break">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div><span className="font-bold">お客様名:</span> {reportMeta.お客様名 || '未入力'}</div>
            <div><span className="font-bold">車種:</span> {reportMeta.車種 || '未入力'}</div>
            <div><span className="font-bold">ナンバー:</span> {reportMeta.ナンバー || '未入力'}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-gray-400 pt-2 mt-2">
            <div><span className="font-bold">カラー№:</span> {reportMeta.カラーNo || '未入力'}</div>
            <div><span className="font-bold">担当者:</span> {reportMeta.担当者 || '未入力'}</div>
          </div>
        </div>
        {selectedAreas.length === 0 ? (
          <p className="text-center mt-10 font-bold text-gray-500">選択された部位がありません。</p>
        ) : (
          <div className="space-y-6">
            {selectedAreas.map((area) => {
              const currentWorkType = workTypes[area.label] || 'repair';
              const filteredItems = getFilteredItems(area);
              const groupedItems = groupItemsByCategory(filteredItems);
              const checkedCount = filteredItems.filter((item) => checkedItems[`${area.label}::${item.name}`]).length;
              return (
                <div key={area.label} className="print-avoid-break border-2 border-gray-600 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 border-b-2 border-gray-600 p-2 px-4 flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center">
                      {area.label}
                      {area.areaKey !== '共通項目' && (
                        <span className="ml-3 text-xs font-bold text-gray-700 border border-gray-400 px-2 py-0.5 rounded bg-white">
                          {currentWorkType === 'new' ? '新品交換' : currentWorkType === 'used' ? '中古交換' : '修理'}
                        </span>
                      )}
                    </h2>
                    <span className="text-sm font-bold">チェック済: {checkedCount} / {filteredItems.length} 項目</span>
                  </div>
                  <div className="p-4 space-y-4">
                    {CATEGORY_ORDER.map((cat) => {
                      const sectionItems = groupedItems[cat];
                      if (!sectionItems || sectionItems.length === 0) return null;
                      return (
                        <div key={`print-${cat}`}>
                          <div className="text-xs font-bold border border-black inline-block px-2 py-0.5 mb-2">{CATEGORY_LABEL[cat]}</div>
                          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                            {sectionItems.map((item, idx) => {
                              const itemKey = `${area.label}::${item.name}`;
                              const isChecked = !!checkedItems[itemKey];
                              return (
                                <div key={`${cat}-${idx}`} className="flex items-start">
                                  <div className={`w-5 h-5 border-2 border-black flex-shrink-0 flex items-center justify-center mr-2 mt-0.5 ${isChecked ? 'bg-black text-white' : 'bg-white'}`}>
                                    {isChecked && <Check className="w-4 h-4 stroke-[4]" />}
                                  </div>
                                  <div className="flex-1 leading-snug">
                                    <span className={`text-sm ${isChecked ? 'font-black' : 'text-gray-700'}`}>{item.name}</span>
                                    {item.estimate && <span className="ml-1.5 text-[10px] text-gray-600 font-medium">（{item.estimate}）</span>}
                                    {item.isKeyPoint && !isChecked && <span className="ml-2 text-[10px] border border-black px-1 font-bold inline-block whitespace-nowrap bg-gray-100">未確認</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">確認</h3>
            <p className="text-gray-600 mb-6 text-sm">すべてのチェック状態と部位選択をリセットしますか？</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowConfirm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">キャンセル</button>
              <button type="button" onClick={executeReset} className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm">リセットする</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-5 py-3 rounded-lg shadow-2xl z-50 flex items-center text-sm font-medium animate-fade-in-up print:hidden">
          <Info className="w-5 h-5 mr-2 text-blue-400" />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
