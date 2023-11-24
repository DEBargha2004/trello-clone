import { connect, Client } from '@planetscale/database'

const config = {
  host: process.env.PLANETSCALE_DB_HOST,
  username: process.env.PLANETSCALE_DB_USERNAME,
  password: process.env.PLANETSCALE_DB_PASSWORD
}

export const db = connect(config)

export const client = new Client(config)
