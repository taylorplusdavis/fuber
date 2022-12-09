import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const id = req.body.params.id;
    const querySql = `SELECT * FROM review WHERE receiver_id = ?`;
    const values = [id];
    const data = await query({ query: querySql, values: values });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
