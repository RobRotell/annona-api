import Joi from 'joi'
import { Bouncer } from '../../controllers/Bouncer.js'


const validator = Joi.object({
	username: Joi.string().default( '' ).trim().min( 3 ).required(),
	password: Joi.string().default( '' ).trim().min( 8 ).required(),
	doorCode: Joi.string().default( '' ).trim().required().messages({
		'string.empty': 'Knock, knock, who\'s there?',
	}),
})


export const createUser = {
	method: 'POST',
	path: '/user/create',
	options: {
		validate: {
			payload: validator.options({
				abortEarly: false,
			}),
			failAction( req, h, err ) {
				// todo -- fix '"value" must be of type object' error when passing no value at all
				return h.response({
					status: 'error',
					message: err.output.payload.message
				}).code( 400 ).takeover()
			},
		},
	},
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
