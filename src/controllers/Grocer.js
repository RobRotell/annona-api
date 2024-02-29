import { Database } from '../clients/Database.js'


export class Grocer {

	/**
	 * Get all grocery items
	 *
	 * @return {Map}
	 */
	static async getItems() {
		const items = new Map
		const database = Database.getClient()

		const records = await database.groceryItems.findMany()

		// casting them to a map helps with sorting by ID
		records.forEach( ({ id, name: itemName }) => {
			items.set( id, itemName )
		})

		return items
	}


	/**
	 * Create new grocery item
	 *
	 * @param {string} name
	 * @return {object} Item ID and name
	 */
	static async addItem( name ) {
		// find if item was already added
		// if so, return that record
		// otherwise, add record
		// set last modified date

		// return record
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
