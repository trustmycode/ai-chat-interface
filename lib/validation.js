const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value, { field, min = 1, max }) {
  if (typeof value !== 'string') {
    throw new ValidationError(`${field}: требуется строка`);
  }
  const result = value.trim();
  if (result.length < min || result.length > max) {
    throw new ValidationError(`${field}: допустимая длина от ${min} до ${max}`);
  }
  return result;
}

function normalizeEmail(value) {
  const email = cleanText(value, { field: 'Адрес почты', min: 3, max: 254 }).toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    throw new ValidationError('Некорректный адрес почты');
  }
  return email;
}

function validatePassword(value) {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128) {
    throw new ValidationError('Пароль должен содержать от 12 до 128 символов');
  }
  return value;
}

class ValidationError extends Error {}

module.exports = { cleanText, normalizeEmail, validatePassword, ValidationError };
