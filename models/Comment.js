const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/*
- comments required an author and post connectiong thru an id
- they have a date_created which is by default when the doc. is created
- they have a comment string which can have a max character length of 250
*/

const CommentSchema = new Schema({
  author_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  post_id: { type: Schema.Types.ObjectId, required: true, ref: 'Post' },
  date_created: { type: Schema.Types.Date, required: true, default: Date.now },
  comment_string: { type: String, required: true, maxLength: 250 },
});

module.exports = mongoose.model('Comment', CommentSchema);
