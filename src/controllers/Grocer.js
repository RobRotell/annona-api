import { Bouncer } from './Bouncer.js'
import { prisma } from '../clients/Database.js'


export class Grocer {

	/**
	 * Get all grocery items
	 *
	 * Not responsible for ensuring user exists.
	 *
	 * @param {int} userId
	 * @return {Map}
	 */
	static async getItems( userId ) {
		const items = new Map

		const records = await prisma.groceryItem.findMany({
			where: {
				userId
			}
		})

		// casting them to a map helps with sorting by ID (we might remove this when we implement sorting)
		records.forEach( ({ id, name }) => {
			items.set( id, name )
		})

		return items
	}


	/**
	 * Create new grocery item
	 *
	 * @todo add logging when item couldn't be added (e.g. issue with Prisma)
	 *
	 * @throws {Error} invalid user
	 * @throws {Error} item name is not between three and 140 characters
	 *
	 * @param {int} userId
	 * @param {string} itemName
	 *
	 * @return {object} Item ID and name
	 */
	static async addItem( userId, itemName ) {

		// confirm user exists
		const user = await Bouncer.getUserById( userId )

		if( !user ) {
			throw new Error( 'Item cannot be added for user as user does not exist.' )
		}

		// is item name valid?
		if( 'string' !== typeof itemName || 3 > itemName.length || 140 < itemName.length ) {
			throw new Error( 'Item must be between three and 140 characters long.' )
		}

		// check if item was already added
		const preexistingItem = await prisma.groceryItem.findMany({
			where: {
				name: itemName,
				userId
			}
		})

		// if item already exists, just use that (should only be one)
		if( preexistingItem.length ) {
			return {
				id: preexistingItem[0].id,
				name: preexistingItem[0].name,
			}
		}

		// todo -- add logging in case record wasn't added
		const newItem = await prisma.groceryItem.create({
			data: {
				name: itemName,
				user: {
					connect: {
						id: userId,
					},
				},
			}
		})

		return {
			id: newItem.id,
			name: newItem.name,
		}
	}


	/**
	 * Delete grocery item
	 *
	 * @todo Support for passing item name?
	 *
	 * @param {number} id
	 * @return {bool} True, if record was deleted. False, if record didn't exist
	 */
	static async deleteItem( id ) {
		// check if record exists
		// if so, return false
		// otherwise, delete record
		// set last modified date
		// return true
	}

}
