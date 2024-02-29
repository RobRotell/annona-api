import bcrypt from 'bcrypt'


export class SimpleAuth {

	/**
	 * Super simple auth code validation
	 *
	 * @todo Add error logging
	 *
	 * @param {obj} req
	 * @param {string} username
	 * @param {string} password
	 *
	 * @return {bool} True, if valid; otherwise, false
	 */
	static async validate( req, username, password ) {
		return new Promise( resolve => {

			// start with the easy stuff -- simple username check
			if( username !== process.env.LOCAL_AUTH_USERNAME ) {
				resolve( false )
			}

			bcrypt.compare( password, process.env.LOCAL_AUTH_PASSWORD, ( err, result ) => {
				// todo -- add error logging

				if( !result ) {
					resolve( false )
				} else {
					resolve({
						isValid: true,
						credentials: {
							user: username
						}
					})
				}
			})
		})
	}

}
