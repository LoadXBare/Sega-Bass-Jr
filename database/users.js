const config = require('./config');

module.exports.fetchUser = async (userID) => {
	let query = `SELECT * FROM users WHERE user_id = '${userID}';`;
	let user = await config.execute(query);

	if (!user[0]) { // User does not exist
		await this.initUser(userID);
		user = await config.execute(query);
		return user[0];
	} else { return user[0]; }
};

module.exports.initUser = async (userID) => {
	let query = `INSERT INTO users VALUES('${userID}', null, false, true)`;
	await config.execute(query);
	return;
};

module.exports.updateUser = async (userID, column, updatedValue) => {
	await this.fetchUser(userID);

	let query = `UPDATE users SET ${column} = ${updatedValue} WHERE user_id = '${userID}'`;
	await config.execute(query);
	return;
};

module.exports.updateAllUsers = async (column, updatedValue) => {
	let query = `UPDATE users SET ${column} = ${updatedValue};`;
	await config.execute(query);
	return;
};