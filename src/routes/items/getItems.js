import { Grocer } from '../../controllers/Grocer.js'
import { TimeKeeper } from '../../controllers/Timekeeper.js'


export const getItems = {
	method: 'GET',
	path: '/get',
	options: {
		auth: 'simple',
	},
	async handler( req, h ) {
		const rawItems = await Grocer.getItems()

		// Hapi likes a nice, clean array of objects
		const items = Array.from( rawItems, ( [ key, value ] ) => {
			return {
				id: key,
				name: value,
			}
		})

		// report when items were last updated
		const lastModified = await TimeKeeper.getLastModifiedDate()

		return {
			meta: {
				count: items.length,
				lastModified,
			},
			items
		}
	}
}
