exports.getRecords = (db) => {
  return async (req, res) => {
    const records = await db.collection('records')
      .find()
      .sort({ points: -1 })
      .limit(5)
      .toArray();

    return res.json(records);
  }
}
