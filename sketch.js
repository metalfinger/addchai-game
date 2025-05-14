let m;
let p;
let unit;

let frontPar = 0;

let mFlameArray = [];
let playerWeapons = [];
let blastArray = [];
let addChaiArray = [];
let lastFired = 0;
let fireRate = 1000; // cooldown time in milliseconds

let iMonster;
let iPlayer;
let iFlame;
let iWeapon;
let iAddChai1;
let iAddChai2;
let iAddChai3;
let iAddChai4;
let characterSheet;
let lifeIcon;
let healthBarAbove;
let healthBarBelow;
let iAddChaiImg;
let iReloadIcon;
let iBackPlayer;

// Game state
let currentScreen = "characterSelect"; // 'characterSelect', 'game', or 'gameOver'
let currentCharacter = 0;
const characterNames = [
	"Warrior",
	"Mage",
	"Archer",
	"Knight",
	"Ninja",
	"Paladin",
	"Rogue",
	"Berserker",
	"Monk",
	"Druid",
	"Warlock",
];

// Parallax offset values
let PARALLAX_OFFSET_UP = -95;
let PARALLAX_OFFSET_DOWN = 0;

// Layer positions
let layer1Y = 0;
let layer2Y = 0;
let layer3Y = 0;
let layer4Y = 0;

let shootingPowerupDuration = 5000; // Duration of fast shooting power-up in ms
let shootingPowerupTimer = 0;
const defaultFireRate = 1000;

let gameStartTime = 0;
let gameEndTime = 0;
let lastGameDuration = 0;

let monsterFireRate = 1000; // Initial monster fire rate in ms
let monsterLastFired = 0;
const monsterMinFireRate = 250; // Minimum fire rate for monster

// Indicator positions and sizes
let RELOAD_INDICATOR_X; // pixels from right edge
let RELOAD_INDICATOR_Y; // pixels from top
let RELOAD_INDICATOR_SIZE; // diameter in pixels

let POWERUP_INDICATOR_X; // pixels from left edge
let POWERUP_INDICATOR_Y; // pixels from top
let POWERUP_INDICATOR_SIZE; // diameter in pixels

// Health heart (life icon) positions and sizes
let HEALTH_HEART_X; // starting x position
let HEALTH_HEART_Y; // y position
let HEALTH_HEART_SIZE; // size of each heart
let HEALTH_HEART_SPACING; // space between hearts

function preload() {
	// Preload any assets here if needed
	console.log("Preload started");

	// Load all images
	iMonster = loadImage("asset/William.png");
	iPlayer = loadImage("asset/Playerr.png");
	iFlame = loadImage("asset/Blastt.png");
	iWeapon = loadImage("asset/Weaponn.png");
	iAddChai1 = loadImage("asset/map/addchai1.png", () =>
		console.log("addchai1 loaded")
	);
	iAddChai2 = loadImage("asset/map/addchai2.png", () =>
		console.log("addchai2 loaded")
	);
	iAddChai3 = loadImage("asset/map/addchai3.png", () =>
		console.log("addchai3 loaded")
	);
	iAddChai4 = loadImage("asset/map/addchai4.png", () =>
		console.log("addchai4 loaded")
	);
	characterSheet = loadImage("asset/character/Character Sheet3.png");
	lifeIcon = loadImage("asset/character/life.png"); // Add life icon loading
	healthBarAbove = loadImage("asset/monster/health_above.png");
	healthBarBelow = loadImage("asset/monster/health_below.png");
	iAddChaiImg = loadImage("asset/addchai.png");
	iReloadIcon = loadImage("asset/character/reloadicon.png"); // Add reload icon loading
	iBackPlayer = loadImage("asset/map/back_player.jpg"); // Load background for character selection
}

