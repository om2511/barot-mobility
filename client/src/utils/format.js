export const formatINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹૦';
  return '₹' + Number(val).toLocaleString('en-IN');
};

export const getMonthNameGujarati = (monthStr) => {
  if (!monthStr) return '';
  const [year, month] = monthStr.split('-');
  const gujaratiMonths = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 
    'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];
  const mIndex = parseInt(month, 10) - 1;
  return `${gujaratiMonths[mIndex] || month} ${year}`;
};

// Gujarati translations map for quick helper
export const gujaratiTypes = {
  income: 'આવક (ભાડું)',
  cng: 'CNG ગેસ ખર્ચ',
  service: 'ગાડી સર્વિસ ખર્ચ',
  other: 'અન્ય ખર્ચ'
};
