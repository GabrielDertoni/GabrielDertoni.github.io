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
var loaded = false;

function setup() {
	sound_track = loadSound("spaceinvaders.mp3", play_soundtrack, error_loading, while_loading);
	main_div = document.getElementById("canvas-container");
	Width = main_div.offsetWidth;
	Height = main_div.offsetHeight;
	if (Width % grid !== 0) {
		Width -= Width % grid;
	}
	if (Height % grid !== 0) {
		Height -= Height % grid;
	}
	canvas = createCanvas(Width, Height);
	canvas.parent("canvas-container");
	// gameOverImg.resize(Width, Height);
	fill(25);
	rect(0, 0, Width, Height);
}
function draw() {
	if (abs(Width - main_div.offsetWidth) > (grid * 2) || abs(Height - main_div.offsetHeight) > (grid * 2)) {
		Width = main_div.offsetWidth;
		Height = main_div.offsetHeight;
		if (Width % grid !== 0) {
			Width -= Width % grid;
		}
		if (Height % grid !== 0) {
			Height -= Height % grid;
		}
		resizeCanvas(Width, Height);
		background(25);
	}
	if (loaded) {
		if (game_over) {
			gameOver();
		} else if (waitKey) {
			textAlign(CENTER);
			textSize(60);
			fill(25);
			var tw1 = textWidth("Game Over!");
			rect(Width / 2 - tw1 / 2, Height / 2 - 100, tw1, 100);
			fill(255);
			text("Game Over!", Width / 2, Height / 2);
			textSize(30);
			fill(25);
			var tw2 = textWidth("Press any key to continue...");
			rect(Width / 2 - tw2 / 2, 450, tw2, 70);
			if (frameCount % 80 < 40) {
				fill(255);
				text("Press any key to continue...", Width / 2, 500);
			}
		} else {
			fill(25, 5);
			rect(0, 0, Width, Height);
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
					if ((position[0] + 1) * grid < Width) {
						position[0]++;
					}
				} else if (direction === 2) {
					if ((position[1] + 1) * grid < Height) {
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
			}
			if (food.length === 0) {
				food.push([int(random(Width / grid)), int(random(Height / grid))]);
			}
			textAlign(CORNER);
			textSize(20);
			fill(25);
			text("Points: " + points.toString(), 50, 50);
			fill(255);
			text("Points: " + points.toString(), 50, 50);
		}
	}
}
function gameOver() {
	snake = [[11, 10], [10, 10]];
	direction = 1;
	waitKey = true;
	game_over = false;
	points = 0;
	beam = [0, 0];
	fill(25);
	rect(0, 0, Width, Height);
}
function keyPressed() {
	if (waitKey) {
		waitKey = false;
		fill(25);
		rect(0, 0, Width, Height);
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
		rect(0, 0, Width, Height);
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
function play_soundtrack () {
	sound_track.loop();
	loaded = true;
}
function while_loading (p) {
	fill(25);
	rect(0, 0, Width, Height);
	textAlign(CENTER);
	fill(255);
	text("Loading...", Width / 2, Height / 2 - 70);
	noFill();
	stroke(255);
	rect(Width / 2 - 200, Height / 2 - 25, 200, 50);
	noStroke();
	fill(255);
	rect(Width / 2 - 200, Height / 2 - 25, 200 * p, 50);
}
function error_loading () {
	
}
