const auth = require("./auth");

exports.getRecords = (db) => {
  return async (req, res) => {

    const id = auth.getId(req);

    let points = 0;
    let recordIndex = null;
    let userRecord = null;

    if (id) {
      const userRecord = await db.collection('records')
        .findOne({ id });

      points = userRecord?.points;
    }


    const records = await db.collection('records')
      .find()
      .sort({ points: -1 })
      .limit(5)
      .toArray();


    if (points) {
      recordIndex = await db.collection('records')
        .find({
          points: { $gte: points }
        })
        .count()

      userRecord = { recordIndex, points }
    }

    const result = {
      userRecord,
      records
    }

    return res.json(result);
  }
}
