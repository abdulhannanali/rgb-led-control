const socketIO = require("socket.io")

module.exports = function (server) {
	const io = socketIO(server)

	return io
}