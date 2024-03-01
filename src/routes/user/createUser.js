import { Bouncer } from '../../controllers/Bouncer.js'


export const createUser = {
	method: 'POST',
	path: '/user/create',
	async handler( req, h ) {
		const { username, password, doorCode } = req.payload

		// first, check if super secret passphrase matches setting in DB
		const realDoorCode = await Bouncer.getDoorCode()
		if( doorCode !== realDoorCode ) {
			return h.response({
				status: 'error',
				message: 'Invalid door code. Please try again.'
			}).code( 401 )
		}

		// now, try to create user based on username and password
		try {
			const newUserName = await Bouncer.createUser( username, password )

			return {
				status: 'success',
				message: `User successfully created for: "${newUserName}."`
			}

		} catch ( err ) {
			return h.response({
				status: 'error',
				message: err.message,
			}).code( 400 )
		}
	}
}
