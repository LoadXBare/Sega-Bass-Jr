const { createPool } = require('mysql2');
const { db } = require('../private/config.json');

const pool = createPool({
	host: db.host,
	user: db.user,
	database: db.database,
	password: db.password
});

module.exports.execute = async (query) => {
	let execute = new Promise((resolve) => {
		pool.execute(query, (err, result) => {
			if (err) { throw err; }
			resolve(result);
		});
	});

	return await execute;
};