const test = require('node:test');
const assert = require('node:assert/strict');

const { DEFAULT_MODEL, getModelResponse, normalizeModel } = require('../lib/chatConfig');
const { checkRateLimit } = require('../lib/rateLimit');
const { hasSessionSecret } = require('../lib/sessionSecret');
const { normalizeEmail, validatePassword, ValidationError } = require('../lib/validation');

test('неизвестная модель заменяется разрешённой моделью по умолчанию', () => {
  assert.equal(normalizeModel('unknown-provider-model'), DEFAULT_MODEL);
  assert.match(getModelResponse('unknown-provider-model'), /внешний поставщик моделей не вызывается/);
});

test('адрес почты нормализуется, а слабый пароль отклоняется', () => {
  assert.equal(normalizeEmail(' Person@Example.Test '), 'person@example.test');
  assert.throws(() => validatePassword('short'), ValidationError);
  assert.equal(validatePassword('достаточно-длинный-пароль'), 'достаточно-длинный-пароль');
});

test('сервер не принимает отсутствующий или короткий секрет сеанса', (t) => {
  const previous = process.env.NEXTAUTH_SECRET;
  t.after(() => {
    if (previous === undefined) delete process.env.NEXTAUTH_SECRET;
    else process.env.NEXTAUTH_SECRET = previous;
  });

  delete process.env.NEXTAUTH_SECRET;
  assert.equal(hasSessionSecret(), false);
  process.env.NEXTAUTH_SECRET = 'short';
  assert.equal(hasSessionSecret(), false);
  process.env.NEXTAUTH_SECRET = 'a'.repeat(32);
  assert.equal(hasSessionSecret(), true);
});

test('ограничитель частоты блокирует запрос после исчерпания квоты', () => {
  const key = `test:${Date.now()}:${Math.random()}`;
  assert.equal(checkRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed, true);
  assert.equal(checkRateLimit(key, { limit: 2, windowMs: 60_000 }).allowed, true);
  const blocked = checkRateLimit(key, { limit: 2, windowMs: 60_000 });
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);
});
