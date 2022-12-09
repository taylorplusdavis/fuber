import { query } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const email = req.body.params.email;
    const name = req.body.params.name;
    const password = req.body.params.password;
    const intent = req.body.params.intent;

    const querySql =
      "INSERT INTO user(name, email, password, intent, active) VALUES(?,?,?,?, false)";
    const values = [name, email, password, intent];
    const data = await query({ query: querySql, values: values });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
