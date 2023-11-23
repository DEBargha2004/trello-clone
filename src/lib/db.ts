import * as sql from 'mysql2/promise'

/**
 * Creates a database connection and returns a promise that resolves
 * to a sql.Connection object.
 *
 * @return {Promise<sql.Connection>} A promise that resolves to a
 * sql.Connection object.
 */
export const connection = (): Promise<sql.Connection> => {
  try {
    const connection = sql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
      idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    })

    return connection
  } catch (error) {
    console.log(`Error: ${error}`)
    throw error
  }
}