function setup() {
	console.log("Setup started");
	createCanvas(windowWidth, (windowWidth * 9) / 16);

	unit = width / 16;

	// Initialize indicator positions and sizes
	RELOAD_INDICATOR_X = unit;
	RELOAD_INDICATOR_Y = unit * 1.2;
	RELOAD_INDICATOR_SIZE = unit * 0.5;

	POWERUP_INDICATOR_X = unit * 1.7;
	POWERUP_INDICATOR_Y = unit * 1.2;
	POWERUP_INDICATOR_SIZE = unit * 0.5;

	// Initialize health heart positions and sizes
	HEALTH_HEART_X = unit * 0.75;
	HEALTH_HEART_Y = unit * 0.25;
	HEALTH_HEART_SIZE = unit * 0.5;
	HEALTH_HEART_SPACING = HEALTH_HEART_SIZE * 1;

	PARALLAX_OFFSET_UP = 0;
	PARALLAX_OFFSET_DOWN = -unit;

	m = new Monster();
	p = new Player();

	//loading images
	iMonster = loadImage("asset/William.png");
	iPlayer = loadImage("asset/Playerr.png");
	iFlame = loadImage("asset/Blastt.png");
	iWeapon = loadImage("asset/Weaponn.png");

	iAddChai1 = loadImage("asset/map/addchai1.png");
	iAddChai2 = loadImage("asset/map/addchai2.png");
	iAddChai3 = loadImage("asset/map/addchai3.png");
	iAddChai4 = loadImage("asset/map/addchai4.png");

	console.log("Setup completed");

	gameStartTime = millis();
	gameEndTime = 0;
	lastGameDuration = 0;

	iAddChaiImg = loadImage("asset/addchai.png");
}

function draw() {
	if (currentScreen === "characterSelect") {
		drawCharacterSelect();
	} else if (currentScreen === "gameOver") {
		drawGameOver();
	} else {
		drawGame();
	}
}

function drawCharacterSelect() {
	noStroke(); // Prevent outlines
	// Draw the background image if loaded, else fallback to black
	if (iBackPlayer) {
		image(iBackPlayer, 0, 0, width, height);
	} else {
		background(0);
	}

	if (characterSheet) {
		// Each character is 400px wide in the original image
		let charWidth = 400;
		let charHeight = characterSheet.height;

		// Calculate the position to center the character with unit-based size
		let displayWidth = unit * 3; // 4 units wide
		let displayHeight = (displayWidth * charHeight) / charWidth;
		let x = (width - displayWidth) / 2;
		let y = (height - displayHeight) / 2;

		// Draw the current character from the sprite sheet
		image(
			characterSheet,
			x,
			y,
			displayWidth,
			displayHeight,
			currentCharacter * charWidth,
			0,
			charWidth,
			charHeight
		);

		// Draw navigation arrows
		drawNavigationArrows();
	} else {
		// Show loading message if image isn't loaded yet
		fill(255);
		textSize(unit * 0.5);
		textAlign(CENTER);
		text("Loading character sheet...", width / 2, height / 2);
	}
}

function drawNavigationArrows() {
	// Left arrow
	fill(255);
	let arrowSize = unit * 0.5;
	triangle(
		unit * 2,
		height / 2,
		unit * 2.5,
		height / 2 - arrowSize,
		unit * 2.5,
		height / 2 + arrowSize
	);

	// Right arrow
	triangle(
		width - unit * 2,
		height / 2,
		width - unit * 2.5,
		height / 2 - arrowSize,
		width - unit * 2.5,
		height / 2 + arrowSize
	);

	// Draw select button
	fill(0, 255, 0);
	let buttonWidth = unit * 4;
	let buttonHeight = unit;
	rect(
		width / 2 - buttonWidth / 2,
		height - unit * 2,
		buttonWidth,
		buttonHeight
	);
	fill(0);
	textSize(unit * 0.4);
	textAlign(CENTER, CENTER);
	text("Select Character", width / 2, height - unit * 1.5);
}

