function mapRange (val, in_min, in_max, out_min, out_max) {
  return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var ledCanvas;
var socket;
var connected;

var colorPickerInput = $("input#colorPickerInput")
var brightnessRangeInput = $("input#brightnessRangeInput")
var logger = $("#logger")

var canvasPanel = $("#ledCanvas")

colorPickerInput.on("change", function (event) {
	event.preventDefault()
	colorVal = event.target.value
	socket.emit("changeColor", {
		color: colorVal
	})
})

brightnessRangeInput.on("change", function (event) {
	socket.emit("changeBrightness", {
		brightness: parseInt(event.target.value)
	})
})


var colorVal = colorPickerInput.val()

var cloudImage;

function preload () {
	cloudImage	= loadImage("data/images/cloud.jpg")
}

function setup () {
	socket = io() // Socket.IO Websockets url here

	ledCanvas = createCanvas(640, 480)
	ledCanvas.parent("ledCanvas")

	socket.on("connect", function () {
		connected = true

		canvasPanel.removeClass("red")
		canvasPanel.addClass("green")

		logger.html(logger.html() + "<span class='green-text'>Connected to Socket.io</span>\n")
	})

	socket.on("connect_error", function () {
		canvasPanel.removeClass("green")
		canvasPanel.addClass("red")
		connected = false

		logger.html("Error connecting to Socket.io")
	})
}

function draw () {
	background(255)
	fbShareButton()
	makeistanLogo()
	dreamCloud(345, 50)
	ledDraw()
}	

function mousePressed() {
	var shareUrl = "https://facebook.com/sharer.php?u=" + window.location.href
	if ((mouseX >= 10 && mouseX <= 60) &&
		(mouseY >= 10 && mouseY <= 60)) {
		window.open(shareUrl)
	}
}

function makeistanLogo () {
	push()
	fill(colorVal)
	stroke(0)
	textSize(32)
	text("Makeistan", 490, 470)
	pop()
}


function ledDraw () {
	var ledColor = hexToRgba(colorVal, brightnessRangeInput.val())


	stroke(0)
	fill(ledColor)

	curve(300, 300, 300, 100, 340, 100, 340, 300)
	rect(300, 100, 40, 50)

	push()
	stroke(255, 0, 0)
	line(310, 150, 310, 200)
	
	stroke(0)
	line(330, 150, 330, 200)	
	
	pop()

	push()
	stroke("#808080")
	fill("#808080")
	ellipse(310, 200, 10, 10)
	ellipse(330, 200, 10, 10)
	pop()

	fill(255)
	stroke(0)
	rect(270, 200, 100, 40)


	fill(0)
	text(colorVal, 280, 220)
	text("Brightness: " + brightnessRangeInput.val(), 280, 235)
}

// dreamCloud
// a message cloud for any dream text to be displayed
// x and y refers to the x and y axis of the center
// of ellipse
function dreamCloud (x, y) {
	var textColor;
	var msg;

	push()
	image(cloudImage, x, y, 100, 50)

	push()
	color(0, 255, 0)
	if (connected) {
		textColor = [0, 255, 0]
		msg = "Connected!"
	}
	else if (!connected) {
		textColor = [255, 0, 0]
		msg = "Not Connected!"
	}
	stroke(textColor)
	fill(textColor)
	text(msg, x + 15, y + 15)
	pop()
	pop()

}


// shareuttons for facebook
function fbShareButton () {
	push()
	fill("#4862A3")
	stroke("#4862A3")
	rect(10, 10, 50, 50, 5, 5, 5, 5)

	fill(255)
	textSize(64)
	text("f", 20, 60)
	pop()

	push()
	fill(0, 0, 255)
	text("<=== Fb Share!", 70, 30)
	text("Share")
	pop()
}

/* 
 * hexToRgba
 * hexToRgba takes in the hex of the color and brightness
 * and gives the rgba value where hex corresponds to rgb and a corresponds
 * to brightness
 */
function hexToRgba(hex, brightness) {
	if (!hex || !brightness) {
		return;
	}

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    var scaledBrightness = mapRange(brightness, 0, 255, 0, 1)
    var rgbObj =  result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;

    if (rgbObj) {
    	return "rgba(" + [rgbObj.r, rgbObj.g, rgbObj.b, scaledBrightness].join(",") + ")"
    }
}


// Arduino's Board info collected using Socket.IO
function boardInfo () {
	// TODO
}