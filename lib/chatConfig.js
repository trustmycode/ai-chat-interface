const MODELS = Object.freeze({
  'gpt-4o': {
    name: 'ChatGPT 4o',
    provider: 'OpenAI',
    response: 'Демонстрационный ответ ChatGPT 4o. В этой версии внешний поставщик моделей не вызывается.',
  },
  'gpt-4o-mini': {
    name: 'ChatGPT 4o mini',
    provider: 'OpenAI',
    response: 'Демонстрационный ответ ChatGPT 4o mini. В этой версии внешний поставщик моделей не вызывается.',
  },
  'claude-3-haiku-20240307': {
    name: 'Claude 3 Haiku',
    provider: 'Anthropic',
    response: 'Демонстрационный ответ Claude 3 Haiku. В этой версии внешний поставщик моделей не вызывается.',
  },
});

const DEFAULT_MODEL = 'gpt-4o-mini';

function normalizeModel(value) {
  return typeof value === 'string' && Object.hasOwn(MODELS, value) ? value : DEFAULT_MODEL;
}

function getModelResponse(value) {
  return MODELS[normalizeModel(value)].response;
}

module.exports = { DEFAULT_MODEL, MODELS, getModelResponse, normalizeModel };
