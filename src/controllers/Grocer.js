import { Bouncer } from './Bouncer.js'
import { database } from '../clients/database.js'


export class Grocer {


	/**
	 * Get specific item
	 *
	 * Not responsible for ensuring user exists.
	 *
	 * @param {number} userId
	 * @param {number} itemId
	 * @return {Promise<object|null>} object, if exists; otherwise, null
	 */
	static async getItem( userId, itemId ) {
		const record = await database.groceryItem.findFirst({
			where: {
				id: itemId,
				userId
			}
		})

		// Prisma will return null if no record matches
		return record
	}


	/**
	 * Get all grocery items
	 *
	 * Not responsible for ensuring user exists.
	 *
	 * @param {number} userId
	 * @return {Promise<Map>}
	 */
	static async getItems( userId ) {
		const items = new Map

		const records = await database.groceryItem.findMany({
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
	 * Item should ALREADY be sanitized.
	 *
	 * @todo add logging when item couldn't be added (e.g. issue with Prisma)
	 *
	 * @throws {Error} invalid user
	 * @throws {Error} item name is not between three and 140 characters
	 *
	 * @param {number} userId
	 * @param {string} itemName
	 *
	 * @return {Promise<object>} Item ID and name
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
		const preexistingItem = await database.groceryItem.findMany({
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
		const newItem = await database.groceryItem.create({
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
	 * @todo support for passing multiple item IDs?
	 *
	 * @throws {Error} user ID does not match user
	 * @throws {Error} item ID is not a number
	 *
	 * @param {number} userId
	 * @param {number} itemId
	 *
	 * @return {Promise<boolean>} True, if record was deleted. False, if record didn't exist
	 */
	static async deleteItem( userId, itemId ) {
		const user = await Bouncer.getUserById( userId )

		if( !user ) {
			throw new Error( 'Item cannot be deleted for user as user does not exist.' )
		}

		// ensure itemId is an integer
		if( 'number' !== typeof itemId || !Number.isInteger( itemId ) ) {
			throw new Error( 'Item ID must be an integer.' )
		}

		// does record even exist?
		const item = await Grocer.getItem( userId, itemId )

		// if it doesn't, then just return true
		if( !item ) {
			return true
		}

		// otherwise, try to delete item
		try {
			await database.groceryItem.delete({
				where: {
					id: itemId,
					userId,
				}
			})

			return true

		} catch ( err ) {
			throw new Error( `Failed to delete item with ID: "${itemId}"` )
		}
	}

}
