const auth = require("./auth");
const userCategoryHelper = require("./../helpers/user-category-update");
const dailyUpdate = require("./../helpers/user-category-time-update");

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

    const updatedItems = dailyUpdate.updateCategories(items);

    res.type("json");
    res.send(updatedItems);
  }
}

exports.updateUserCategoryStatus = (client, db) => {
  return async (req, res) => {

    const id = auth.routeGuard(req, res);
    const { category_id } = req.body;

    async function getUser() {
      return await db.collection("users").findOne({ id });
    }

    async function getCategory() {
      return await db.collection(`z_${id}`).findOne({ category_id });
    }

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

    const user = await getUser();
    const category = await getCategory();

    const [categoryUpdate, pointDelta] = userCategoryHelper.updateUserCategory(category, req.body);
    const userPointsUpdate = { previousPoints: user.points, points: user.points + pointDelta };

    const session = client.startSession();

    const transactionOptions = {
      readConcern: {level: 'snapshot'},
      writeConcern: {w: 'majority'},
      readPreference: 'primary'
    };
    try {
      session.startTransaction(transactionOptions);
      await saveUser(session, userPointsUpdate);
      await saveCategory(session, categoryUpdate);
      await session.commitTransaction();
      console.log('Transaction successfully committed.');
      return res.json({ categoryUpdate, userPointsUpdate });

    } catch (error) {
      // if (error instanceof MongoError && error.hasErrorLabel('UnknownTransactionCommitResult')) {
      // } else if (error instanceof MongoError && error.hasErrorLabel('TransientTransactionError')) {
      // } else {
        console.log('An error occured in the transaction, performing a data rollback:' + error);
      // }
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}


