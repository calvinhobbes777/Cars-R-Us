const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = {
  async signup(parent, { newUser }, ctx, info) {
    console.log(newUser);
    const password = await bcrypt.hash(newUser.password, 10);
    const user = await ctx.db.mutation.createUser({
      data: { ...newUser, password }
    });

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user
    };
  },

  async login(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email: ${email}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid password");
    }

    return {
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
      user
    };
  }
};

module.exports = { auth };
