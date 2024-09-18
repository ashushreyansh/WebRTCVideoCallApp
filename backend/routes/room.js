const express = require('express');
const router = express.Router();
const Room = require('../models/room');

// Create room
router.post('/create-room', async (req, res) => {
  const { roomId } = req.body;
  const room = new Room({ roomId, users: [] });
  await room.save();
  res.json({ success: true, roomId });
});

module.exports = router;
