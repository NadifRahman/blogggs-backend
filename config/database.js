const mongoose = require('mongoose');
const dotenv = require('dotenv');

require('dotenv').config(); //import env variables

mongoose.set('strictQuery', false);

const mongoDB = process.env.MONGODB_URI; //MUST HAVE DATABASE IN ENV

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log('Database connected');
}
