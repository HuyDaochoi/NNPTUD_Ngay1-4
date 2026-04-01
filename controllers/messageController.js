const Message = require('../schemas/messages');
const mongoose = require('mongoose');

module.exports = {
    // 1. Gửi tin nhắn
    createMessage: async (req, res) => {
        try {
            const { from, to, text, isFile } = req.body;
            const newMessage = await Message.create({
                from,
                to,
                messageContent: {
                    type: isFile ? 'file' : 'text',
                    text: text
                }
            });
            res.status(201).json(newMessage);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // 2. Lấy toàn bộ lịch sử chat giữa 2 người
    getChatHistory: async (req, res) => {
        try {
            const { currentUser } = req.query;
            const { userID } = req.params;
            const chatHistory = await Message.find({
                $or: [
                    { from: currentUser, to: userID },
                    { from: userID, to: currentUser }
                ]
            }).sort({ createdAt: 1 });
            res.json(chatHistory);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    // 3. Lấy tin nhắn cuối cùng của mỗi cuộc hội thoại
    getLastMessages: async (req, res) => {
        try {
            const { currentUser } = req.query;
            const lastMessages = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { from: new mongoose.Types.ObjectId(currentUser) },
                            { to: new mongoose.Types.ObjectId(currentUser) }
                        ]
                    }
                },
                { $sort: { createdAt: -1 } },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $gt: ["$from", "$to"] },
                                { from: "$from", to: "$to" },
                                { from: "$to", to: "$from" }
                            ]
                        },
                        lastMsg: { $first: "$$ROOT" }
                    }
                }
            ]);
            res.json(lastMessages);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
};