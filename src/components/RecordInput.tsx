import { useState } from 'react';
import { BPRecord, UserProfile } from '../types';
import { classifyBP, classifyHeartRate, getTimePeriod } from '../utils/bpUtils';

interface Props {
  profile: UserProfile;
  onSave: (record: BPRecord) => void;
  onEditProfile: () => void;
}

export default function RecordInput({ profile, onSave, onEditProfile }: Props) {
  const now = new Date();
  const [date, setDate] = useState(now.toISOString().slice(0, 10));
  const [time, setTime] = useState(now.toTimeString().slice(0, 5));
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [result, setResult] = useState<{ bp: ReturnType<typeof classifyBP>; hr: ReturnType<typeof classifyHeartRate> } | null>(null);
  const [saved, setSaved] = useState(false);

  const canSubmit = date && time && systolic && diastolic && heartRate &&
    Number(systolic) > 0 && Number(diastolic) > 0 && Number(heartRate) > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;

    const sys = Number(systolic);
    const dia = Number(diastolic);
    const hr = Number(heartRate);
    const bpClass = classifyBP(sys, dia);
    const hrClass = classifyHeartRate(hr);

    const record: BPRecord = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      date,
      time,
      systolic: sys,
      diastolic: dia,
      heartRate: hr,
      period: getTimePeriod(time),
      classification: bpClass.label,
      classColor: bpClass.color,
    };

    onSave(record);
    setResult({ bp: bpClass, hr: hrClass });
    setSaved(true);
  };

  const handleReset = () => {
    const now = new Date();
    setDate(now.toISOString().slice(0, 10));
    setTime(now.toTimeString().slice(0, 5));
    setSystolic('');
    setDiastolic('');
    setHeartRate('');
    setResult(null);
    setSaved(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-5 mb-6 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">{profile.gender === '男' ? '👨' : '👩'} {profile.name}</div>
            <div className="text-blue-100 text-lg mt-1">{profile.age} 歲 · {profile.gender}</div>
          </div>
          <button onClick={onEditProfile} className="text-sm bg-white/20 px-3 py-1.5 rounded-xl hover:bg-white/30 transition-all">
            修改資料
          </button>
        </div>
      </div>

      {/* Date & Time */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
        <h3 className="text-xl font-bold text-gray-700 mb-4">📅 日期與時間</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-600 mb-1">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-600 mb-1">時間</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>
        {time && (
          <div className="mt-3 text-base text-gray-500">
            🕐 時段：<span className="font-semibold text-gray-700">{getTimePeriod(time)}</span>
          </div>
        )}
      </div>

      {/* BP Input */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-4">
        <h3 className="text-xl font-bold text-gray-700 mb-4">🩺 血壓與心跳</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-600 mb-1">
              上壓（收縮壓）mmHg
            </label>
            <input
              type="number"
              value={systolic}
              onChange={(e) => { setSystolic(e.target.value); setSaved(false); setResult(null); }}
              placeholder="例如：120"
              min={50}
              max={300}
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none text-center"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-600 mb-1">
              下壓（舒張壓）mmHg
            </label>
            <input
              type="number"
              value={diastolic}
              onChange={(e) => { setDiastolic(e.target.value); setSaved(false); setResult(null); }}
              placeholder="例如：80"
              min={30}
              max={200}
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-center"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-gray-600 mb-1">
              心跳 (次/分鐘)
            </label>
            <input
              type="number"
              value={heartRate}
              onChange={(e) => { setHeartRate(e.target.value); setSaved(false); setResult(null); }}
              placeholder="例如：72"
              min={30}
              max={250}
              className="w-full px-4 py-3 text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-center"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {!saved && (
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full py-4 text-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mb-4"
        >
          💾 儲存記錄
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-4 mb-4">
          <div className={`${result.bp.bgColor} rounded-2xl p-5 border-2 border-opacity-30`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-gray-600">血壓評估</span>
              <span className={`text-2xl font-bold ${result.bp.color}`}>{result.bp.label}</span>
            </div>
            <div className="flex justify-center gap-8 mb-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{systolic}</div>
                <div className="text-sm text-gray-500">上壓</div>
              </div>
              <div className="text-3xl text-gray-300">/</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{diastolic}</div>
                <div className="text-sm text-gray-500">下壓</div>
              </div>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">{result.bp.advice}</p>
          </div>

          <div className="bg-purple-50 rounded-2xl p-5 border-2 border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-gray-600">心跳評估</span>
              <span className={`text-2xl font-bold ${result.hr.color}`}>{result.hr.label}</span>
            </div>
            <div className="text-center mb-2">
              <span className="text-3xl font-bold text-purple-600">{heartRate}</span>
              <span className="text-lg text-gray-500 ml-1">次/分鐘</span>
            </div>
            <p className="text-base text-gray-700">{result.hr.advice}</p>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 text-lg font-bold text-blue-600 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all"
          >
            ➕ 新增另一筆記錄
          </button>
        </div>
      )}
    </div>
  );
}
