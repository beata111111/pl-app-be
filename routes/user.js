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
