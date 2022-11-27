const express = require("express");
const db = require("./config/db");
const cors = require("cors");

const app = express();
const PORT = 3002;
app.use(cors());
app.use(express.json());

//Route to get all users
app.get("/api/getUsers", (req, res) => {
  db.query("SELECT * FROM user", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Route to get one rider by email
app.get("/api/getUser", (req, res) => {
  const email = req.query.email;
  db.query("SELECT * FROM user WHERE email = ?", email, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

//Route to add rider
app.post("/api/addUser", (req, res) => {
  const name = req.body.params.name;
  const email = req.body.params.email;
  const password = req.body.params.password;
  const intent = req.body.params.intent;

  let id;

  db.query(
    "INSERT INTO user(name, email, password, intent) VALUES(?,?,?,?)",
    [name, email, password, intent],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query(
          "SELECT * FROM user WHERE email = ?",
          [email],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              id = result[0].id;

              if (intent === "rider") {
                db.query(
                  "INSERT INTO user_rider(user_id, lat, lng, active) VALUES (?, 0, 0, true)",
                  [id],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.send("Values inserted into user_rider");
                    }
                  }
                );
              } else {
                db.query(
                  "INSERT INTO user_driver(user_id, lat, lng, active) VALUES (?, 0, 0, true)",
                  [id],
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    } else {
                      res.send("Values inserted into user_driver");
                    }
                  }
                );
              }
            }
          }
        );
      }
    }
  );
});

app.post("/api/signInUser", (req, res) => {
  const email = req.body.params.email;
  const password = req.body.params.password;

  db.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/api/updateLocation", (req, res) => {
  const id = req.body.params.id;
  const lat = req.body.params.location.lat;
  const lng = req.body.params.location.lng;
  const intent = req.body.params.intent;
  console.log(req.body.params);

  if (intent === "rider") {
    db.query(
      `UPDATE user_${intent} SET lat = ?, lng = ? WHERE user_id = ?`,
      [lat, lng, id],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send("Values updated in user_rider");
        }
      }
    );
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
