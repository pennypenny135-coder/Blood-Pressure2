export interface BPClassification {
  label: string;
  color: string;
  bgColor: string;
  advice: string;
}

export function classifyBP(systolic: number, diastolic: number): BPClassification {
  if (systolic < 90 || diastolic < 60) {
    return {
      label: '偏低',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      advice: '⚠️ 血壓偏低，可能會感到頭暈、疲倦。建議多喝水，避免突然站起，如持續不適請就醫。',
    };
  }
  if (systolic < 120 && diastolic < 80) {
    return {
      label: '正常',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      advice: '✅ 血壓正常！繼續保持健康的生活習慣，定期監測。',
    };
  }
  if (systolic < 130 && diastolic < 80) {
    return {
      label: '偏高',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      advice: '⚠️ 血壓略為偏高，建議注意飲食（少鹽少油），適量運動，保持心情愉快。',
    };
  }
  if (systolic < 140 || diastolic < 90) {
    return {
      label: '高血壓一期',
      color: 'text-orange-700',
      bgColor: 'bg-orange-100',
      advice: '🟠 高血壓第一期。建議改善生活習慣，減少鈉攝入，定期量血壓，並考慮諮詢醫生。',
    };
  }
  if (systolic < 180 || diastolic < 120) {
    return {
      label: '高血壓二期',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      advice: '🔴 高血壓第二期！請儘快就醫，遵從醫生指示服藥，注意休息，避免情緒激動。',
    };
  }
  return {
    label: '危險高血壓',
    color: 'text-red-800',
    bgColor: 'bg-red-200',
    advice: '🚨 血壓極度危險！請立即就醫或撥打急救電話！不要延誤！',
  };
}

export function classifyHeartRate(hr: number): { label: string; color: string; advice: string } {
  if (hr < 60) {
    return {
      label: '偏慢',
      color: 'text-blue-600',
      advice: '心率偏慢，如無不適可觀察，持續偏低請就醫。',
    };
  }
  if (hr <= 100) {
    return {
      label: '正常',
      color: 'text-green-600',
      advice: '心率正常。',
    };
  }
  return {
    label: '偏快',
    color: 'text-red-600',
    advice: '心率偏快，請保持放鬆，如持續偏快請就醫。',
  };
}

export function getTimePeriod(time: string): '早上' | '下午' | '傍晚' | '晚上' {
  const hour = parseInt(time.split(':')[0], 10);
  if (hour >= 5 && hour < 12) return '早上';
  if (hour >= 12 && hour < 17) return '下午';
  if (hour >= 17 && hour < 21) return '傍晚';
  return '晚上';
}
