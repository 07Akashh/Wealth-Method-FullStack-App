// ======================== Transaction Facade ========================
const transactionService = require("./service");
const appUtils = require("../../utils/appUtils");
const cusExc = require("../../customException");
const successMsg = require("../../success_msg.json");

const addTransaction = (userId, txData) => {
  return transactionService.insertOne({ ...txData, userId })
    .then(tx => ({ ...successMsg.transaction_create, transaction: tx }));
};

const getTransactions = (userId, query) => {
  const paginate = appUtils.pagination(query);
  const filter = { userId, isDeleted: false };
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;

  return Promise.all([
    transactionService.getManyWithSort(filter, {}, paginate, { date: -1 }),
    transactionService.countDocuments(filter),
  ]).then(([transactions, total]) => ({ transactions, total }));
};

const updateTransaction = (userId, txId, updateData) => {
  return transactionService.findOneAndUpdate({ _id: txId, userId, isDeleted: false }, updateData, { new: true })
    .then((transaction) => {
      if (!transaction) throw cusExc.completeCustomException("not_found", "Transaction not found.");
      return { ...successMsg.transaction_update, transaction };
    });
};

const deleteTransaction = (userId, txId) => {
  return transactionService.findOneAndUpdate({ _id: txId, userId, isDeleted: false }, { isDeleted: true }, { new: true })
    .then((transaction) => {
      if (!transaction) throw cusExc.completeCustomException("not_found", "Transaction not found.");
      return successMsg.transaction_delete;
    });
};

const getDashboardStats = (userId) => {
  return transactionService.getStats(userId).then((stats) => {
    let income = 0; let expense = 0;
    stats.forEach((s) => {
      if (s._id === "income") income = s.total;
      if (s._id === "expense") expense = s.total;
    });
    return { totalIncome: income, totalExpense: expense, balance: income - expense };
  });
};

const getInsights = (userId) => {
  return Promise.all([
    transactionService.getCategoryBreakdown(userId),
    transactionService.getWeeklyTrends(userId),
  ]).then(([breakdown, trends]) => {
    // Add percentage to breakdown
    const total = breakdown.reduce((sum, item) => sum + item.amount, 0);
    const enrichedBreakdown = breakdown.map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0
    }));

    // Format trends to include day labels (simplified for now)
    const dayLabels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const formattedTrends = trends.map(t => ({
      ...t,
      day: dayLabels[new Date(t.date).getDay()]
    }));

    // Mock comparison info for now (can be calculated by fetching previous week data)
    const comparison = {
      thisWeekTotal: total,
      lastWeekTotal: total * 0.9, // Mock
    };

    return { breakdown: enrichedBreakdown, trends: formattedTrends, comparison };
  });
};

/**
 * Bulk Sync Transactions from Mobile App
 * @param {String} userId 
 * @param {Array} transactionsList 
 */
const syncTransactions = (userId, transactionsList) => {
  if (!Array.isArray(transactionsList)) throw cusExc.getCustomErrorException("Invalid sync data.");

  const syncPromises = transactionsList.map((tx) => {
    const filter = { userId, syncId: tx.syncId };
    const update = { ...tx, userId, isDeleted: false };
    return transactionService.findOneAndUpdate(filter, update, { upsert: true, new: true });
  });

  return Promise.all(syncPromises)
    .then((results) => ({
      success: true,
      message: `${results.length} transactions synced successfully.`,
      syncedCount: results.length,
    }));
};

module.exports = { 
  addTransaction, 
  getTransactions, 
  updateTransaction, 
  deleteTransaction, 
  getDashboardStats,
  getInsights,
  syncTransactions
};