function mousePressed() {
	if (currentScreen === "characterSelect") {
		let arrowSize = unit * 0.5;
		// Check if left arrow was clicked
		if (
			mouseX > unit * 2 &&
			mouseX < unit * 2.5 &&
			mouseY > height / 2 - arrowSize &&
			mouseY < height / 2 + arrowSize
		) {
			currentCharacter = (currentCharacter - 1 + 11) % 11;
		}

		// Check if right arrow was clicked
		if (
			mouseX > width - unit * 2.5 &&
			mouseX < width - unit * 2 &&
			mouseY > height / 2 - arrowSize &&
			mouseY < height / 2 + arrowSize
		) {
			currentCharacter = (currentCharacter + 1) % 11;
		}

		// Check if select button was clicked
		let buttonWidth = unit * 4;
		let buttonHeight = unit;
		if (
			mouseX > width / 2 - buttonWidth / 2 &&
			mouseX < width / 2 + buttonWidth / 2 &&
			mouseY > height - unit * 2 &&
			mouseY < height - unit
		) {
			p.characterIndex = currentCharacter;
			currentScreen = "game";
		}
	}
}

function keyPressed() {
	if (currentScreen === "characterSelect") {
		if (keyCode === LEFT_ARROW) {
			currentCharacter = (currentCharacter - 1 + 11) % 11;
		}
		if (keyCode === RIGHT_ARROW) {
			currentCharacter = (currentCharacter + 1) % 11;
		}
		if (keyCode === ENTER) {
			p.characterIndex = currentCharacter;
			currentScreen = "game";
		}
	} else if (currentScreen === "gameOver") {
		if (keyCode === ENTER) {
			// Reset game state
			p.health = 3;
			m.health = 10;
			mFlameArray = [];
			playerWeapons = [];
			blastArray = [];
			addChaiArray = [];
			fireRate = defaultFireRate;
			shootingPowerupTimer = 0;
			currentScreen = "characterSelect";
			gameStartTime = millis();
			gameEndTime = 0;
			lastGameDuration = 0;
		}
	} else {
		if (keyCode === 32) {
			// Space bar
			fireWeapon();
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, (windowWidth * 9) / 16);

	unit = width / 16;

	// Update indicator positions and sizes
	RELOAD_INDICATOR_X = unit;
	RELOAD_INDICATOR_Y = unit * 1.3;
	RELOAD_INDICATOR_SIZE = unit * 0.5;

	POWERUP_INDICATOR_X = unit * 1.3;
	POWERUP_INDICATOR_Y = unit * 1.3;
	POWERUP_INDICATOR_SIZE = unit * 0.5;

	// Update health heart positions and sizes
	HEALTH_HEART_X = unit * 0.5;
	HEALTH_HEART_Y = unit * 0.5;
	HEALTH_HEART_SIZE = unit * 0.5;
	HEALTH_HEART_SPACING = HEALTH_HEART_SIZE * 1.2;
}

function drawGame() {
	noStroke(); // Prevent outlines
	background(0);

	// Calculate parallax effect based on player position
	let normalizedPlayerY = map(p.y, 0, height, 0, 1);

	// Update layer positions with parallax effect
	layer4Y =
		lerp(PARALLAX_OFFSET_UP, PARALLAX_OFFSET_DOWN, normalizedPlayerY) * 0.25;
	layer3Y =
		lerp(PARALLAX_OFFSET_UP, PARALLAX_OFFSET_DOWN, normalizedPlayerY) * 0.5;
	layer2Y =
		lerp(PARALLAX_OFFSET_UP, PARALLAX_OFFSET_DOWN, normalizedPlayerY) * 0.75;
	layer1Y = lerp(PARALLAX_OFFSET_UP, PARALLAX_OFFSET_DOWN, normalizedPlayerY);

	// Calculate height to maintain aspect ratio
	let imgHeight1 = (width * iAddChai1.height) / iAddChai1.width;
	let imgHeight2 = (width * iAddChai2.height) / iAddChai2.width;
	let imgHeight3 = (width * iAddChai3.height) / iAddChai3.width;
	let imgHeight4 = (width * iAddChai4.height) / iAddChai4.width;

	// Set blend mode for darker effect
	blendMode(BLEND);

	// Draw layers from back to front with maintained aspect ratio and dark tint
	tint(200); // Increased from 80 to 200 for better visibility
	image(iAddChai4, 0, layer4Y, width, imgHeight4);
	image(iAddChai3, 0, layer3Y, width, imgHeight3);
	image(iAddChai2, 0, layer2Y, width, imgHeight2);
	image(iAddChai1, 0, layer1Y, width, imgHeight1);

	// Reset blend mode and tint for other elements
	blendMode(BLEND);
	noTint();

	//Move the Player

	//UP
	if (keyIsDown(UP_ARROW) === true) {
		if (p.targetY > p.hh + unit / 7) {
			p.targetY -= unit / 15;
		}
	}

	//DOWN
	if (keyIsDown(DOWN_ARROW) === true) {
		if (p.targetY < height - (p.hh + unit / 7)) {
			p.targetY += unit / 15;
		}
	}

	//LEFT
	if (keyIsDown(LEFT_ARROW) === true) {
		if (p.targetX > p.ww + unit / 7) {
			p.targetX -= unit / 15;
		}
	}

	//RIGHT
	if (keyIsDown(RIGHT_ARROW) === true) {
		if (p.targetX < width / 2) {
			p.targetX += unit / 15;
		}
	}

	//draw monster and player
	m.drawThis();
	p.drawThis();

	// Update monster fire rate based on health
	monsterFireRate = map(m.health, 1, 10, monsterMinFireRate, 1000, true);

	// Monster shooting logic
	if (
		millis() - monsterLastFired > monsterFireRate &&
		m.health > 0 &&
		currentScreen === "game"
	) {
		let mf = new MonsterFlame(m.x - unit * 2, m.y, random(1, 5));
		mFlameArray.push(mf);
		monsterLastFired = millis();
	}

	//add addchai randomly
	//AddChai
	if (shootingPowerupTimer === 0 && random(0, 1000) < 4) {
		let randomYPos = random(unit / 2, height / 2 - unit / 2);
		let randomXPos = random(unit / 2, width / 4 - unit / 2);

		if (p.y < height / 2) {
			randomYPos = randomYPos + height / 2;
		}

		if (p.x < width / 4) {
			randomXPos = randomXPos + width / 4;
		}

		let ac = new AddChai(randomXPos, randomYPos);
		addChaiArray.push(ac);
	}

	//check if need to remove fire
	let removeFlameIndex = -1;
	for (let i = 0; i < mFlameArray.length; i++) {
		mFlameArray[i].drawThis();

		// Check for collision with player
		if (checkCollision(mFlameArray[i], p)) {
			p.health--;

			//add blast
			let b = new Blast(
				mFlameArray[i].x,
				mFlameArray[i].y,
				mFlameArray[i].size
			);
			blastArray.push(b);

			if (p.health <= 0) {
				currentScreen = "gameOver";
			}
			removeFlameIndex = i;
			break;
		}

		//check for removal
		if (mFlameArray[i].y > height) {
			removeFlameIndex = i;
			break;
		}
	}

	// Move and draw weapons
	let removeWeaponIndex = -1;
	for (let i = 0; i < playerWeapons.length; i++) {
		playerWeapons[i].drawThis();

		//! Check for collision with monster
		if (checkCollision(playerWeapons[i], m)) {
			removeWeaponIndex = i;
			m.health--;

			//add blast
			let b = new Blast(playerWeapons[i].x, playerWeapons[i].y, m.size / 2);
			blastArray.push(b);

			break;
		}

		//! check for collision with flame
		for (let j = 0; j < mFlameArray.length; j++) {
			if (checkCollision(playerWeapons[i], mFlameArray[j])) {
				removeWeaponIndex = i;
				removeFlameIndex = j;

				//add blast
				let b = new Blast(
					mFlameArray[j].x,
					mFlameArray[j].y,
					mFlameArray[j].size
				);
				blastArray.push(b);

				break;
			}
		}

		// Check for removal
		if (playerWeapons[i].y < 0) {
			removeWeaponIndex = i;
			break;
		}
	}

	let removeBlastIndex = -1;

	//! Draw the blast
	for (let i = 0; i < blastArray.length; i++) {
		blastArray[i].drawThis();

		//check for removal
		if (blastArray[i].currentLife <= 0) {
			removeBlastIndex = i;
		}
	}

	//! Draw the AddChai
	let removeAddChaiIndex = -1;
	for (let i = 0; i < addChaiArray.length; i++) {
		addChaiArray[i].drawThis();

		// Check for collision with player
		if (checkCollision(addChaiArray[i], p)) {
			fireRate = 100;
			shootingPowerupTimer = millis();
			removeAddChaiIndex = i;
			console.log(i);
			break;
		}

		//check for removal
		if (addChaiArray[i].currentLife <= 0) {
			removeAddChaiIndex = i;
		}
	}

	// Check if shooting power-up should expire
	if (
		shootingPowerupTimer > 0 &&
		millis() - shootingPowerupTimer > shootingPowerupDuration
	) {
		fireRate = defaultFireRate;
		shootingPowerupTimer = 0;
	}

	// Draw shooting power-up timer indicator if active
	// if (shootingPowerupTimer > 0) {
	if (1) {
		// just to check te UI
		let indicatorX = POWERUP_INDICATOR_X;
		let indicatorY = POWERUP_INDICATOR_Y;
		let indicatorSize = POWERUP_INDICATOR_SIZE;
		let elapsed = millis() - shootingPowerupTimer;
		let fraction = 1 - elapsed / shootingPowerupDuration;
		let startAngle = -HALF_PI;
		let endAngle = startAngle + fraction * TWO_PI;

		// Background circle
		noStroke();
		fill(255);
		ellipse(indicatorX, indicatorY, indicatorSize, indicatorSize);

		// Arc timer
		noFill();
		stroke(120, 255, 120);
		strokeWeight(indicatorSize * 0.09);
		arc(
			indicatorX,
			indicatorY,
			indicatorSize * 0.92,
			indicatorSize * 0.92,
			startAngle,
			endAngle
		);

		// Power-up icon
		noStroke();
		fill(255);
		textAlign(CENTER, CENTER);
		textSize(indicatorSize * 0.45);
		if (iAddChaiImg) {
			imageMode(CORNER);

			let imgSize = indicatorSize * 0.53;

			image(
				iAddChaiImg,
				indicatorX - imgSize / 2,
				indicatorY - imgSize / 2,
				imgSize,
				imgSize
			);

			//image mode to top left
			imageMode(CORNER);
		}
	}

	drawCoolDownArc();

	//remove the blast
	if (removeBlastIndex != -1) {
		blastArray.splice(removeBlastIndex, 1);
	}

	//remove flame the one out of bound
	if (removeFlameIndex != -1) {
		mFlameArray.splice(removeFlameIndex, 1);
	}

	// Remove the weapon that is out of bound or hit the monster
	if (removeWeaponIndex != -1) {
		playerWeapons.splice(removeWeaponIndex, 1);
	}

	// Remove the addchai that is out of bound or hit the monster
	if (removeAddChaiIndex != -1) {
		addChaiArray.splice(removeAddChaiIndex, 1);
	}

	// Dumym Rect
	// fill("black");
	// rect(0, 0, unit * 1.3, unit / 2);
	// rect(width - unit * 2.5, 0, unit * 2.5, unit / 2);

	// // Display player health
	// fill(0);
	// fill("red");
	// textSize(unit / 4);
	// textAlign(RIGHT, TOP);
	// text("Monster Health: " + m.health, width - unit / 12, unit / 12);

	// // Display monster health
	// fill(0);
	// fill("red");
	// textSize(unit / 4);
	// textAlign(LEFT, TOP);
	// text("Health: " + p.health, unit / 12, unit / 12);

	// Draw life indicators in top left corner
	for (let i = 0; i < p.health; i++) {
		image(
			lifeIcon,
			HEALTH_HEART_X + i * HEALTH_HEART_SPACING,
			HEALTH_HEART_Y,
			HEALTH_HEART_SIZE,
			HEALTH_HEART_SIZE
		);
	}

	// Display monster health bar
	let healthBarWidth = unit * 4;
	let healthBarHeight = unit * 0.5;
	let healthBarX = width - healthBarWidth - unit;
	let healthBarY = unit * 0.5;

	// Draw the bottom part of health bar
	image(
		healthBarBelow,
		healthBarX,
		healthBarY,
		healthBarWidth,
		healthBarHeight
	);

	// Calculate the width of the green bar to show
	let greenWidth = (healthBarWidth * m.health) / 10;
	let greenSrcWidth = (healthBarAbove.width * m.health) / 10;

	// Draw only the left part of the green bar (above)
	if (m.health > 0) {
		image(
			healthBarAbove,
			healthBarX,
			healthBarY, // Destination x, y
			greenWidth,
			healthBarHeight, // Destination width, height
			0,
			0, // Source x, y (start from left)
			greenSrcWidth,
			healthBarAbove.height // Source width, height
		);
	}

	// Game timer logic
	let currentGameTime = 0;
	if (gameStartTime > 0 && gameEndTime === 0) {
		currentGameTime = millis() - gameStartTime;
	} else if (gameEndTime > 0) {
		currentGameTime = gameEndTime - gameStartTime;
	}

	// Draw timer at top center
	fill(255);
	textAlign(CENTER, TOP);
	textSize(unit * 0.4);
	let seconds = floor(currentGameTime / 1000);
	let minutes = floor(seconds / 60);
	let displaySeconds = seconds % 60;
	let timeStr = nf(minutes, 2) + ":" + nf(displaySeconds, 2);
	text("Time: " + timeStr, width / 2, unit * 0.1);

	// Check for game over (player or monster health)
	if (p.health <= 0 || m.health <= 0) {
		if (gameEndTime === 0) {
			gameEndTime = millis();
			lastGameDuration = gameEndTime - gameStartTime;
		}
		currentScreen = "gameOver";
	}
}

function checkCollision(entity1, entity2) {
	let d = dist(entity1.x, entity1.y, entity2.x, entity2.y);
	let minDist = (entity1.size + entity2.size) / 2;
	return d < minDist; // Adjust the collision threshold as needed
}

function fireWeapon() {
	let currentTime = millis();
	if (currentTime - lastFired > fireRate) {
		let w = new Weapon(p.x + unit / 2, p.y);
		playerWeapons.push(w);
		lastFired = currentTime; // Update the last fired time
	}
}

function drawCoolDownArc() {
	let currentTime = millis();
	let timeSinceLastFired = currentTime - lastFired;

	if (timeSinceLastFired > fireRate) {
		timeSinceLastFired = fireRate;
		lastFired = currentTime - fireRate;
	}

	let arcAngle = map(timeSinceLastFired, 0, fireRate, 0, TWO_PI);

	// Draw in top right corner
	let indicatorX = RELOAD_INDICATOR_X;
	let indicatorY = RELOAD_INDICATOR_Y;
	let indicatorSize = RELOAD_INDICATOR_SIZE;

	// Background circle
	noStroke();
	fill(255);
	ellipse(indicatorX, indicatorY, indicatorSize, indicatorSize);

	// Draw reload progress
	noFill();
	stroke(255, 0, 0);
	strokeWeight(indicatorSize * 0.09);
	arc(
		indicatorX,
		indicatorY,
		indicatorSize * 0.92,
		indicatorSize * 0.92,
		-HALF_PI,
		-HALF_PI + arcAngle
	);

	// Draw reload icon
	if (iReloadIcon) {
		imageMode(CENTER);
		image(
			iReloadIcon,
			indicatorX,
			indicatorY,
			indicatorSize * 0.8,
			indicatorSize * 0.8
		);
		imageMode(CORNER);
	}
}

function drawGameOver() {
	noStroke(); // Prevent outlines
	background(0);

	// Draw win/lose message
	textAlign(CENTER, CENTER);
	textSize(unit * 2);
	if (m.health <= 0) {
		fill(0, 255, 0);
		text("VICTORY!", width / 2, height / 2);
	} else {
		fill(255, 0, 0);
		text("GAME OVER", width / 2, height / 2);
	}

	// Draw restart instruction
	textSize(unit * 0.5);
	fill(255);
	text("Press ENTER to restart", width / 2, height / 2 + unit);

	// Draw time spent
	if (lastGameDuration > 0) {
		let seconds = floor(lastGameDuration / 1000);
		let minutes = floor(seconds / 60);
		let displaySeconds = seconds % 60;
		let timeStr = nf(minutes, 2) + ":" + nf(displaySeconds, 2);
		textSize(unit * 0.7);
		fill(255, 255, 0);
		text("Time: " + timeStr, width / 2, height / 2 + unit * 1.7);
	}
}

class MonsterFlame {
	constructor(x, y, speed) {
		this.x = x;
		this.y = y;
		this.speed = speed;
		this.ww = unit / 1;
		this.hh = this.ww * 0.45;

		this.size = this.ww;
	}

	updateThis(x, y) {
		this.x = x;
		this.y = y;
	}

	drawThis() {
		this.ww = unit / 1;
		this.hh = this.ww * 0.45;

		this.size = this.ww;

		textAlign(CENTER, CENTER);
		textSize(unit / 2);
		//text("🔥", this.x, this.y);

		image(iFlame, this.x - this.ww / 2, this.y - this.hh / 2, this.ww, this.hh);

		this.x -= this.speed;
	}
}

class Weapon {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.speed = unit / 32;
		this.ww = unit / 4;
		this.hh = this.ww / 2;
		this.size = this.ww;
		this.trail = []; // Array to store trail positions
		this.trailLength = unit / 9; // Increased from 5 to 15 for longer trail
		this.trailSpacing = unit / 2; // Reduced spacing for smoother trail
	}

	updateThis(x, y) {
		this.x = x;
		this.y = y;
	}

	drawThis() {
		this.speed = unit / 32;
		this.ww = unit / 4;
		this.hh = this.ww / 2;
		this.size = this.hh;

		// Update trail
		this.trail.unshift({ x: this.x, y: this.y }); // Add current position to start of trail
		if (this.trail.length > this.trailLength) {
			this.trail.pop(); // Remove oldest position if trail is too long
		}

		// Draw trail
		noStroke();
		for (let i = 0; i < this.trail.length; i++) {
			// Calculate opacity based on position in trail with smoother fade
			let opacity = map(i, 0, this.trailLength, 255, 0);
			fill(255, 0, 0, opacity); // Red color with fading opacity

			// Draw trail segment with smoother size reduction
			let size = map(i, 0, this.trailLength, this.ww, this.ww * 0.2);
			ellipse(this.trail[i].x, this.trail[i].y, size, size * 0.3);
		}

		// Draw pixel-art style laser (center yellow, outer red)
		let laserLength = this.ww * 1.5; // Length of the laser beam
		let laserHeight = this.hh * 0.7; // Height of the laser beam

		// Outer red
		fill(255, 0, 0);
		rect(this.x, this.y - laserHeight / 2, laserLength, laserHeight, 2);

		// Middle orange
		fill(255, 140, 0);
		rect(
			this.x,
			this.y - laserHeight / 3,
			laserLength * 0.9,
			laserHeight / 1.5,
			2
		);

		// Center yellow
		fill(255, 255, 0);
		rect(
			this.x,
			this.y - laserHeight / 6,
			laserLength * 0.7,
			laserHeight / 3,
			2
		);

		this.x += this.speed;
	}
}

