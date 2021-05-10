const auth = require('./auth');
const inviteCode = require('./invite-code');
const book = require('./book');
const inventoryLog = require('./inventory-log');
const user = require('./user');
const character = require('./character');

module.exports = (app) =>{
    app.use(auth.routes());
    app.use(inviteCode.routes());
    app.use(book.routes());
    app.use(inventoryLog.routes());
    app.use(user.routes());
    app.use(character.routes());
};