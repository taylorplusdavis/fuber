import mysql from "mysql2/promise";

export async function query({ query, values = [] }) {
  const db = await mysql.createConnection({
    host: "54.227.45.243",
    user: "newadminroot",
    port: 3306,
    password: "",
    database: "fuber",
  });

  try {
    const [results] = await db.execute(query, values);
    db.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    return { error };
  }
}
