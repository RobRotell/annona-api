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
		const query = {
			where: {
				name: TimeKeeper.#settingsDbKey
			}
		}

		let record = await dbClient.setting.findUnique( query )

		// if timestamp option doesn't already exist, create it
		if( !record ) {
			await TimeKeeper.setLastModifiedDate()

			record = await dbClient.setting.findUnique( query )
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
		const currentValue = await dbClient.setting.findUnique({
			where: {
				name: TimeKeeper.#settingsDbKey,
			},
		})

		// if option doesn't exist, create new record
		if( !currentValue ) {
			await dbClient.setting.create({
				data: {
					name: TimeKeeper.#settingsDbKey,
					value: timestamp.toString(),
				}
			})

		// otherwise, update preexisting record
		} else {
			await dbClient.setting.update({
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
