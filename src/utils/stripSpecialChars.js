/**
 * Strip special characters from string
 *
 * @param {string} input
 * @return {string}
 */
export const stripSpecialChars = input => {
	if( 'string' !== typeof input ) {
		return ''
	}

	return input.replace( /[^a-zA-Z0-9]/g, '' )
}
