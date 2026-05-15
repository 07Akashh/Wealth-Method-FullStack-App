// ======================== Transaction Service ========================
const Transaction = require("./model");
const baseDao = require("../../baseDao");
const mongoose = require("mongoose");

module.exports = {
  ...baseDao(Transaction),
  
  /**
   * Get transaction statistics for a user
   */
  getStats: (userId) => {
    return Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), isDeleted: false } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);
  },

  /**
   * Get category breakdown for current month
   */
  getCategoryBreakdown: (userId) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return Transaction.aggregate([
      { 
        $match: { 
          userId: new mongoose.Types.ObjectId(userId), 
          isDeleted: false,
          type: "expense",
          date: { $gte: startOfMonth.toISOString() } 
        } 
      },
      {
        $group: {
          _id: "$category",
          amount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          category: "$_id",
          amount: 1,
          _id: 0
        }
      },
      { $sort: { amount: -1 } }
    ]);
  },

  /**
   * Get daily trends for last 7 days
   */
  getWeeklyTrends: (userId) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
          type: "expense",
          date: { $gte: sevenDaysAgo.toISOString() }
        }
      },
      {
        $addFields: {
          dateObj: { $dateFromString: { dateString: "$date" } }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateObj" } },
          amount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          date: "$_id",
          amount: 1,
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);
  }
};
