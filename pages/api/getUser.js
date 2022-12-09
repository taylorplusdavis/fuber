import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const email = req.body.params.email;
    const querySql = "SELECT * FROM user WHERE email = ?";
    const values = [email];
    const data = await query({ query: querySql, values: values });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
