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
    "INSERT INTO user(name, email, password, intent, active) VALUES(?,?,?,?, false)",
    [name, email, password, intent],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
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
  const lat = req.body.params.lat;
  const lng = req.body.params.lng;

  db.query(
    `UPDATE user SET lat = ?, lng = ? WHERE id = ?`,
    [lat, lng, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated in user");
      }
    }
  );
});

app.post("/api/requestRide", (req, res) => {
  const riderId = req.body.params.id;

  db.query(
    "SELECT * FROM ride WHERE rider_id = ? AND completed = 'false'",
    riderId,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result.length === 0) {
          db.query(
            "INSERT INTO ride(rider_id, completed) VALUES(?, 'false')",
            riderId,
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                res.send("Ride Requested");
              }
            }
          );
        } else {
          res.send(false);
        }
      }
    }
  );
});

app.post("/api/getReview", (req, res) => {
  const id = req.body.params.id;
  db.query(
    `SELECT * FROM review WHERE receiver_id = ?`,
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/api/rideStatus", (req, res) => {
  const id = req.body.params.id;
  db.query(
    `SELECT * FROM ride WHERE rider_id = ? AND completed = 'false'`,
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else res.send(result);
    }
  );
});

app.post("/api/getRideInProgress", (req, res) => {
  const id = req.body.params.id;
  db.query(
    `SELECT * FROM ride WHERE rider_id = ? AND completed = 'false'`,
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const data = result[0];
        db.query(
          "SELECT * FROM user WHERE id = ?",
          [data.driver_id],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send(result);
            }
          }
        );
      }
    }
  );
});

app.post("/api/checkComplete", (req, res) => {
  const id = req.body.params.id;
  db.query(
    `SELECT * FROM ride WHERE rider_id = ? AND completed = 'false'`,
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/api/submitReview", (req, res) => {
  const id = req.body.params.id;
  const rating = req.body.params.rating;
  const feedback = req.body.params.feedback;
  const intent = req.body.params.intent;

  db.query(
    `SELECT * from ride WHERE ${
      intent === "rider" ? "rider_id" : "driver_id"
    } = ? AND completed = 'false'`,
    [id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const data = result[0];
        db.query(
          `INSERT INTO review(rating, review, receiver_id, giver_id) VALUES(?,?,?,?)`,
          [
            rating,
            feedback,
            intent === "rider" ? data.driver_id : data.rider_id,
            intent === "rider" ? data.rider_id : data.driver_id,
          ],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              db.query(
                `UPDATE ride SET completed = 'true' WHERE rider_id = ?`,
                [id],
                (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log("Ride Completed");
                  }
                }
              );
              res.send("Review Submitted");
            }
          }
        );
      }
    }
  );
});

app.post("/api/getOpenRides", (req, res) => {
  db.query(`SELECT * FROM ride WHERE driver_id IS NULL`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/api/acceptRide", (req, res) => {
  const driverId = req.body.params.driverId;
  const rideId = req.body.params.rideId;

  db.query(
    `UPDATE ride SET driver_id = ? WHERE id = ?`,
    [driverId, rideId],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Ride Accepted");
      }
    }
  );
});

app.post("/api/dropoff", (req, res) => {
  const rideId = req.body.params.rideId;
  db.query(
    `UPDATE ride SET ride.continue = 'true' WHERE id = ?`,
    rideId,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Ride Dropped Off");
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
