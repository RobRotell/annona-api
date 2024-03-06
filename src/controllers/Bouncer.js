import bcrypt from 'bcrypt'
import { database } from '../clients/Database.js'
import { stripSpecialChars } from '../utils/stripSpecialChars.js'


/**
 * Simple class to maintain users and keep 'em under control 😎
 *
 * @todo deleteUser method?
 *
 */
export class Bouncer {

	/**
	 * Get super secret door code
	 *
	 * @return {Promise<string>}
	 */
	static async getDoorCode() {
		const setting = await database.setting.findUnique({
			where: {
				name: 'doorCode'
			}
		})

		return setting.value
	}


	/**
	 * Get user by username
	 *
	 * Username should ALREADY be sanitized.
	 *
	 * @param {string} username
	 * @return {Promise<object|false>} User object, if match; otherwise, false
	 */
	static async getUserByName( username ) {
		const user = await database.user.findUnique({
			where: {
				name: username
			}
		})

		return user ? user : false
	}


	/**
	 * Get user by ID
	 *
	 * @param {number} userId
	 * @return {Promise<object|false>} User object, if match; otherwise, false
	 */
	static async getUserById( id ) {
		const user = await database.user.findUnique({
			where: {
				id
			}
		})

		return user ? user : false
	}


	/**
	 * Create user
	*
	 * @todo error if user wasn't created
	 *
	 * @throws {Error} username contains invalid characters (must be solely alphanumeric)
	 * @throws {Error} username is blank or less than three characters ("rob" is three)
	 * @throws {Error} username matches preexisting user
	 * @throws {Error} password is blank or less than eight characters
	 *
	 * @param {string} username
	 * @param {string} password
	 *
	 * @return {Promise<string>} Username
	 */
	static async createUser( username, password ) {

		// remove pesky special characters
		const strippedUsername = stripSpecialChars( username )
		if( username !== strippedUsername ) {
			throw new Error( 'Username must contain only letters and numbers.' )
		}

		// proper names are three or more characters long
		if( !username || 3 > username.length ) {
			throw new Error( 'Username must be three or more characters long.' )
		}

		// make it long. Make it strong
		if( !password || 8 > password.length ) {
			throw new Error( 'Password must be eight or more characters long.' )
		}

		// does user already exist?
		const preexistingUser = await Bouncer.getUserByName( username )

		if( preexistingUser ) {
			throw new Error( `User already exists for name: "${username}."` )
		}

		// time to create user
		const hashedPassword = await bcrypt.hash( password, 10 )

		const user = await database.user.create({
			data: {
				name: username,
				password: hashedPassword
			}
		})

		// todo -- log user creation error (e.g. Prisma had issue)
		return user.name
	}


	/**
	 * Verify that a user exists and password matches
	 *
	 * @param {string} username
	 * @param {string} password
	 *
	 * @return {Promise<object|false>} User object, if user matches; otherwise, false
	 */
	static async verify( username, password ) {

		// get user by username
		const user = await Bouncer.getUserByName( username )

		if( user ) {
			const passwordsMatch = await bcrypt.compare( password, user.password )

			if( passwordsMatch ) {
				return user
			}
		}

		return false
	}

}
