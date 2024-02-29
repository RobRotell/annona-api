import 'dotenv/config'
import Hapi from '@hapi/hapi'
import Basic from '@hapi/basic'

import { SimpleAuth } from './src/controllers/SimpleAuth.js'

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

	// one of these days, we'll beef this up
	await server.register( Basic )
	server.auth.strategy( 'simple', 'basic', {
		validate: SimpleAuth.validate
	})

	server.route( getItems )
	server.route( addItem )
	server.route( deleteItem )

	await server.start()
	console.log( 'Server running on %s', server.info.uri )
}


init()
