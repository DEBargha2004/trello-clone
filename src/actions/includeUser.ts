'use server'

import { currentUser } from '@clerk/nextjs'
import { User } from '@clerk/nextjs/server'
import { db } from '../lib/db'
import { UserData } from '@/types/user'

/**
 * This function includes a user by retrieving their information from the database or adding them if they do not exist.
 *
 * @return {object} An object containing the user's information including their user ID, first name, last name, and email.
 */
export default async function includeUser () {
  const userInfo: User | null = await currentUser()

  if (!userInfo?.id) return {}

  const userDataFromDatabase: UserData[] = await checkUser(userInfo.id)
  // console.log(userFromDatabase)
  if (userDataFromDatabase.length) {
    return {
      user_id: userDataFromDatabase[0]?.user_id,
      firstname: userDataFromDatabase[0]?.firstname,
      lastname: userDataFromDatabase[0]?.lastname,
      email: userDataFromDatabase[0]?.email
    }
  } else {
    const userDataFromDatabase: UserData[] = await addUser({
      id: userInfo?.id,
      firstname: userInfo.firstName,
      lastname: userInfo.lastName,
      email: userInfo.emailAddresses[0].emailAddress
    })

    return {
      user_id: userDataFromDatabase[0]?.user_id,
      firstname: userDataFromDatabase[0]?.firstname,
      lastname: userDataFromDatabase[0]?.lastname,
      email: userDataFromDatabase[0]?.email
    }
  }
}

/**
 * Retrieves user information from the database based on the provided ID.
 *
 * @param {string} id - The ID of the user to retrieve information for.
 * @returns {Array<any>} An array containing the user information, or an empty array if the user was not found.
 */
async function checkUser (id: string) {
  try {
    // console.log(connectionInstance.config)

    const result = await db.execute(`SELECT * FROM users WHERE user_id = ?`, [
      id
    ])
    // console.log(result)

    return result.rows
  } catch (error) {
    console.log(error)
    return []
  }
}

/**
 * Adds a new user to the database.
 *
 * @param {Object} user - The user object containing the user's id, firstname, lastname, and email.
 *   - {string} id - The unique id of the user.
 *   - {string} firstname - The first name of the user.
 *   - {string} lastname - The last name of the user.
 *   - {string} email - The email address of the user.
 * @return {Promise<number>} - A promise that resolves to the number of rows affected by the insert operation.
 */
async function addUser ({
  id,
  firstname,
  lastname,
  email
}: {
  id: string
  firstname: string
  lastname: string
  email: string
}) {
  try {
    const { rows } = await db.execute(
      `INSERT INTO users (user_id,firstname,lastname,email) VALUES (?,?,?,?)`,
      [id, firstname, lastname, email]
    )
    // await connectionInstance.end()

    return rows
  } catch (error) {
    console.log(error)
    return []
  }
}
