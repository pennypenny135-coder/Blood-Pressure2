import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { BPRecord, TimePeriod } from '../types';

interface Props {
  records: BPRecord[];
}

export default function TrendChart({ records }: Props) {
  const [filter, setFilter] = useState<TimePeriod>('全部');
  const [metric, setMetric] = useState<'bp' | 'hr'>('bp');

  const periods: TimePeriod[] = ['全部', '早上', '下午', '傍晚', '晚上'];

  const filtered = filter === '全部' ? records : records.filter((r) => r.period === filter);

  const sorted = [...filtered].sort((a, b) => {
    const da = `${a.date} ${a.time}`;
    const db = `${b.date} ${b.time}`;
    return da.localeCompare(db);
  });

  const chartData = sorted.map((r) => ({
    name: `${r.date.slice(5)}\n${r.time}`,
    上壓: r.systolic,
    下壓: r.diastolic,
    心跳: r.heartRate,
  }));

  // Stats
  const avgSys = filtered.length > 0
    ? Math.round(filtered.reduce((s, r) => s + r.systolic, 0) / filtered.length)
    : 0;
  const avgDia = filtered.length > 0
    ? Math.round(filtered.reduce((s, r) => s + r.diastolic, 0) / filtered.length)
    : 0;
  const avgHR = filtered.length > 0
    ? Math.round(filtered.reduce((s, r) => s + r.heartRate, 0) / filtered.length)
    : 0;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 趨勢圖表</h2>

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

      {/* Metric Toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setMetric('bp')}
          className={`flex-1 py-2.5 rounded-xl text-base font-medium transition-all ${
            metric === 'bp'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🩺 血壓
        </button>
        <button
          onClick={() => setMetric('hr')}
          className={`flex-1 py-2.5 rounded-xl text-base font-medium transition-all ${
            metric === 'hr'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          💓 心跳
        </button>
      </div>

      {/* Stats Summary */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-red-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{avgSys}</div>
            <div className="text-sm text-gray-500">平均上壓</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{avgDia}</div>
            <div className="text-sm text-gray-500">平均下壓</div>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{avgHR}</div>
            <div className="text-sm text-gray-500">平均心跳</div>
          </div>
        </div>
      )}

      {/* Chart */}
      {chartData.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">📈</div>
          <p className="text-xl">暫無數據</p>
          <p className="text-base mt-1">新增記錄後即可查看趨勢</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-4">
          <ResponsiveContainer width="100%" height={320}>
            {metric === 'bp' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis domain={[40, 200]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '14px',
                  }}
                />
                <Legend />
                <ReferenceLine y={120} stroke="#22c55e" strokeDasharray="5 5" label={{ value: '正常上限', fontSize: 11 }} />
                <ReferenceLine y={80} stroke="#3b82f6" strokeDasharray="5 5" label={{ value: '正常下限', fontSize: 11 }} />
                <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '高血壓', fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="上壓"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ef4444' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="下壓"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#3b82f6' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval="preserveStartEnd"
                />
                <YAxis domain={[40, 140]} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: '14px',
                  }}
                />
                <Legend />
                <ReferenceLine y={60} stroke="#3b82f6" strokeDasharray="5 5" label={{ value: '偏慢', fontSize: 11 }} />
                <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '偏快', fontSize: 11 }} />
                <Line
                  type="monotone"
                  dataKey="心跳"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#a855f7' }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="mt-4 bg-blue-50 rounded-2xl p-4 text-sm text-blue-700">
          💡 提示：選擇不同時段（早上/下午/傍晚/晚上）可以比較同一時段的血壓變化趨勢。
        </div>
      )}
    </div>
  );
}
