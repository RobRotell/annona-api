import Joi from 'joi'
import { Grocer } from '../../controllers/Grocer.js'


const validator = Joi.object({
	id: Joi.number().integer().required().messages({
		'any.required': 'The ID of the grocery item must be provided.',
		'number.base': 'The ID of the grocery item must be a number.',
	})
})


export const deleteItem = {
	method: 'DELETE',
	path: '/items/delete',
	options: {
		auth: 'simple',
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
		const { id: userId } = req.auth.credentials
		const { id: itemId } = req.payload

		try {
			await Grocer.deleteItem( userId, itemId )

			return {
				status: 'success',
				message: 'Item has been deleted.',
			}

		} catch ( err ) {
			return h.response({
				status: 'error',
				message: err.message,
			}).code( 400 )
		}
	}
}
