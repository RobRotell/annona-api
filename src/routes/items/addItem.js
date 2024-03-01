import Joi from 'joi'
import * as Hoek from '@hapi/hoek'
import { Grocer } from '../../controllers/Grocer.js'


const validator = Joi.object({
	name: Joi.string().default( '' ).trim().min( 3 ).max( 140 ).required().messages({
		'any.required': 'The name of the grocery item must be provided.',
		'string.empty': 'The name of this item must be between three and 140 characters long.',
		'string.min': 'The name of this item must be between three and 140 characters long.',
		'string.max': 'The name of this item must be between three and 140 characters long.',
	})
})


export const addItem = {
	method: 'POST',
	path: '/items/add',
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
		let { name: itemName } = req.payload

		// todo -- fix issue with escaping HTML potentially exceeding length
		itemName = Hoek.escapeHtml( itemName )

		try {
			const addedItem = await Grocer.addItem( userId, itemName )

			return {
				status: 'success',
				meta: {
					count: 1 // todo -- support for adding multiple items at once
				},
				items: [ addedItem ],
			}

		} catch ( err ) {
			return h.response({
				status: 'error',
				message: err.message,
			}).code( 400 )
		}
	}
}
