function getEnv(name) {
  const value = process.env[name];
  return typeof value === 'string' ? value.trim() : '';
}

function validateEnv() {
  const missing = ['MONGODB_URI'].filter((name) => !getEnv(name));

  if (missing.length > 0) {
    const names = missing.join(', ');
    console.error(`Missing required environment variable(s): ${names}`);
    console.error('Set them in your shell before starting the app, for example:');
    console.error('  export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/your-db"');
    console.error('  export CLIENT_URL="http://localhost:5173"');
    process.exit(1);
  }

  return {
    PORT: getEnv('PORT') || '5000',
    CLIENT_URL: getEnv('CLIENT_URL') || 'http://localhost:5173',
    MONGODB_URI: getEnv('MONGODB_URI')
  };
}

module.exports = { getEnv, validateEnv };
