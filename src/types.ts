export interface UserProfile {
  name: string;
  age: number;
  gender: '男' | '女' | '';
}

export interface BPRecord {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  systolic: number;  // 上壓 (收縮壓)
  diastolic: number; // 下壓 (舒張壓)
  heartRate: number;  // 心跳
  period: '早上' | '下午' | '傍晚' | '晚上';
  classification: string;
  classColor: string;
}

export type TimePeriod = '全部' | '早上' | '下午' | '傍晚' | '晚上';

export type TabType = 'input' | 'records' | 'chart' | 'guide';
