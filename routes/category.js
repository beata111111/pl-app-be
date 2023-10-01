const auth = require("./auth");
const categoryHelperDB = require("./../helpers/category-helper-db");
const categoryHelperClient = require("./../helpers/category-helper-client");
const dbConfig = require("./../config/db.config");

exports.geCategory = (db) => {
  return async (req, res) => {
    const id = auth.routeGuard(req, res);

    const zCollection = db.collection(`z_${id}`);
    const categories = await zCollection
      .find()
      .sort({ position: 1 })
      .project({ _id: 0 })
      .limit(1000)
      .toArray();

    const adjustedCategories = categories.map(c => categoryHelperClient.adjustCategory(c));

    res.json(adjustedCategories);
  }
}

exports.updateCategory = (client, db) => {
  return async (req, res) => {

    const id = auth.routeGuard(req, res);
    const { category_id } = req.body;

    async function saveCategory(session, categoryUpdate) {
      await db.collection(`z_${id}`).updateOne(
          { category_id },
          { $set: { levels: categoryUpdate.levels } },
          { session }
      );
    }

    async function saveUser(session, pointsUpdate) {
      await db.collection("users").updateOne(
          { id },
          { $set: pointsUpdate },
          { session }
      );
    }

    const user = await db.collection("users").findOne({ id });
    const category = await db.collection(`z_${id}`).findOne({ category_id });

    const [dbCategoryUpdate, pointDelta] = categoryHelperDB.updateCategoryDB(category, req.body);
    const userPointsUpdate = { previousPoints: user.points, points: user.points + pointDelta };

    const session = client.startSession();
    try {
      session.startTransaction(dbConfig.transactionOptions);
      await saveUser(session, userPointsUpdate);
      await saveCategory(session, dbCategoryUpdate);
      await session.commitTransaction();
      console.log('Transaction successfully committed.');

      const categoryUpdate = categoryHelperClient.adjustCategory(dbCategoryUpdate);
      return res.json({ categoryUpdate, userPointsUpdate });

    } catch (error) {
      console.log('An error occured in the transaction, performing a data rollback:' + error);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
