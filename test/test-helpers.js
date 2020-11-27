function cleanTables(db) {
  return db.raw(`TRUNCATE users`)
}

module.exports = {
  cleanTables,
}
