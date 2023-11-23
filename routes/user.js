const auth = require("./auth");

exports.getUser = (db) => {
  return async (req, res) => {
    const id = auth.routeGuard(req, res);

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ id });

    delete user._id;

    res.type("json");
    res.send(user);
  }
}

exports.updateUser = (db) => {
  return async (req, res) => {
    const id = auth.routeGuard(req, res);
    const { update } = req.body;

    delete update.id;
    delete update.name;
    delete update.points;
    delete update.previousPoints;

    const result = await db.collection("users").findOneAndUpdate(
      { id },
      { $set: update },
      { returnDocument: 'after' }
    );

    const user = result.value;
    delete user._id;

    res.type("json");
    res.send(user);
  }
}
