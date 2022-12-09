import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const id = req.body.params.id;

    const querySql = `SELECT * FROM ride WHERE driver_id = ? AND ride.continue = 'false'`;
    const values = [id];
    const data = await query({ query: querySql, values: values });
    if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(200).json(false);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
