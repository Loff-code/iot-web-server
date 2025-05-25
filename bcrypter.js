import bcrypt from 'bcrypt';
const hash = await bcrypt.hash('correcthorsebatterystaple', 12);
await knex('users').insert({
  email: 'alice@example.com',
  displayName: 'Alice',
  pw_hash: hash
});
