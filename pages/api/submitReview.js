import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const id = req.body.params.id;
    const rating = req.body.params.rating;
    const feedback = req.body.params.feedback;
    const intent = req.body.params.intent;

    const querySql = `SELECT * FROM ride WHERE ${
      intent === "rider" ? "rider_id" : "driver_id"
    } = ? ORDER BY id DESC`;
    const values = [id];
    await query({ query: querySql, values: values }).then(async (result) => {
      const trip = result[0];
      console.log(trip);

      const querySql2 = `INSERT INTO review(rating, review, receiver_id, giver_id) VALUES(?,?,?,?)`;
      const values2 = [
        rating,
        feedback,
        intent === "rider" ? trip.driver_id : trip.rider_id,
        intent === "rider" ? trip.rider_id : trip.driver_id,
      ];

      await query({ query: querySql2, values: values2 }).then(async () => {
        const querySql3 = `UPDATE ride SET completed = 'true' WHERE rider_id = ?`;
        const values3 = [trip.rider_id];
        await query({ query: querySql3, values: values3 });

        res.status(200).json("Review submitted!");
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
