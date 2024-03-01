import bcrypt from 'bcrypt'
import { Database } from '../clients/Database.js'
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
	 * @return {string}
	 */
	static async getDoorCode() {
		const dbClient = Database.getClient()

		const setting = await dbClient.setting.findUnique({
			where: {
				name: 'doorCode'
			}
		})

		return setting.value
	}


	/**
	 * Get user by username
	 *
	 * @param {string} username
	 * @return {obj|false} User object, if match; otherwise, error
	 */
	static async getUserByName( username ) {
		const dbClient = Database.getClient()

		const user = await dbClient.user.findUnique({
			where: {
				name: username
			}
		})

		return user ? user : false
	}


	/**
	 * Get user by ID
	 *
	 * @param {int} userId
	 * @return {obj|false} User object, if match; otherwise, error
	 */
	static async getUserById( id ) {
		const dbClient = Database.getClient()

		const user = await dbClient.user.findUnique({
			where: {
				id
			}
		})

		return user ? user : false
	}


	/**
	 * Create user
	 *
	 * @throws {Error} username contains invalid characters (must be solely alphanumeric)
	 * @throws {Error} username is blank or less than three characters ("rob" is three)
	 * @throws {Error} username matches preexisting user
	 * @throws {Error} password is blank or less than eight characters
	 *
	 * @todo Error if user wasn't created
	 *
	 * @param {string} username
	 * @param {string} password
	 *
	 * @return {string} Username
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
			throw new Error( `User already exists for name: "${username}." Did you already complete this step?` )
		}

		// time to create user
		const dbClient = Database.getClient()
		const hashedPassword = await bcrypt.hash( password, 10 )

		const user = await dbClient.user.create({
			data: {
				name: username,
				password: hashedPassword
			}
		})

		// todo -- log user creation error (e.g. Prisma had issue)
		return user.name
	}


	/**
	 * Super simple auth code validation
	 *
	 * @todo Add error logging
	 *
	 * @param {obj} req
	 * @param {string} username
	 * @param {string} password
	 *
	 * @return {<Promise>}
	 */
	static async validate( req, username, password ) {


		return new Promise( resolve => {

			// start with the easy stuff -- simple username check
			if( username !== process.env.LOCAL_AUTH_USERNAME ) {
				resolve( false )
			}

			bcrypt.compare( password, process.env.LOCAL_AUTH_PASSWORD, ( err, result ) => {
				// todo -- add error logging

				if( !result ) {
					resolve( false )
				} else {
					resolve({
						isValid: true,
						credentials: {
							user: username
						}
					})
				}
			})
		})
	}

}
