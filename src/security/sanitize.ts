export const normalize = (s: string) => (s ?? '').normalize?.('NFKC') ?? (s ?? '');
export const limit = (s: string, n: number) => s.slice(0, n);

// 화면 표시에 안전한 텍스트로 정리 (XSS성 태그/제어문자 제거 + 길이 제한)
export const sanitizeDisplayText = (s: string, max = 500) =>
  limit(normalize(String(s)), max)
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '');

// 입력 화이트리스트
export const sanitizeDigits = (s: string, max = 30) =>
  limit(normalize(s).replace(/[^\d]/g, ''), max);

export const sanitizeDigitsDash = (s: string, max = 30) =>
  limit(normalize(s).replace(/[^\d-]/g, ''), max);

export const sanitizeMoney = (s: string, maxDigits = 12) =>
  sanitizeDigits(s, maxDigits);

export const sanitizeName = (s: string, max = 30) =>
  limit(normalize(s).replace(/[^a-zA-Z가-힣\s]/g, ''), max);

export const sanitizeEmail = (s: string, max = 254) =>
  limit(normalize(s).replace(/[^\w.\-@]/g, ''), max);

export const sanitizeAddress = (s: string, max = 120) =>
  limit(normalize(s).replace(/[^\w\s가-힣\-.,()]/g, ''), max);

// 4자리 약한 PIN(1111/0000/1234/4321 등) 탐지
export const isWeakPin = (pin: string) => {
  if (!/^\d{4}$/.test(pin)) return true;
  if (/^(\d)\1{3}$/.test(pin)) return true; // 같은 숫자 반복
  const seq = '012345678901234567890';
  if (seq.includes(pin) || seq.includes(pin.split('').reverse().join(''))) return true;
  return false;
};