export const route404 = {
	method: '*',
	path: '/{any*}',
	async handler( req, h ) {
		const routes = {
			users: [
				{
					url: `${process.env.APP_URL}/user/create`,
					method: 'POST',
					params: {
						username: 'Name of user to create',
						password: 'Password for user',
						doorCode: 'Secret phrase to enter club',
					},
				},
			],
			items: [
				{
					url: `${process.env.APP_URL}/items/get`,
					method: 'GET',
					auth: {
						type: 'basic',
					},
				},
				{
					url: `${process.env.APP_URL}/items/add`,
					method: 'POST',
					params: {
						name: 'Name of item to create',
					},
					auth: {
						type: 'basic',
					},
				},
				{
					url: `${process.env.APP_URL}/items/delete`,
					method: 'DELETE',
					params: {
						id: 'ID of item to delete',
					},
					auth: {
						type: 'basic',
					},
				},
			],
		}

		return h.response({ routes }).code( 404 )
	},
}
