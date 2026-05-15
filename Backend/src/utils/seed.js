// ======================== Seed Script ========================
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../modules/admin/model");
const Transaction = require("../modules/transaction/model");
const Goal = require("../modules/goal/model");
const appUtils = require("./appUtils");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/wealthmethod";

console.log("🌱 Starting seeding process...");

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB.");
    // Clear existing data
    return Promise.all([
      Admin.deleteMany({}),
      Transaction.deleteMany({}),
      Goal.deleteMany({})
    ]);
  })
  .then(() => {
    console.log("Cleared existing collections.");

    // Create Admin User
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPwdInfo = appUtils.generateSaltAndHashForPassword(adminPassword);
    
    return new Admin({
      firstname: "Super",
      lastname: "Admin",
      email: adminEmail,
      phone: "1234567890",
      ...adminPwdInfo,
      adminType: 1,
      preferredCurrency: "INR",
    }).save();
  })
  .then((admin) => {
    console.log(`Created Admin: ${admin.email}`);

    // Create Demo User
    const demoPwdInfo = appUtils.generateSaltAndHashForPassword("demo1234");
    return new Admin({
      firstname: "John",
      lastname: "Doe",
      email: "john@demo.com",
      phone: "9876543210",
      ...demoPwdInfo,
      adminType: 2,
      preferredCurrency: "INR",
    }).save();
  })
  .then((demoUser) => {
    console.log("Created Demo User: john@demo.com");

    // Add Sample Goals
    const goals = [
      {
        userId: demoUser._id,
        title: "Emergency Fund",
        targetAmount: 500000,
        currentAmount: 150000,
      },
    ];

    // Add Sample Transactions
    const now = new Date();
    const transactions = [
      {
        userId: demoUser._id,
        amount: 85000,
        type: "income",
        category: "Salary",
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        note: "Monthly Salary",
      },
    ];

    return Promise.all([
      Goal.insertMany(goals),
      Transaction.insertMany(transactions)
    ]);
  })
  .then(() => {
    console.log("Added sample goals and transactions.");
    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  });
