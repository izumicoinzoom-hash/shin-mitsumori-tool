import React, { useState, useMemo } from 'react';
import { Calculator, CheckSquare, Square, Save, FileText } from 'lucide-react';
import masterData from '../master_data.json';

export default function KousuuTool() {
  const [rate, setRate] = useState(masterData.rate);
  const [activeCategory, setActiveCategory] = useState(Object.keys(masterData.categories)[0]);
  const [selections, setSelections] = useState(() => {
    const initial = {};
    Object.keys(masterData.categories).forEach(cat => {
      masterData.categories[cat].forEach(item => {
        initial[item.id] = item.defaultSelected;
      });
    });
    return initial;
  });

  const toggleSelection = (id) => {
    setSelections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totals = useMemo(() => {
    let totalKousuu = 0;
    Object.keys(masterData.categories).forEach(cat => {
      masterData.categories[cat].forEach(item => {
        if (selections[item.id]) totalKousuu += item.kousuu;
      });
    });
    const totalCost = Math.round(totalKousuu * rate);
    return { kousuu: totalKousuu.toFixed(2), cost: totalCost };
  }, [selections, rate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800 font-sans">
      <div className="w-full md:w-64 bg-slate-900 text-slate-100 flex flex-col shadow-lg">
        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
          <Calculator size={20} className="text-blue-400" />
          <h1 className="font-bold text-lg">工数計算</h1>
        </div>
        <div className="p-4 flex-1">
          <p className="text-xs text-slate-400 mb-2 uppercase font-semibold tracking-wider">カテゴリ</p>
          <ul className="space-y-1">
            {Object.keys(masterData.categories).map(cat => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    activeCategory === cat ? 'bg-blue-600 text-white font-medium' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200 focus-within:ring-2 ring-blue-500/20">
              <span className="text-sm text-slate-600">レート:</span>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="bg-transparent border-b border-slate-300 w-24 text-right outline-none font-semibold text-blue-700 focus:border-blue-500 transition-colors"
              />
              <span className="text-sm text-slate-600">円</span>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <div className="text-right">
              <p className="text-xs text-slate-500 font-semibold">合計工数</p>
              <p className="text-xl font-bold">{totals.kousuu}</p>
            </div>
            <div className="text-right bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
              <p className="text-xs text-blue-600 font-semibold">合計技術料</p>
              <p className="text-2xl font-black text-blue-800">¥ {totals.cost.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
              <FileText size={18} className="text-slate-500" />
              <h2 className="font-bold text-slate-700">{activeCategory}</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {masterData.categories[activeCategory].map(item => (
                <label
                  key={item.id}
                  className={`flex items-center p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selections[item.id] ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex-shrink-0 mr-4">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={!!selections[item.id]}
                      onChange={() => toggleSelection(item.id)}
                    />
                    {selections[item.id] ? (
                      <CheckSquare size={22} className="text-blue-600" />
                    ) : (
                      <Square size={22} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm ${selections[item.id] ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-8 ml-4">
                    <div className="text-right w-16">
                      <span className="text-xs text-slate-400 block">工数</span>
                      <span className="font-mono text-sm">{item.kousuu.toFixed(2)}</span>
                    </div>
                    <div className="text-right w-24">
                      <span className="text-xs text-slate-400 block">技術料</span>
                      <span className="font-mono text-sm font-semibold">
                        ¥ {Math.round(item.kousuu * rate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="max-w-4xl mx-auto mt-6 flex justify-end">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
              <Save size={18} />
              見積もりを保存・出力
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
