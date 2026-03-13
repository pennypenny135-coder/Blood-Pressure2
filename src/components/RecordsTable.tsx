import { useState, useRef } from 'react';
import { BPRecord, TimePeriod } from '../types';
import { classifyBP } from '../utils/bpUtils';
import * as XLSX from 'xlsx';

interface Props {
  records: BPRecord[];
  onDelete: (id: string) => void;
  onImport: (records: BPRecord[]) => void;
  onClearAll: () => void;
}

export default function RecordsTable({ records, onDelete, onImport, onClearAll }: Props) {
  const [filter, setFilter] = useState<TimePeriod>('全部');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [clearAllStep, setClearAllStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const periods: TimePeriod[] = ['全部', '早上', '下午', '傍晚', '晚上'];

  const filtered = filter === '全部' ? records : records.filter((r) => r.period === filter);
  const sorted = [...filtered].sort((a, b) => {
    const da = `${a.date} ${a.time}`;
    const db = `${b.date} ${b.time}`;
    return db.localeCompare(da);
  });

  const handleExport = () => {
    const exportData = sorted.map((r) => ({
      '日期': r.date,
      '時間': r.time,
      '時段': r.period,
      '上壓 (mmHg)': r.systolic,
      '下壓 (mmHg)': r.diastolic,
      '心跳 (次/分鐘)': r.heartRate,
      '評估': r.classification,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '血壓記錄');

    // Set column widths
    ws['!cols'] = [
      { wch: 12 }, { wch: 8 }, { wch: 6 },
      { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 12 },
    ];

    XLSX.writeFile(wb, `血壓記錄_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws) as Record<string, unknown>[];

        const imported: BPRecord[] = jsonData.map((row) => {
          const sys = Number(row['上壓 (mmHg)'] || row['systolic'] || 0);
          const dia = Number(row['下壓 (mmHg)'] || row['diastolic'] || 0);
          const hr = Number(row['心跳 (次/分鐘)'] || row['heartRate'] || 0);
          const dateStr = String(row['日期'] || row['date'] || '');
          const timeStr = String(row['時間'] || row['time'] || '00:00');
          const period = (row['時段'] || row['period'] || '早上') as BPRecord['period'];
          const bpClass = classifyBP(sys, dia);

          return {
            id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
            date: dateStr,
            time: timeStr,
            systolic: sys,
            diastolic: dia,
            heartRate: hr,
            period,
            classification: bpClass.label,
            classColor: bpClass.color,
          };
        }).filter((r) => r.systolic > 0 && r.diastolic > 0);

        if (imported.length > 0) {
          onImport(imported);
          alert(`成功匯入 ${imported.length} 筆記錄！`);
        } else {
          alert('未能從檔案中讀取有效記錄。');
        }
      } catch (err) {
        console.error(err);
        alert('匯入失敗，請確認檔案格式。');
      }
    };
    reader.readAsArrayBuffer(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const getClassBadge = (classification: string) => {
    const cls = classifyBP(0, 0); // just for type
    const map: Record<string, string> = {
      '偏低': 'bg-blue-100 text-blue-700',
      '正常': 'bg-green-100 text-green-700',
      '偏高': 'bg-yellow-100 text-yellow-700',
      '高血壓一期': 'bg-orange-100 text-orange-700',
      '高血壓二期': 'bg-red-100 text-red-600',
      '危險高血壓': 'bg-red-200 text-red-800',
    };
    void cls;
    return map[classification] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">📋 記錄列表</h2>
        <span className="text-base text-gray-500">{filtered.length} 筆</span>
      </div>

      {/* Period Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all ${
              filter === p
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Import / Export */}
      <div className="flex gap-3 mb-3">
        <button
          onClick={handleExport}
          disabled={sorted.length === 0}
          className="flex-1 py-3 text-base font-semibold bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 disabled:opacity-40 transition-all border-2 border-emerald-200"
        >
          📤 匯出 Excel
        </button>
        <label className="flex-1 py-3 text-base font-semibold bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all border-2 border-indigo-200 text-center cursor-pointer">
          📥 匯入 Excel
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      {/* Clear All Button */}
      <div className="mb-5">
        <button
          onClick={() => { setShowClearAllModal(true); setClearAllStep(1); }}
          disabled={records.length === 0}
          className="w-full py-3 text-base font-semibold bg-red-50 text-red-600 rounded-xl hover:bg-red-100 disabled:opacity-40 transition-all border-2 border-red-200"
        >
          🗑️ 清除所有資料
        </button>
      </div>

      {/* Clear All Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in">
            {clearAllStep === 1 && (
              <>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">⚠️</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">確定清除所有資料？</h3>
                  <p className="text-base text-gray-500">
                    此操作將刪除所有血壓記錄及個人資料，<br />
                    <span className="text-red-500 font-semibold">且無法復原！</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-2">共 {records.length} 筆記錄將被刪除</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowClearAllModal(false); setClearAllStep(0); }}
                    className="flex-1 py-3 text-base font-semibold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => setClearAllStep(2)}
                    className="flex-1 py-3 text-base font-semibold bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                  >
                    繼續
                  </button>
                </div>
              </>
            )}
            {clearAllStep === 2 && (
              <>
                <div className="text-center mb-4">
                  <div className="text-5xl mb-3">🚨</div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">最後確認！</h3>
                  <p className="text-base text-gray-600 mb-1">
                    你確定要<span className="text-red-600 font-bold">永久刪除</span>所有資料嗎？
                  </p>
                  <p className="text-sm text-gray-400">此操作無法撤銷，建議先匯出備份</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowClearAllModal(false); setClearAllStep(0); }}
                    className="flex-1 py-3 text-base font-semibold bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowClearAllModal(false);
                      setClearAllStep(0);
                    }}
                    className="flex-1 py-3 text-base font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all animate-pulse"
                  >
                    確定全部刪除
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Records */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-xl">暫無記錄</p>
          <p className="text-base mt-1">請到「記錄」頁面新增血壓記錄</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <div className="text-base text-gray-500">
                  📅 {r.date} · 🕐 {r.time} · {r.period}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getClassBadge(r.classification)}`}>
                  {r.classification}
                </span>
              </div>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{r.systolic}</div>
                  <div className="text-xs text-gray-400">上壓</div>
                </div>
                <div className="text-xl text-gray-300">/</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{r.diastolic}</div>
                  <div className="text-xs text-gray-400">下壓</div>
                </div>
                <div className="text-xl text-gray-300">|</div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">{r.heartRate}</div>
                  <div className="text-xs text-gray-400">心跳</div>
                </div>
              </div>
              {/* AI Advice inline */}
              <div className={`mt-3 p-3 rounded-xl text-sm ${getClassBadge(r.classification)}`}>
                {classifyBP(r.systolic, r.diastolic).advice}
              </div>
              <div className="mt-2 flex justify-end">
                {confirmDelete === r.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { onDelete(r.id); setConfirmDelete(null); }}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg"
                    >
                      確定刪除
                    </button>
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-600 rounded-lg"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDelete(r.id)}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    🗑️ 刪除
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