class Blast {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.life = 20;
		this.currentLife = this.life;
	}

	drawThis() {
		textAlign(CENTER, CENTER);
		textSize(this.size * (this.currentLife / this.life));
		text("💥", this.x, this.y);

		this.currentLife--;
	}
}

class AddChai {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = unit / 3; // Use unit/4 for consistent scaling
		this.life = 400;
		this.currentLife = this.life;
	}

	drawThis() {
		textAlign(CENTER, CENTER);
		let addChaiRadius = this.size;
		let bgRadius = addChaiRadius * 1.7;

		// Calculate remaining time (as a fraction)
		let fraction = this.currentLife / this.life;
		let startAngle = -HALF_PI;
		let endAngle = startAngle + fraction * TWO_PI;

		// Draw background circle
		noStroke();
		fill(255);
		ellipse(this.x, this.y, bgRadius, bgRadius);

		// Draw timer arc
		noFill();
		stroke(120, 255, 120);
		strokeWeight(addChaiRadius * 0.13);
		arc(this.x, this.y, bgRadius * 0.95, bgRadius * 0.95, startAngle, endAngle);

		// Draw AddChai image
		if (iAddChaiImg) {
			imageMode(CORNER);
			image(
				iAddChaiImg,
				this.x - addChaiRadius / 2,
				this.y - addChaiRadius / 2,
				addChaiRadius,
				addChaiRadius
			);
		}

		this.currentLife--;
	}
}

