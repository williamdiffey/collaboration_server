function cleanTables(db) {
  return db.raw(`
   TRUNCATE users;
  `)
}

function cleanUserTable(db) {
  // drop rather than truncate to avoid primary key increments breaking
  // expected values when returning a new user

  return db.raw(`DROP TABLE IF EXISTS users;
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    avatar_url TEXT NOT NULL DEFAULT 'Default-Avatar.png',
    not_verified BOOLEAN DEFAULT true
);
  `)
}

module.exports = {
  cleanUserTable,
  cleanTables,
}
