const { Schema, model } = require('mongoose');
const Memory= require('./Memory.model')


const userSchema = new Schema({
  username: String,
  email: {
    type: String,
    required: [true, 'Email is required.'],
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    unique: true,
    lowercase: true,
    trim: true
    },  
  password: String,
  memories: [{type: Schema.Types.ObjectId, ref: "Memory"}]
},
{
  timestamps: true
});


module.exports = model('User', userSchema);
