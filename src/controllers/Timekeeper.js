import { Database } from '../clients/Database.js'


export class TimeKeeper {

	static #settingsDbKey = 'lastModifiedDate'

	/**
	 * Get date on which last action occurred
	 *
	 * @return {string}
	 */
	static async getLastModifiedDate() {
		const dbClient = Database.getClient()

		let record = await dbClient.settings.findUnique({
			where: {
				name: TimeKeeper.#settingsDbKey
			}
		})

		// if timestamp option doesn't already exist, create it
		if( !record ) {
			await TimeKeeper.setLastModifiedDate()

			record = TimeKeeper.getLastModifiedDate()
		}

		return parseInt( record.value, 10 )
	}


	/**
	 * Set date on which last action occurred
	 *
	 * @param {number} timestamp
	 * @return {bool} Always true
	 */
	static async setLastModifiedDate( timestamp = null ) {
		if( !timestamp || isNaN( timestamp ) ) {
			timestamp = Date.now()
		}

		const dbClient = Database.getClient()

		// check that option exists
		const currentValue = await dbClient.settings.findUnique({
			where: {
				name: TimeKeeper.#settingsDbKey,
			},
		})

		// if option doesn't exist, create new record
		if( !currentValue ) {
			await dbClient.settings.create({
				data: {
					name: TimeKeeper.#settingsDbKey,
					value: timestamp.toString(),
				}
			})

		// otherwise, update preexisting record
		} else {
			await dbClient.settings.update({
				where: {
					name: TimeKeeper.#settingsDbKey,
				},
				data: {
					name: TimeKeeper.#settingsDbKey,
					value: timestamp.toString(),
				}
			})
		}

		return true
	}

}
