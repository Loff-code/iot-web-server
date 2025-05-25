require('dotenv').config();
const mysql  = require('mysql2/promise');
const bcrypt = require('bcrypt');

(async () => {
  const db = await mysql.createPool(process.env.DATABASE_URL);
  const hash = await bcrypt.hash('correcthorsebatterystaple', 12);
  await db.execute(
    `INSERT INTO users (email, displayName, pw_hash)
     VALUES (?,?,?)
     ON DUPLICATE KEY UPDATE pw_hash = pw_hash`,
    ['alice@example.com', 'Alice', hash]
  );
  console.log('✅  Seeded alice@example.com / correcthorsebatterystaple');
  process.exit(0);
})();
