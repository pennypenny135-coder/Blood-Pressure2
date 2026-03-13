export default function BPGuide() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">📖 血壓參考指引</h2>

      {/* BP Classification Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
          <h3 className="text-xl font-bold">血壓分類標準</h3>
          <p className="text-blue-100 text-sm mt-1">根據美國心臟協會 (AHA) 指引</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left font-bold text-gray-700">分類</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">上壓<br/><span className="text-xs font-normal">(收縮壓 mmHg)</span></th>
                <th className="px-4 py-3 text-center font-bold text-gray-700"></th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">下壓<br/><span className="text-xs font-normal">(舒張壓 mmHg)</span></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50 border-b">
                <td className="px-4 py-3">
                  <span className="font-bold text-blue-700">⬇️ 偏低</span>
                </td>
                <td className="px-4 py-3 text-center font-semibold">&lt; 90</td>
                <td className="px-4 py-3 text-center text-gray-400">或</td>
                <td className="px-4 py-3 text-center font-semibold">&lt; 60</td>
              </tr>
              <tr className="bg-green-50 border-b">
                <td className="px-4 py-3">
                  <span className="font-bold text-green-700">✅ 正常</span>
                </td>
                <td className="px-4 py-3 text-center font-semibold">&lt; 120</td>
                <td className="px-4 py-3 text-center text-gray-400">及</td>
                <td className="px-4 py-3 text-center font-semibold">&lt; 80</td>
              </tr>
              <tr className="bg-yellow-50 border-b">
                <td className="px-4 py-3">
                  <span className="font-bold text-yellow-700">⚠️ 偏高</span>
                </td>
                <td className="px-4 py-3 text-center font-semibold">120 - 129</td>
                <td className="px-4 py-3 text-center text-gray-400">及</td>
                <td className="px-4 py-3 text-center font-semibold">&lt; 80</td>
              </tr>
              <tr className="bg-orange-50 border-b">
                <td className="px-4 py-3">
                  <span className="font-bold text-orange-700">🟠 高血壓一期</span>
                </td>
                <td className="px-4 py-3 text-center font-semibold">130 - 139</td>
                <td className="px-4 py-3 text-center text-gray-400">或</td>
                <td className="px-4 py-3 text-center font-semibold">80 - 89</td>
              </tr>
              <tr className="bg-red-50 border-b">
                <td className="px-4 py-3">
                  <span className="font-bold text-red-600">🔴 高血壓二期</span>
                </td>
                <td className="px-4 py-3 text-center font-semibold">140 - 179</td>
                <td className="px-4 py-3 text-center text-gray-400">或</td>
                <td className="px-4 py-3 text-center font-semibold">90 - 119</td>
              </tr>
              <tr className="bg-red-100">
                <td className="px-4 py-3">
                  <span className="font-bold text-red-800">🚨 危險高血壓</span>
                </td>
                <td className="px-4 py-3 text-center font-semibold">≥ 180</td>
                <td className="px-4 py-3 text-center text-gray-400">或</td>
                <td className="px-4 py-3 text-center font-semibold">≥ 120</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Heart Rate Table */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4">
          <h3 className="text-xl font-bold">心跳參考範圍</h3>
          <p className="text-purple-100 text-sm mt-1">靜息心率（成人）</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left font-bold text-gray-700">分類</th>
                <th className="px-4 py-3 text-center font-bold text-gray-700">心跳範圍<br/><span className="text-xs font-normal">(次/分鐘)</span></th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50 border-b">
                <td className="px-4 py-3"><span className="font-bold text-blue-600">⬇️ 偏慢</span></td>
                <td className="px-4 py-3 text-center font-semibold">&lt; 60</td>
              </tr>
              <tr className="bg-green-50 border-b">
                <td className="px-4 py-3"><span className="font-bold text-green-600">✅ 正常</span></td>
                <td className="px-4 py-3 text-center font-semibold">60 - 100</td>
              </tr>
              <tr className="bg-red-50">
                <td className="px-4 py-3"><span className="font-bold text-red-600">⬆️ 偏快</span></td>
                <td className="px-4 py-3 text-center font-semibold">&gt; 100</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">💡 量血壓小貼士</h3>
        <div className="space-y-3 text-base text-gray-700">
          <div className="flex gap-3 items-start">
            <span className="text-2xl">🪑</span>
            <p>量血壓前，先<strong>坐下休息 5 分鐘</strong>，放鬆身心。</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">☕</span>
            <p>測量前 <strong>30 分鐘內避免</strong>喝咖啡、茶或吸煙。</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">💪</span>
            <p>手臂放在桌上，<strong>與心臟同高</strong>，袖帶綁在上臂。</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">🤫</span>
            <p>測量時<strong>不要說話</strong>，保持安靜。</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">🔄</span>
            <p>建議每次量 <strong>2-3 次</strong>，取平均值記錄。</p>
          </div>
          <div className="flex gap-3 items-start">
            <span className="text-2xl">⏰</span>
            <p>建議<strong>每天固定時間</strong>測量（如早上起床後、晚上睡前）。</p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 rounded-2xl p-4 text-sm text-amber-800 border border-amber-200">
        ⚠️ <strong>免責聲明：</strong>本應用程式僅供參考，不能取代專業醫療建議。如有任何健康疑慮，請諮詢您的醫生或醫療專業人員。
      </div>
    </div>
  );
}