class Monster {
	constructor() {
		this.x = width - unit * 2;
		this.y = height / 2;
		this.targetX = this.x;
		this.targetY = this.y;
		this.size = unit / 2;
		this.direction = 1;
		this.health = 10;

		this.targetY = unit / 2;
		this.ww = unit * 3;
		this.hh = this.ww * 0.8;

		this.size = this.hh;
	}

	updateThis(x, y) {
		this.x = x;
		this.y = y;
	}

	drawThis() {
		this.ww = unit * 3;
		this.hh = this.ww * 0.8;

		this.size = this.hh;

		//update position here
		let movementGap = unit / 10;

		let randomAdded = random(
			(movementGap / 2) * this.direction,
			movementGap * this.direction
		);

		this.x = width - unit * 2;
		this.targetY += randomAdded;

		if (this.y < this.size + movementGap * 8) {
			this.direction = 1;
		}

		if (this.y > height - (this.size + movementGap * 8)) {
			this.direction = -1;
		}

		// Move x and y toward the target.
		this.x = lerp(this.x, this.targetX, 0.01);
		this.y = lerp(this.y, this.targetY, 0.01);

		textAlign(CENTER, CENTER);
		textSize(this.size);
		//text("🐸", this.x, this.y);
		image(
			iMonster,
			this.x - this.ww / 2,
			this.y - this.hh / 2,
			this.ww,
			this.hh
		);
	}
}

