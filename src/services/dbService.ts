import pool from '../config/db.config';

export async function query<T>(sql: string, params?: any[]): Promise<T[]> {
  try {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  } catch (err) {
    console.error('DB query error:', { sql, params, err });
    throw err;
  }
}

export async function transaction<T>(
  queries: Array<{ sql: string; params?: any[] }>
): Promise<T [][]>{
  const connection = await pool.getConnection().catch((err) => {
    throw new Error('DB connection failed: ' + err);
  });

  const results: T[][] = [];

  try {
    await connection.beginTransaction();

    for (const q of queries) {
      const [rows] = await connection.query(q.sql, q.params);
      results.push(rows as T[]);
    }

    await connection.commit();
    return results;
  } catch (err) {
    console.error('Transaction failed:', err);
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}
