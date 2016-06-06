var five = require("johnny-five")
var rgbLed;

var board = new five.Board()
board.on("ready", function () {
	console.log(this)

	rgbLed = new five.Led.RGB({
		pins: {
			red: 6,
			green: 5,
			blue: 3
		}
	})

	this.repl.inject({
		led: rgbLed
	})

	io.on("connection", function (socket) {
		led.on()

		sokcet.on("changeColor", function (data) {
			if (!data) {
				return;
			}

			if (data.color) {
				led.color(data.color)
			}
		})

		socket.on("changeBrightness", function (data) {
			if (data && data.brightness) {
				var brightness = parseInt(data.brightness)

				if (brightness <= 255 && brightness >= 0) {
					led.intensity(brightness)
				}
			}
		})
	})
})
