const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    access_token: {
      type: String,
      required: true
    },
    access_token_validity: {
      type: Number,
      required: true
    },
    refresh_token: {
      type: String,
      required: true
    },
    refresh_token_validity: {
      type: Number,
      required: true
    },
  }, {timestamps: true})

module.exports = mongoose.model('Token', tokenSchema)



// const mongoose = require('mongoose');
// const tokenSchema = new mongoose.Schema({
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     access_token: {
//         type: String,
//         required: true
//     },
//     refresh_token: {
//         type: String,
//         required: true
//     }
    
// }, 
// {
//     timestamps: true
// }
// )

// module.exports = mongoose.model('Token', tokenSchema)