// ======================== Goal Facade ========================
const goalService = require("./service");
const cusExc = require("../../customException");
const successMsg = require("../../success_msg.json");

const addGoal = (userId, goalData) => {
  return goalService.insertOne({ ...goalData, userId })
    .then(goal => ({ ...successMsg.goal_create, goal }));
};

const getGoals = (userId) => {
  return goalService.getMany({ userId, isDeleted: false }, {}, { sort: { priority: 1, createdAt: -1 } });
};

const updateGoal = (userId, goalId, updateData) => {
  return goalService.findOneAndUpdate({ _id: goalId, userId, isDeleted: false }, updateData, { new: true })
    .then((goal) => {
      if (!goal) throw cusExc.completeCustomException("not_found", "Goal not found.");
      return { ...successMsg.goal_update, goal };
    });
};

const deleteGoal = (userId, goalId) => {
  return goalService.findOneAndUpdate({ _id: goalId, userId, isDeleted: false }, { isDeleted: true }, { new: true })
    .then((goal) => {
      if (!goal) throw cusExc.completeCustomException("not_found", "Goal not found.");
      return successMsg.goal_delete;
    });
};

/**
 * Bulk Sync Goals from Mobile App
 * @param {String} userId 
 * @param {Array} goalsList 
 */
const syncGoals = (userId, goalsList) => {
  if (!Array.isArray(goalsList)) throw cusExc.getCustomErrorException("Invalid sync data.");

  const syncPromises = goalsList.map((goal) => {
    const filter = { userId, syncId: goal.syncId };
    const update = { ...goal, userId, isDeleted: false };
    return goalService.findOneAndUpdate(filter, update, { upsert: true, new: true });
  });

  return Promise.all(syncPromises)
    .then((results) => ({
      success: true,
      message: `${results.length} goals synced successfully.`,
      syncedCount: results.length,
    }));
};

module.exports = { addGoal, getGoals, updateGoal, deleteGoal, syncGoals };