class Player {
	constructor() {
		this.ww = unit;
		this.hh = this.ww * 1.6;
		this.size = this.hh;

		this.x = this.ww * 1.2;
		this.y = height / 2;
		this.targetX = this.x;
		this.targetY = this.y;

		this.direction = 1;
		this.health = 3;
		this.characterIndex = 0;
	}

	updateThis(x, y) {
		this.x = x;
		this.y = y;
	}

	drawThis() {
		this.ww = unit * 1;
		this.hh = this.ww * 1.6;
		this.size = this.hh;

		// Move x and y toward the target.
		this.x = lerp(this.x, this.targetX, 0.07);
		this.y = lerp(this.y, this.targetY, 0.07);

		textAlign(CENTER, CENTER);
		textSize(this.size);

		// Draw the selected character from the character sheet
		if (characterSheet) {
			let charWidth = 400; // Original character width in sprite sheet
			let charHeight = characterSheet.height;

			// Calculate display dimensions maintaining original aspect ratio
			let displayWidth = this.ww;
			let displayHeight = (displayWidth * charHeight) / charWidth;

			// Center the character vertically within the player's hitbox
			let yOffset = (this.hh - displayHeight) / 2;

			image(
				characterSheet,
				this.x - this.ww / 2,
				this.y - this.hh / 2 + yOffset,
				displayWidth,
				displayHeight,
				this.characterIndex * charWidth,
				0,
				charWidth,
				charHeight
			);
		}

		frontPar = (width / 2 - this.y) * 0.1;
	}
}
