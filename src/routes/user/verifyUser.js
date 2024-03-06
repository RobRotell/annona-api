import Joi from 'joi'
import { Bouncer } from '../../controllers/Bouncer.js'


const validator = Joi.object({
	username: Joi.string().default( '' ).trim().min( 3 ).required(),
	password: Joi.string().default( '' ).trim().min( 8 ).required(),
})


export const verifyUser = {
	method: 'POST',
	path: '/user/verify',
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
		const { username, password } = req.payload

		const user = await Bouncer.verify( username, password )

		if( user ) {
			return {
				status: 'success',
			}
		} else {
			return h.response({
				status: 'error',
				message: 'Authentication failed. Do I know you?'
			}).code( 401 )
		}
	}
}
