import { Bouncer } from '../controllers/Bouncer.js'


/**
 * Validate user
 *
 * @param {object} req Hapi request
 * @param {string} username
 * @param {string} password
 * @param {object} h Hapi response toolkit
 *
 * @return {Promise<boolean>} True, if user is valid; otherwise, false
 */
export const validateUserForReq = async ( req, username, password, h ) => {

	// get user by username
	const user = await Bouncer.verify( username, password )

	if( !user ) {
		return {
			isValid: false,
			response: h.response({
				status: 'error',
				message: 'Authentication failed. Do I know you?',
			}).code( 401 )
		}
	} else {
		return {
			isValid: true,
			credentials: {
				id: user.id,
				name: user.name,
			}
		}
	}
}
