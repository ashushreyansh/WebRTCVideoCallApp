const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  roomId: String,
  users: [String],
});

module.exports = mongoose.model('Room', RoomSchema);
