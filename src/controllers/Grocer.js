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
	 *
	 * @return {obj|null} object, if exists; otherwise, null
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
	 * @throws {Error} invalid user
	 *
	 * @param {number} userId
	 * @return {Map}
	 */
	static async getItems( userId ) {

		// confirm user exists
		const user = await Bouncer.getUserById( userId )

		if( !user ) {
			throw new Error( 'Cannot get items for user as user does not exist.' )
		}

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
	 * Item name should ALREADY be sanitized.
	 *
	 * @todo add logging when item couldn't be added (e.g. issue with Prisma)
	 *
	 * @throws {Error} invalid user
	 * @throws {Error} item name is not between three and 140 characters
	 *
	 * @param {number} userId
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
	 * @throws {Error} invalid user
	 * @throws {Error} item ID is not a number
	 *
	 * @param {number} userId
	 * @param {number} itemId
	 *
	 * @return {bool} Always true
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


	/**
	 * Update specific item with new name
	 *
	 * Item name should ALREADY be sanitized.
	 *
	 * @todo logging for failed update queries
	 *
	 * @throws {Error} invalid user
	 * @throws {Error} preexisting grocery item does not exist
	 *
	 * @param {number} userId
	 * @param {number} itemId
	 * @param {string} itemNewName
	 *
	 * @return {obj} Item ID and name
	 */
	static async updateItem( userId, itemId, itemNewName ) {

		// confirm user exists
		const user = await Bouncer.getUserById( userId )

		if( !user ) {
			throw new Error( 'Item cannot be updated for user as user does not exist.' )
		}

		// confirm that item exists
		const item = await Grocer.getItem( userId, itemId )

		if( !item ) {
			throw new Error( 'Item cannot be updated as item does not exist.' )
		}

		// if item name already matches item, then just return that without making update
		if( itemNewName === item.name ) {
			return {
				id: item.id,
				name: item.name
			}
		}

		// todo -- logging for failed queries
		try {
			const updatedItem = await database.groceryItem.update({
				where: {
					id: itemId,
					userId,
				},
				data: {
					name: itemNewName,
				}
			})

			return {
				id: updatedItem.id,
				name: updatedItem.name,
			}

		} catch ( err ) {
			throw new Error( `Failed to rename item with ID: "${itemId}" with name: "${itemNewName}"` )
		}
	}

}
