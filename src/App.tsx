import { useState, useEffect } from 'react';
import { BPRecord, UserProfile, TabType } from './types';
import { saveRecords, loadRecords, saveProfile, loadProfile } from './utils/storage';
import ProfileSetup from './components/ProfileSetup';
import RecordInput from './components/RecordInput';
import RecordsTable from './components/RecordsTable';
import TrendChart from './components/TrendChart';
import BPGuide from './components/BPGuide';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadProfile());
  const [records, setRecords] = useState<BPRecord[]>(loadRecords());
  const [tab, setTab] = useState<TabType>('input');
  const [profileSet, setProfileSet] = useState(!!profile.name && !!profile.age && !!profile.gender);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const handleProfileSave = (p: UserProfile) => {
    setProfile(p);
    setProfileSet(true);
    setEditingProfile(false);
  };

  const handleAddRecord = (record: BPRecord) => {
    setRecords((prev) => [...prev, record]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleImportRecords = (imported: BPRecord[]) => {
    setRecords((prev) => [...prev, ...imported]);
  };

  const handleClearAll = () => {
    setRecords([]);
    setProfile({ name: '', age: 0, gender: '' });
    setProfileSet(false);
    localStorage.removeItem('bp_records');
    localStorage.removeItem('bp_profile');
  };

  if (!profileSet || editingProfile) {
    return <ProfileSetup profile={profile} onSave={handleProfileSave} />;
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'input', label: '記錄', icon: '🩺' },
    { id: 'records', label: '歷史', icon: '📋' },
    { id: 'chart', label: '趨勢', icon: '📊' },
    { id: 'guide', label: '指引', icon: '📖' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Content */}
      <div className="pt-2">
        {tab === 'input' && (
          <RecordInput
            profile={profile}
            onSave={handleAddRecord}
            onEditProfile={() => setEditingProfile(true)}
          />
        )}
        {tab === 'records' && (
          <RecordsTable
            records={records}
            onDelete={handleDeleteRecord}
            onImport={handleImportRecords}
            onClearAll={handleClearAll}
          />
        )}
        {tab === 'chart' && <TrendChart records={records} />}
        {tab === 'guide' && <BPGuide />}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 flex flex-col items-center gap-0.5 transition-all ${
                tab === t.id
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className={`text-xs font-semibold ${tab === t.id ? 'text-blue-600' : ''}`}>
                {t.label}
              </span>
              {tab === t.id && (
                <div className="w-6 h-1 bg-blue-600 rounded-full mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
