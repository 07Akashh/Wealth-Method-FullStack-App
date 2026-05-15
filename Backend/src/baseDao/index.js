module.exports = (dao) => ({
  getById: (id) => dao.findById(id),
  getOne: (query, projection = "") => dao.findOne(query, projection),
  getMany: (query, projection = {}, paginate = {}) =>
    dao.find(query, projection, paginate),
  getManyWithSort: (query, projection = {}, paginate = {}, sort = { _id: -1 }) =>
    dao.find(query, projection, paginate).sort(sort),
  insertOne: (data) => new dao(data).save(),
  insertMany: (data) => dao.insertMany(data),
  updateOne: (query, update, options = {}) => dao.updateOne(query, update, options),
  updateMany: (query, update, options = {}) => dao.updateMany(query, update, options),
  findOneAndUpdate: (query, update, options = { new: true }) =>
    dao.findOneAndUpdate(query, update, options),
  findByIdAndUpdate: (id, update, options = { new: true }) =>
    dao.findByIdAndUpdate(id, update, options),
  deleteOne: (query) => dao.deleteOne(query),
  deleteById: (id) => dao.findByIdAndDelete(id),
  countDocuments: (query = {}) => dao.countDocuments(query),
});
