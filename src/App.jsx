import { useState } from 'react';
import { Calculator, ClipboardCheck, FileUp, MessageSquareWarning } from 'lucide-react';
import KousuuTool from './components/KousuuTool';
import MitsumoriChecker from './components/MitsumoriChecker';
import PdfImport from './components/PdfImport';
import EstimateFeedback from './components/EstimateFeedback';

const DEFAULT_CHECKER_META = { お客様名: '', 車種: '', ナンバー: '', カラーNo: '', 担当者: '' };

const TABS = [
  { id: 'kousuu', label: '工数計算', icon: Calculator },
  { id: 'checker', label: '見積もり漏れチェッカー', icon: ClipboardCheck },
  { id: 'pdf-import', label: 'PDF取り込み', icon: FileUp },
  { id: 'feedback', label: '見積の指摘', icon: MessageSquareWarning }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('kousuu');
  const [checkerMeta, setCheckerMeta] = useState(DEFAULT_CHECKER_META);

  const handlePdfApply = (meta) => {
    setCheckerMeta(meta);
  };

  const switchToChecker = () => {
    setActiveTab('checker');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-lg font-bold tracking-wide">新見積ツール</h1>
            <div className="flex rounded-lg overflow-hidden border border-slate-600 bg-slate-700/50 p-0.5 flex-wrap">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === id
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-[calc(100vh-3.5rem)]">
        {activeTab === 'kousuu' && <KousuuTool />}
        {activeTab === 'checker' && (
          <MitsumoriChecker
            reportMeta={checkerMeta}
            onReportMetaChange={setCheckerMeta}
          />
        )}
        {activeTab === 'pdf-import' && (
          <PdfImport
            reportMeta={checkerMeta}
            onApply={handlePdfApply}
            onSwitchToChecker={switchToChecker}
          />
        )}
        {activeTab === 'feedback' && <EstimateFeedback />}
      </main>
    </div>
  );
}
