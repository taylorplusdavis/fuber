const mysql = require("mysql");
const db = mysql.createConnection({
  host: "54.227.45.243",
  user: "newadminroot",
  port: 3306,
  password: "",
  database: "fuber",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySQL Connected...");
  }
});

module.exports = db;
