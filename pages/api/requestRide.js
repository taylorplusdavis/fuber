import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const id = req.body.params.id;

    const querySql =
      "SELECT * FROM ride WHERE rider_id = ? AND completed = 'false'";
    const values = [id];
    const data = await query({ query: querySql, values: values }).then(
      async (result) => {
        if (result.length === 0) {
          const querySql1 =
            "INSERT INTO ride(rider_id, completed) VALUES(?, 'false')";
          const values1 = [id];
          await query({ query: querySql1, values: values1 }).then(() => {
            res.status(200).json("Ride requested!");
          });
        }
      }
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
