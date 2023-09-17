exports.getWords = (db) => {
  return async (req, res) => {
    const {category_id, level_id} = req.query;

    if (category_id && level_id) {
      const words = await db.collection('words')
        .find({
          $and: [
            {category_id: {$eq: category_id}},
            {level_id: {$eq: Number(level_id)}},
          ]
        })
        .toArray();

      return res.json(words);
    }
  }
}
