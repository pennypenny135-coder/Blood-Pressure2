import { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onSave: (p: UserProfile) => void;
}

export default function ProfileSetup({ profile, onSave }: Props) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age || '');
  const [gender, setGender] = useState<'' | '男' | '女'>(profile.gender);

  const handleSave = () => {
    if (!name.trim() || !age || !gender) return;
    onSave({ name: name.trim(), age: Number(age), gender });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">❤️</div>
          <h1 className="text-3xl font-bold text-gray-800">血壓記錄助手</h1>
          <p className="text-gray-500 mt-2 text-lg">請先設定您的個人資料</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">👤 姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="請輸入姓名"
              className="w-full px-5 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-2">🎂 年齡</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="請輸入年齡"
              min={1}
              max={150}
              className="w-full px-5 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-700 mb-3">⚧ 性別</label>
            <div className="flex gap-4">
              <button
                onClick={() => setGender('男')}
                className={`flex-1 py-4 text-xl rounded-2xl border-2 font-semibold transition-all ${
                  gender === '男'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-500 hover:border-blue-300'
                }`}
              >
                👨 男
              </button>
              <button
                onClick={() => setGender('女')}
                className={`flex-1 py-4 text-xl rounded-2xl border-2 font-semibold transition-all ${
                  gender === '女'
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-200 text-gray-500 hover:border-pink-300'
                }`}
              >
                👩 女
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!name.trim() || !age || !gender}
            className="w-full py-4 text-xl font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
          >
            開始使用 →
          </button>
        </div>
      </div>
    </div>
  );
}
