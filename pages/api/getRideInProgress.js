import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const id = req.body.params.id;

    const querySql = `SELECT * FROM ride WHERE rider_id = ? AND completed = 'false'`;
    const values = [id];
    const data = await query({ query: querySql, values: values }).then(
      async (result) => {
        const data = result[0];

        const querySql1 = "SELECT * FROM user WHERE id = ?";
        const values1 = [data.driver_id];
        await query({ query: querySql1, values: values1 }).then((result) => {
          res.status(200).json(result);
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
