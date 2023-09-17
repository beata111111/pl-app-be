const auth = require("./auth");
const userCategoryHelper = require("./../helpers/user-category-update");

exports.getUserCategoryStatus = (db) => {
  return async (req, res) => {
    const id = auth.routeGuard(req, res);

    const zCollection = db.collection(`z_${id}`);
    const items = await zCollection
      .find()
      .sort({ position: 1 })
      .project({ _id: 0 })
      .limit(1000)
      .toArray();

    res.type("json");
    res.send(items);
  }
}

exports.updateUserCategoryStatus = (db) => {
  return async (req, res) => {
    const id = auth.routeGuard(req, res);

    const { category_id } = req.body;

    const category = await db.collection(`z_${id}`).findOne({ category_id });

    const updatedCategory = userCategoryHelper.updateUserCategory(category, req.body);

    await db.collection(`z_${id}`).updateOne(
      { category_id },
      { $set: { levels: updatedCategory.levels } }
    );

    res.type("json");
    res.send(updatedCategory);
  }
}
