import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const id = req.body.params.id;
    const lat = req.body.params.lat;
    const lng = req.body.params.lng;

    const querySql = `UPDATE user SET lat = ?, lng = ? WHERE id = ?`;
    const values = [lat, lng, id];
    const data = await query({ query: querySql, values: values });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
