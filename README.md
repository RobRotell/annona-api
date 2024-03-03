# Annona (API)

Annona, the Roman goddess of abundance and grain.

This is a simple API to get more practice with Hapi and Prisma and develop a backend to track groceries. 

## Endpoints:
- users
	- [POST] create user
		- URL: https://api.annona.robr.app/user/create
		- params:
			- username
			- password
			- door code (special phrase to ensure bouncer lets only authorized people in the club)
	- [GET] get items by user
		- URL: https://api.annona.robr.app/items/get
		- basic auth
	- [POST] add item
		- URL: https://api.annona.robr.app/items/add
		- basic auth
		- param:
			- item name
	- [DELETE] delete item
		- URL: https://api.annona.robr.app/items/delete
		- basic auth
		- param:
			- item ID
	- [UPDATE] update item *(TBD)*
		- URL: https://api.annona.robr.app/items/update
		- basic auth
		- params:
			- item ID
			- new item name
