import 'dotenv/config'
import Hapi from '@hapi/hapi'
import Basic from '@hapi/basic'

import { Bouncer } from './src/controllers/Bouncer.js'

import { getItems } from './src/routes/items/getItems.js'
import { addItem } from './src/routes/items/addItem.js'
import { deleteItem } from './src/routes/items/deleteItem.js'
import { createUser } from './src/routes/user/createUser.js'


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
		validate: Bouncer.validate
	})

	server.route( getItems )
	server.route( addItem )
	server.route( deleteItem )
	server.route( createUser )

	await server.start()
	console.log( 'Server running on %s', server.info.uri )
}


init()
