import dotenv from "dotenv"
dotenv.config();
export default {
  development: {
    username: process.env.DB_USER || "jaikal",
    password: process.env.DB_PASS || "jeripatut",
    database: process.env.DB_NAME || "SocialAppss",
    host: process.env.DB_HOST || "mysql",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: false,
      connectTimeout: 10000,
      multipleStatements: true,
      supportBigNumbers: true,
      bigNumberStrings: true,
      decimalNumbers: true,
      dateStrings: true
    }
  },
  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "jeripatut",
    database: process.env.DB_NAME || "database_test",
    host: process.env.DB_HOST || "mysql",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: { ssl: false }
  },
  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "jeripatut",
    database: process.env.DB_NAME || "database_production",
    host: process.env.DB_HOST || "mysql",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: { ssl: false }
  }
};
