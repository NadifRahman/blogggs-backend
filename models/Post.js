const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
- titles have max char length of 25
- Text Content has max length of 4000 characters
- date_created is required and date the post was created
- last updated is not required, I might not even use it 
- Each post is hooked up with one author
- Each post is published (isPublished set to true) by default
*/

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 25 },
  text_content: { type: String, required: true, maxLength: 4000 },
  date_created: { type: Schema.Types.Date, required: true, default: Date.now },
  last_updated: { type: Schema.Types.Date },
  author_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  isPublished: { type: Boolean, required: true, default: true },
});

module.exports = mongoose.model('Post', PostSchema);
