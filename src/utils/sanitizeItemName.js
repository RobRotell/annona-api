/**
 * Sanitize item name by removing MOST special characters
 *
 * @param {string} input
 * @return {string}
 */
export const sanitizeItemName = input => {
	if( 'string' !== typeof input || !input.length ) {
		return ''
	}

	return input.replace( /[^a-zA-Z0-9.,?!$ ]+/g, '' )
}
