const jsonwebtoken = require("jsonwebtoken");
const JWT_SECRET = 'a<*ZqIAy[_.}<Q{v:SU$\'%ca^N<Es$jwfD,B>IZ\'4@l0~o`Mk7E/?N/^hW#lw>q';
const dataHelper = require('../helpers/initial-user-category');
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

exports.createUser = (db) => {
  return async (req, res) => {
    const { name, password } = req.body;
    console.log('create user: ', name);

    const authCollection = db.collection('auth');
    const existingUser = await authCollection.findOne({ name });

    if (existingUser) {
      return res
        .status(401)
        .json({ message: "The username already exists" });
    }

    let hash;
    try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      hash = await bcrypt.hash(password, salt);
    } catch(e) {
      return res
        .status(401)
        .json({ message: "Password hashing failure" });
    }

    const response = await authCollection.insertOne({ name, password: hash });
    const userId = response.insertedId.toString();

    await db.createCollection(`z_${userId}`);
    await db.collection(`z_${userId}`).insertMany(dataHelper.createInitialCategoryStatus());
    await db.collection('users').insertOne(dataHelper.newUserObj(userId));

    return res.json({
      token: jsonwebtoken.sign({ userName: name, userId }, JWT_SECRET),
    });
  }
}

exports.loginUser = (db) => {
  return async (req, res) => {
    const { name, password } = req.body;
    console.log('login user: ',  name);

    const authCollection = db.collection('auth');
    const existingUser = await authCollection.findOne({ name });

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "The username does not exist" });
    }
    try {
      await bcrypt.compare(password, existingUser.password)
    } catch(e) {
      return res
        .status(401)
        .json({ message: "Wrong password" });
    }

    const userName = existingUser.name;
    const userId = existingUser._id.toString();

    return res.json({
      token: jsonwebtoken.sign({ userName, userId }, JWT_SECRET),
    });
  }
}

exports.routeGuard = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Not Authorized" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { userName, userId } = jsonwebtoken.verify(token, JWT_SECRET);
    console.log(`Hi ${userName}!`);
    return userId;
  } catch (error) {
    return res.status(401).json({ error: "Not Authorized" });
  }
}
