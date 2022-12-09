import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const driverId = req.body.params.driverId;
    const rideId = req.body.params.rideId;

    const querySql = `UPDATE ride SET driver_id = ? WHERE id = ?`;
    const values = [driverId, rideId];
    const data = await query({ query: querySql, values: values });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
