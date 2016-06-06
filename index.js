const express = require("express")
const http = require("http")
const path = require("path")

const app = express()
const server = http.createServer(app)

const io = require("./io")(server)

app.use(express.static(path.join(__dirname, "public")))

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "0.0.0.0"

server.listen(PORT, HOST, function (error) {
	if (error) {
		console.error(error)
	}
	else {
		console.log(`Server is listening on PORT:${PORT}\nHOST:${HOST}`)
	}
})