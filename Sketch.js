var grid = 30;
var snake = [[11, 10], [10, 10]];
var points = 0;
var reward = 5;
var food = [];
var direction = 1;
var game_over = false;
var speed = 10;
var gameOverImg;
var beam = [0, 0];
var waitKey = false;
var pivotX, pivotY = 0;

function preload() {
	gameOverImg = loadImage('gameOver.jpg');
	sound_track = loadSound('spaceinvaders.mp3');
}
function setup() {
	createCanvas(900, 600);
	gameOverImg.resize(width, height);
	fill(25);	
	rect(0, 0, width, height);
	sound_track.loop();
}
function draw() {
	if (game_over) {
		gameOver();
	} else if (waitKey) {
		textAlign(CENTER);
		textSize(30);
		fill(0);
		var tw = textWidth("Press any key to continue...");
		rect(width / 2 - tw / 2, 450, tw, 70);
		if (frameCount % 80 < 40) {
			fill(255);
			text("Press any key to continue...", width / 2, 500);
		}
	} else {
		fill(25, 5);
		rect(0, 0, width, height);
		var eaten = undefined;
		noStroke();
		for (var i = 0; i < food.length; i++) {
			fill(255, 0, 0);
			rect(food[i][0] * grid, food[i][1] * grid, grid, grid);
		}
		for (var i in snake) {
			fill(255);
			rect(snake[i][0] * grid, snake[i][1] * grid, grid, grid);
		}
		if (frameCount % (60 / speed) === 0) {
			var position = snake[0].slice();
			if (direction === 0) {
				if ((position[1] + 1) * grid > grid) {
					position[1]--;
				}
			} else if (direction === 1) {
				if ((position[0] + 1) * grid < width) {
					position[0]++;
				}
			} else if (direction === 2) {
				if ((position[1] + 1) * grid < height) {
					position[1]++;
				}
			} else {
				if ((position[0] + 1) * grid > grid) {
					position[0]--;
				}
			}
			for (var i = snake.length - 1; i >= 0; i--) {
				if (i == 0) {
					snake[i] = position;
				} else {
					snake[i] = snake[i - 1];
					if (snake[i - 1][0] === position[0] && 
					    snake[i - 1][1] === position[1]) {
						game_over = true;
					}
				}
			}
			for (var i = 0; i < food.length; i++) {
				if (snake[0][0] === food[i][0] && snake[0][1] === food[i][1]) {
					pos = food.splice(i, 1);
					points += reward;
					for (var j = 0; j < reward; j++) {
						snake.push(pos);
					}
				}
			}
			if (game_over) {
				gameOver();
			}
		}
		if (food.length === 0) {
			food.push([int(random(width / grid)), int(random(height / grid))]);
		}
		textAlign(CORNER);
		textSize(20);
		fill(25);
		text("Points: " + points.toString(), 50, 50);
		fill(255);
		text("Points: " + points.toString(), 50, 50);
	}
}
function gameOver() {
	var beamW = 50;
	if (beam[0] < width || beam[1] < height) {
		r(beam, beamW);
		if (beam[0] >= width) {
			beam[0] = 0;
			beam[1] += beamW;
		} else {
			beam[0] += beamW;
		}
	} else {
		snake = [[1, 0], [0, 0]];
		direction = 1;
		waitKey = true;
		game_over = false;
		points = 0;
		beam = [0, 0];
	}
}
function r(beam, beamW) {
	loadPixels();
	gameOverImg.loadPixels();
	for (var i = 0; i < beamW; i++) {
		for (var j = 0; j < beamW; j++) {
			pixels[((beam[1] + i) * width + (beam[0] + j)) * 4] = 
				gameOverImg.pixels[((beam[1] + i) * width + (beam[0] + j)) * 4];
			pixels[((beam[1] + i) * width + (beam[0] + j)) * 4 + 1] =
				gameOverImg.pixels[((beam[1] + i) * width + (beam[0] + j)) * 4 + 1];
			pixels[((beam[1] + i) * width + (beam[0] + j)) * 4 + 2] =
				gameOverImg.pixels[((beam[1] + i) * width + (beam[0] + j)) * 4 + 2];
			pixels[((beam[1] + i) * width + (beam[0] + j)) * 4 + 3] =
				gameOverImg.pixels[((beam[1] + i) * width + (beam[0] + j)) * 4 + 3];
		}
	}
	updatePixels();
}
function keyPressed() {
	if (waitKey) {
		waitKey = false;
		fill(25);
		rect(0, 0, width, height);
	} else if (keyCode === 38 && direction !== 2) {
		direction = 0;
	} else if (keyCode === 39 && direction !== 3) {
		direction = 1;
	} else if (keyCode === 40 && direction !== 0) {
		direction = 2;
	} else if (keyCode === 37 && direction !== 1) {
		direction = 3;
	}
}
function mousePressed() {
	if (waitKey) {
		waitKey = false;
		fill(25);
		rect(0, 0, width, height);
	} else {
		pivotX = mouseX;
		pivotY = mouseY;
	}
}
function mouseReleased() {
	if (abs(mouseX - pivotX) > abs(mouseY - pivotY)) {
		if (mouseX - pivotX > 20) {
			direction = 1;
		} else if (mouseX - pivotX < -20) {
			direction = 3;
		}
	} else {
		if (mouseY - pivotY > 20) {
			direction = 2;
		} else if (mouseY - pivotY < -20) {
			direction = 0;
		}
	}
}
