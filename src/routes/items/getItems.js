import { Grocer } from '../../controllers/Grocer.js'


export const getItems = {
	method: 'GET',
	path: '/items/get',
	options: {
		auth: 'simple',
	},
	async handler( req, h ) {
		const { id: userId } = req.auth.credentials

		try {
			const rawItems = await Grocer.getItems( userId )

			// Hapi likes a nice, clean array of objects
			const items = Array.from( rawItems, ( [ key, value ] ) => {
				return {
					id: key,
					name: value,
				}
			})

			return {
				status: 'success',
				meta: {
					count: items.length,
				},
				items
			}

		} catch ( err ) {
			return h.response({
				status: 'error',
				message: err.message
			}).code( 400 )
		}
	}
}
