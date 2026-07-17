function hasSessionSecret() {
  return typeof process.env.NEXTAUTH_SECRET === 'string'
    && process.env.NEXTAUTH_SECRET.length >= 32;
}

module.exports = { hasSessionSecret };
