export const generateSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({length: 5}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };
  
  export const calculateResult = (answers, results) => {
    const scores = { A: 0, B: 0, C: 0 };
    Object.values(answers).forEach(option => {
      if (option.score) {
        Object.entries(option.score).forEach(([type, point]) => {
          scores[type] = (scores[type] || 0) + (parseInt(point, 10) || 0);
        });
      }
    });
    let maxType = 'A';
    let maxScore = -1;
    Object.entries(scores).forEach(([type, score]) => {
      if (score > maxScore) {
        maxScore = score;
        maxType = type;
      }
    });
    return results.find(r => r.type === maxType) || results[0];
  };