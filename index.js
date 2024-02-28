import 'dotenv/config'
import Hapi from '@hapi/hapi'


import { getItems } from './src/routes/getItems.js'
import { addItem } from './src/routes/addItem.js'
import { deleteItem } from './src/routes/deleteItem.js'


/**
 * Kicks off server
 *
 * @return {void}
 */
const init = async () => {
	const server = Hapi.server({
		host: '127.0.0.1',
		port: process.env.PORT,
	})

	server.route( getItems )
	server.route( addItem )
	server.route( deleteItem )

	await server.start()
	console.log( 'Server running on %s', server.info.uri )
}


init()
