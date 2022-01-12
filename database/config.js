const { createPool } = require('mysql2');
const { db } = require('../private/config.json');

const pool = createPool({
	host: db.host,
	user: db.user,
	database: db.database,
	password: db.password
});

module.exports.execute = async (query) => {
	const execute = new Promise((resolve) => {
		pool.execute(query, (err, result) => {
			if (err) { throw err; }
			resolve(result);
		});
	});

	const result = await execute;
	return result;
};