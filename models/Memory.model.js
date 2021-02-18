const { Schema, model } = require('mongoose');


const memorySchema = new Schema({
  title: {
    type: String,
    required: [true, 'You must add a title to your memory']
  },
  imgName: String,
  imgPath: String,
  description: { type: String },
  //owner: String,//{ type: Schema.Types.ObjectId, ref: 'User' },//No supe como
})

module.exports = model('Memory', memorySchema);