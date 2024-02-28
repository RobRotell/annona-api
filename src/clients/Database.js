import { PrismaClient } from '@prisma/client'


export class Database {


	static client = null


	/**
	 * Get client instance
	 *
	 * @return {object}
	 */
	static getClient() {
		if ( !this.client ) {
			this.#createClient()
		}

		return this.client
	}


	/**
	 * Establish Prisma client
	 *
	 * @return {void}
	 */
	static #createClient() {
		if ( null === this.client ) {
			this.client = new PrismaClient()
		}
	}


}
