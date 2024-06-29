const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
- First name and last name are required and max length of 20
- Usernmame has max length of 15
- Hashed password has no limit but is required, will use other validation on register to limit character count
*/

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 20 },
  last_name: { type: String, required: true, maxLength: 20 },
  username: { type: String, required: true, maxLength: 15 },
  hashedPassword: {
    //max input password (before hashing) is 20, which will be validated in routes
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', UserSchema);
