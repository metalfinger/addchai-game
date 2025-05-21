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
let iScreen2;
let iScreen3;
let iScreenBack;
let iScreenCloud;
let clickSound; // Add variable for click sound
let bgMusic1; // Character select music
let bgMusic2; // Game music
let playerShootSound;
let monsterShootSound;
let boomSound;

// New images for character select screen
let iInstruction;
let iLeftArrow;
let iSelectPlayerBtn;

// Game state
let currentScreen = "characterSelect"; // 'characterSelect', 'screen2', 'screen3', 'game', or 'gameOver'
let currentCharacter = 0;
let gameResult = ""; // "victory" or "defeat" to track the game result
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

// Screen transition variables
let isTransitioning = false;
let fadeAlpha = 0;
let FADE_SPEED = 0.05;
let targetScreen = "";

// Debug mode for collision boxes
let debugMode = false;

// Audio level manager
let audioLevels = {
	characterSelect: 0.5, // 50% volume for character select
	game: 0.5, // 50% volume for game
	fadeSpeed: 0.02, // Speed of volume fade
};

let lastVolumeUpdate = 0;
const VOLUME_UPDATE_INTERVAL = 50; // Update volume every 50ms

// Navigation and button positions
let LEFT_ARROW_X;
let LEFT_ARROW_Y;
let RIGHT_ARROW_X;
let RIGHT_ARROW_Y;
let ARROW_SIZE;
let SELECT_BUTTON_X;
let SELECT_BUTTON_Y;
let SELECT_BUTTON_WIDTH;
let SELECT_BUTTON_HEIGHT;

// New image dimensions (will be set in setup/updateCharacterSelectLayout)
let INSTRUCTION_IMG_X,
	INSTRUCTION_IMG_Y,
	INSTRUCTION_IMG_WIDTH,
	INSTRUCTION_IMG_HEIGHT;
let ARROW_IMG_WIDTH, ARROW_IMG_HEIGHT; // Arrow positions (LEFT_ARROW_X, etc.) will be reused
let SELECT_BTN_IMG_WIDTH, SELECT_BTN_IMG_HEIGHT; // Select button position (SELECT_BUTTON_X, etc.) will be reused

// Arrow click animation variables
let leftArrowOffset = 0;
let rightArrowOffset = 0;
let ARROW_CLICK_OFFSET = 10; // pixels to move when clicked
let ARROW_ANIMATION_SPEED = 0.2; // speed of return animation

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
const monsterMinFireRate = 500; // Minimum fire rate for monster

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

// Cloud animation variables
let cloudOffset = 0;
let cloudSpeed = 0.5; // pixels per frame

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
	iScreen2 = loadImage("asset/map/screens/screen2.png"); // Load screen 2
	iScreen3 = loadImage("asset/map/screens/screen3.png"); // Load screen 3
	iScreenBack = loadImage("asset/map/screens/screen-back.jpg"); // Load background
	iScreenCloud = loadImage("asset/map/screens/screen-cloud.png"); // Load cloud layer

	// Load sounds
	clickSound = loadSound("asset/audio/click.mp3");
	bgMusic1 = loadSound("asset/audio/bg1.mp3"); // Character select
	bgMusic2 = loadSound("asset/audio/bg1.mp3"); // Game
	playerShootSound = loadSound("asset/audio/player-shoot.mp3");
	monsterShootSound = loadSound("asset/audio/william-shoot.mp3");
	boomSound = loadSound("asset/audio/boom-general.mp3");

	// Load new UI images for character select
	iInstruction = loadImage("asset/map/screens/instruction.png");
	iLeftArrow = loadImage("asset/map/screens/left_arrow.png");
	iSelectPlayerBtn = loadImage("asset/map/screens/select_player_btn.png");
}

function setup() {
	console.log("Setup started");
	createCanvas(windowWidth, (windowWidth * 9) / 16);

	// Set default font
	textFont("VT323");

	unit = width / 16;

	// Initialize navigation and button positions - will be refined
	// ARROW_SIZE = unit * 0.5; // Will be replaced by image dimensions
	// LEFT_ARROW_X = width / 2 - unit * 3;
	// LEFT_ARROW_Y = height / 2;
	// RIGHT_ARROW_X = width / 2 + unit * 3;
	// RIGHT_ARROW_Y = height / 2;
	// SELECT_BUTTON_WIDTH = unit * 4.2; // Will be replaced by image dimensions
	// SELECT_BUTTON_HEIGHT = unit * 0.7; // Will be replaced by image dimensions
	// SELECT_BUTTON_X = width / 2 - SELECT_BUTTON_WIDTH / 2;
	// SELECT_BUTTON_Y = height - unit * 1.3;

	updateCharacterSelectLayout(); // New function to set positions and sizes

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

	// Start character select music
	if (bgMusic1) {
		try {
			bgMusic1.setVolume(0.5);
			bgMusic1.loop();
		} catch (error) {
			console.log("Error initializing music:", error);
		}
	}
}

function draw() {
	if (isTransitioning) {
		handleTransition();
	} else {
		if (currentScreen === "characterSelect") {
			drawCharacterSelect();
			// Ensure only bgMusic1 is playing
			if (bgMusic2 && bgMusic2.isPlaying()) {
				bgMusic2.stop();
			}
			if (bgMusic1 && !bgMusic1.isPlaying()) {
				try {
					bgMusic1.loop();
				} catch (error) {
					console.log("Error starting music:", error);
				}
			}
			// Fade in character select music
			if (bgMusic1 && millis() - lastVolumeUpdate > VOLUME_UPDATE_INTERVAL) {
				try {
					let targetVolume = audioLevels.characterSelect;
					let currentVolume = bgMusic1.getVolume();
					if (currentVolume < targetVolume) {
						bgMusic1.setVolume(
							Math.min(targetVolume, currentVolume + audioLevels.fadeSpeed)
						);
						lastVolumeUpdate = millis();
					}
				} catch (error) {
					console.log("Error updating volume:", error);
				}
			}
		} else if (currentScreen === "screen2") {
			drawScreen2();
		} else if (currentScreen === "screen3") {
			drawScreen3();
		} else if (currentScreen === "gameOver") {
			drawGameOver();
		} else {
			drawGame();
			// Ensure only bgMusic2 is playing
			if (bgMusic1 && bgMusic1.isPlaying()) {
				bgMusic1.stop();
			}
			if (bgMusic2 && !bgMusic2.isPlaying()) {
				try {
					bgMusic2.loop();
				} catch (error) {
					console.log("Error starting music:", error);
				}
			}
			// Fade in game music
			if (bgMusic2 && millis() - lastVolumeUpdate > VOLUME_UPDATE_INTERVAL) {
				try {
					let targetVolume = audioLevels.game;
					let currentVolume = bgMusic2.getVolume();
					if (currentVolume < targetVolume) {
						bgMusic2.setVolume(
							Math.min(targetVolume, currentVolume + audioLevels.fadeSpeed)
						);
						lastVolumeUpdate = millis();
					}
				} catch (error) {
					console.log("Error updating volume:", error);
				}
			}
		}
	}
}

function drawCharacterSelect() {
	noStroke(); // Prevent outlines
	// Draw the background image if loaded, else fallback to black
	if (iBackPlayer) {
		let imgAspectRatio = iBackPlayer.width / iBackPlayer.height;
		let canvasAspectRatio = width / height;
		let drawWidth, drawHeight, x, y;

		if (imgAspectRatio < canvasAspectRatio) {
			// Image is wider than canvas, fit by width
			drawWidth = width;
			drawHeight = width / imgAspectRatio;
			x = 0;
			y = (height - drawHeight) / 2;
		} else {
			// Image is taller than canvas, fit by height
			drawHeight = height;
			drawWidth = height * imgAspectRatio;
			x = (width - drawWidth) / 2;
			y = 0;
		}
		image(iBackPlayer, x, y, drawWidth, drawHeight);
	} else {
		background(0);
	}

	// Draw instruction image
	if (iInstruction) {
		image(
			iInstruction,
			INSTRUCTION_IMG_X,
			INSTRUCTION_IMG_Y,
			INSTRUCTION_IMG_WIDTH,
			INSTRUCTION_IMG_HEIGHT
		);
	}

	if (characterSheet) {
		// Each character is 400px wide in the original image
		let charWidth = 400;
		let charHeight = characterSheet.height;

		// Calculate the position to center the character with unit-based size
		let displayWidth = unit * 4; // 4 units wide
		let displayHeight = (displayWidth * charHeight) / charWidth;
		let x = (width - displayWidth) / 2;
		let y = (height - displayHeight) / 2 + unit * 0.5;

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

	// Add text at the bottom
	textSize(unit * 0.5);
	stroke(255); // White outline
	strokeWeight(unit * 0.05); // Adjust outline thickness as needed
	fill(255, 0, 0); // Red color
	textAlign(CENTER, BOTTOM);
	text("Press Enter to select the player", width / 2, height - unit * 0.2);
	noStroke(); // Reset stroke so it doesn't affect other elements
}

function drawNavigationArrows() {
	//fill FF2D2D
	// fill(255, 45, 45); // No longer needed for image-based arrows

	// Left arrow image
	if (iLeftArrow) {
		image(
			iLeftArrow,
			LEFT_ARROW_X + leftArrowOffset - ARROW_IMG_WIDTH / 2,
			LEFT_ARROW_Y - ARROW_IMG_HEIGHT / 2,
			ARROW_IMG_WIDTH,
			ARROW_IMG_HEIGHT
		);
	}
	// triangle(
	// 	LEFT_ARROW_X + leftArrowOffset,
	// 	LEFT_ARROW_Y,
	// 	LEFT_ARROW_X + unit * 0.5 + leftArrowOffset,
	// 	LEFT_ARROW_Y - ARROW_SIZE,
	// 	LEFT_ARROW_X + unit * 0.5 + leftArrowOffset,
	// 	LEFT_ARROW_Y + ARROW_SIZE
	// );

	// Right arrow image (rotated left arrow)
	if (iLeftArrow) {
		push();
		translate(RIGHT_ARROW_X + rightArrowOffset, RIGHT_ARROW_Y);
		rotate(PI); // Rotate 180 degrees
		image(
			iLeftArrow,
			-ARROW_IMG_WIDTH / 2,
			-ARROW_IMG_HEIGHT / 2,
			ARROW_IMG_WIDTH,
			ARROW_IMG_HEIGHT
		);
		pop();
	}
	// triangle(
	// 	RIGHT_ARROW_X + rightArrowOffset,
	// 	RIGHT_ARROW_Y,
	// 	RIGHT_ARROW_X - unit * 0.5 + rightArrowOffset,
	// 	RIGHT_ARROW_Y - ARROW_SIZE,
	// 	RIGHT_ARROW_X - unit * 0.5 + rightArrowOffset,
	// 	RIGHT_ARROW_Y + ARROW_SIZE
	// );

	// Draw select button image
	if (iSelectPlayerBtn) {
		image(
			iSelectPlayerBtn,
			SELECT_BUTTON_X,
			SELECT_BUTTON_Y,
			SELECT_BTN_IMG_WIDTH,
			SELECT_BTN_IMG_HEIGHT
		);
	}
	// rect(
	// 	SELECT_BUTTON_X,
	// 	SELECT_BUTTON_Y,
	// 	SELECT_BUTTON_WIDTH,
	// 	SELECT_BUTTON_HEIGHT
	// );
	// fill(0);
	// textSize(unit * 0.6);
	// textAlign(CENTER, CENTER);
	// text("Select Character", width / 2, height - unit * 1);

	// Animate arrow offsets back to zero
	leftArrowOffset = lerp(leftArrowOffset, 0, ARROW_ANIMATION_SPEED);
	rightArrowOffset = lerp(rightArrowOffset, 0, ARROW_ANIMATION_SPEED);
}

function mousePressed() {
	if (currentScreen === "characterSelect" && !isTransitioning) {
		// Check if left arrow was clicked
		if (
			iLeftArrow && // Ensure image is loaded
			mouseX > LEFT_ARROW_X - ARROW_IMG_WIDTH / 2 &&
			mouseX < LEFT_ARROW_X + ARROW_IMG_WIDTH / 2 &&
			mouseY > LEFT_ARROW_Y - ARROW_IMG_HEIGHT / 2 &&
			mouseY < LEFT_ARROW_Y + ARROW_IMG_HEIGHT / 2
		) {
			currentCharacter = (currentCharacter - 1 + 11) % 11;
			leftArrowOffset = -ARROW_CLICK_OFFSET;
			clickSound.play();
		}

		// Check if right arrow was clicked
		if (
			iLeftArrow && // Ensure image is loaded (used for right arrow too)
			mouseX > RIGHT_ARROW_X - ARROW_IMG_WIDTH / 2 &&
			mouseX < RIGHT_ARROW_X + ARROW_IMG_WIDTH / 2 &&
			mouseY > RIGHT_ARROW_Y - ARROW_IMG_HEIGHT / 2 &&
			mouseY < RIGHT_ARROW_Y + ARROW_IMG_HEIGHT / 2
		) {
			currentCharacter = (currentCharacter + 1) % 11;
			rightArrowOffset = ARROW_CLICK_OFFSET;
			clickSound.play();
		}

		// Check if select button was clicked
		if (
			iSelectPlayerBtn && // Ensure image is loaded
			mouseX > SELECT_BUTTON_X &&
			mouseX < SELECT_BUTTON_X + SELECT_BTN_IMG_WIDTH &&
			mouseY > SELECT_BUTTON_Y &&
			mouseY < SELECT_BUTTON_Y + SELECT_BTN_IMG_HEIGHT
		) {
			p.characterIndex = currentCharacter;
			startTransition("screen2");
		}
	}
}

function keyPressed() {
	if (currentScreen === "characterSelect" && !isTransitioning) {
		if (keyCode === LEFT_ARROW) {
			currentCharacter = (currentCharacter - 1 + 11) % 11;
			leftArrowOffset = -ARROW_CLICK_OFFSET;
			clickSound.play();
		}
		if (keyCode === RIGHT_ARROW) {
			currentCharacter = (currentCharacter + 1) % 11;
			rightArrowOffset = ARROW_CLICK_OFFSET;
			clickSound.play();
		}
		if (keyCode === ENTER) {
			p.characterIndex = currentCharacter;
			startTransition("screen2");
		}
	} else if (currentScreen === "screen2" && !isTransitioning) {
		startTransition("screen3");
	} else if (currentScreen === "screen3" && !isTransitioning) {
		startTransition("game");
	} else if (currentScreen === "gameOver" && !isTransitioning) {
		if (keyCode === ENTER) {
			// Reset core game play elements for a new game
			p.health = 3;
			m.health = 10;
			mFlameArray = [];
			playerWeapons = [];
			blastArray = [];
			addChaiArray = [];
			fireRate = defaultFireRate;
			shootingPowerupTimer = 0;

			// gameResult, gameStartTime, gameEndTime, lastGameDuration are NOT reset here.
			// They will be handled by the transition to the new game screen.

			startTransition("game"); // Transition will fade out the gameOver screen content
		}
	} else if (!isTransitioning) {
		if (keyCode === 32) {
			// Space bar
			fireWeapon();
		}
	}

	// Toggle debug mode with 'D' key
	if (keyCode === 68) {
		// 68 is the keyCode for 'D'
		debugMode = !debugMode;
		console.log("Debug mode: " + (debugMode ? "ON" : "OFF"));
	}
}

function windowResized() {
	resizeCanvas(windowWidth, (windowWidth * 9) / 16);

	unit = width / 16;

	// Update navigation and button positions
	// ARROW_SIZE = unit * 0.5; // Replaced by image dimensions
	// LEFT_ARROW_X = width / 2 - unit * 3;
	// LEFT_ARROW_Y = height / 2;
	// RIGHT_ARROW_X = width / 2 + unit * 3;
	// RIGHT_ARROW_Y = height / 2;
	// SELECT_BUTTON_WIDTH = unit * 4.2; // Replaced by image dimensions
	// SELECT_BUTTON_HEIGHT = unit * 0.7; // Replaced by image dimensions
	// SELECT_BUTTON_X = width / 2 - SELECT_BUTTON_WIDTH / 2;
	// SELECT_BUTTON_Y = height - unit * 1.3;

	updateCharacterSelectLayout(); // Recalculate layout on resize

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
		if (monsterShootSound) monsterShootSound.play();
	}

	//add addchai randomly
	//AddChai
	if (shootingPowerupTimer === 0 && random(0, 1000) < 4) {
		// Define safe spawn area based on player movement bounds
		const marginX = p.ww + unit / 2;
		const marginY = p.hh + unit / 2;
		const minX = marginX;
		const maxX = width / 2 - marginX;
		const minY = marginY;
		const maxY = height - marginY;

		let randomYPos = random(minY, maxY);
		let randomXPos = random(minX, maxX);

		// Optionally, avoid spawning too close to the player
		if (dist(randomXPos, randomYPos, p.x, p.y) < unit * 2) {
			// If too close, nudge further away
			randomXPos = constrain(randomXPos + unit * 2, minX, maxX);
			randomYPos = constrain(randomYPos + unit * 2, minY, maxY);
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
			if (boomSound) boomSound.play();

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
			if (boomSound) boomSound.play();

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
				if (boomSound) boomSound.play();

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
			fireRate = 300;
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
	if (shootingPowerupTimer > 0) {
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
	if (m.health <= 0) {
		if (gameEndTime === 0) {
			gameEndTime = millis();
			lastGameDuration = gameEndTime - gameStartTime;
		}
		gameResult = "victory";
		currentScreen = "gameOver";
	} else if (p.health <= 0) {
		if (gameEndTime === 0) {
			gameEndTime = millis();
			lastGameDuration = gameEndTime - gameStartTime;
		}
		gameResult = "defeat";
		currentScreen = "gameOver";
	}
}

function checkCollision(entity1, entity2) {
	// Use the maximum of width and height for each entity as the collision diameter
	const getSpriteDiameter = (e) => {
		if (typeof e.collisionDiameter === "number") {
			return e.collisionDiameter;
		}
		if (e.ww && e.hh) {
			return Math.max(e.ww, e.hh);
		}
		return e.size || 0;
	};
	let d = dist(entity1.x, entity1.y, entity2.x, entity2.y);
	let r1 = getSpriteDiameter(entity1) / 2;
	let r2 = getSpriteDiameter(entity2) / 2;
	return d < r1 + r2;
}

function fireWeapon() {
	let currentTime = millis();
	if (currentTime - lastFired > fireRate) {
		let w = new Weapon(p.x + unit / 2, p.y);
		playerWeapons.push(w);
		lastFired = currentTime; // Update the last fired time
		if (playerShootSound) playerShootSound.play();
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

	// Draw background
	if (iScreenBack) {
		// Calculate dimensions to maintain aspect ratio
		let imgAspectRatio = iScreenBack.width / iScreenBack.height;
		let canvasAspectRatio = width / height;
		let drawWidth, drawHeight, x, y;

		if (imgAspectRatio < canvasAspectRatio) {
			drawWidth = width;
			drawHeight = width / imgAspectRatio;
			x = 0;
			y = (height - drawHeight) / 2;
		} else {
			drawHeight = height;
			drawWidth = height * imgAspectRatio;
			x = (width - drawWidth) / 2;
			y = 0;
		}

		image(iScreenBack, x, y, drawWidth, drawHeight);
	}

	// Draw animated clouds
	drawClouds();

	// Draw win/lose message with outline
	textAlign(CENTER, CENTER);
	textSize(unit * 2);

	// Draw text outline
	stroke(0);
	strokeWeight(unit * 0.1);
	if (gameResult === "victory") {
		fill(0, 255, 0);
		text("VICTORY!", width / 2, height / 2);
	} else {
		fill(255, 0, 0);
		text("GAME OVER", width / 2, height / 2);
	}
	noStroke();

	// Draw time spent
	if (lastGameDuration > 0) {
		let seconds = floor(lastGameDuration / 1000);
		let minutes = floor(seconds / 60);
		let displaySeconds = seconds % 60;
		let timeStr = nf(minutes, 2) + ":" + nf(displaySeconds, 2);
		textSize(unit * 0.7);
		// Draw time text outline
		stroke(0);
		strokeWeight(unit * 0.05);
		fill(255, 255, 0);
		text("Time: " + timeStr, width / 2, height / 2 + unit * 1.7);
		noStroke();
	}

	// Draw restart instruction at bottom with outline
	textSize(unit * 0.5);
	stroke(0);
	strokeWeight(unit * 0.05);
	fill(255);
	text("Press ENTER to restart", width / 2, height - unit);
	noStroke();
}

function handleTransition() {
	// Draw the current screen first (before transition)
	if (FADE_SPEED > 0) {
		// Fading out
		if (currentScreen === "characterSelect") {
			drawCharacterSelect();
		} else if (currentScreen === "screen2") {
			drawScreen2();
		} else if (currentScreen === "screen3") {
			drawScreen3();
		} else if (currentScreen === "gameOver") {
			drawGameOver();
		} else {
			drawGame();
		}
	} else {
		// Fading in
		if (targetScreen === "characterSelect") {
			drawCharacterSelect();
		} else if (targetScreen === "screen2") {
			drawScreen2();
		} else if (targetScreen === "screen3") {
			drawScreen3();
		} else if (targetScreen === "gameOver") {
			drawGameOver();
		} else {
			drawGame();
		}
	}

	// Draw fade overlay
	fill(0, fadeAlpha);
	rect(0, 0, width, height);

	// Fade out
	if (FADE_SPEED > 0 && fadeAlpha < 255) {
		fadeAlpha += FADE_SPEED * 255;
	} else if (FADE_SPEED > 0 && fadeAlpha >= 255) {
		// Switch screens
		let screenWeCameFrom = currentScreen; // Capture the screen we are transitioning FROM
		currentScreen = targetScreen;
		fadeAlpha = 255;

		// If the new screen is the game screen, prepare for a new game session
		if (currentScreen === "game") {
			gameResult = ""; // Reset gameResult for the new game
			gameStartTime = millis();
			gameEndTime = 0;
			lastGameDuration = 0;

			// If we came from character select path, also reset health and arrays
			if (
				screenWeCameFrom === "characterSelect" ||
				screenWeCameFrom === "screen2" ||
				screenWeCameFrom === "screen3"
			) {
				p.health = 3;
				m.health = 10;
				mFlameArray = [];
				playerWeapons = [];
				blastArray = [];
				addChaiArray = [];
				fireRate = defaultFireRate;
				shootingPowerupTimer = 0;
			}
		}

		// Start fading in
		FADE_SPEED = -FADE_SPEED;
	} else if (FADE_SPEED < 0 && fadeAlpha > 0) {
		fadeAlpha += FADE_SPEED * 255;
	} else if (FADE_SPEED < 0 && fadeAlpha <= 0) {
		fadeAlpha = 0;
		FADE_SPEED = Math.abs(FADE_SPEED);
		isTransitioning = false; // Let the main draw/game loop resume
	}
}

function startTransition(newScreen) {
	if (clickSound) clickSound.play(); // Play click sound on transition start
	isTransitioning = true;
	targetScreen = newScreen;
	fadeAlpha = 0;
	FADE_SPEED = Math.abs(FADE_SPEED);
}

// Helper function to draw animated clouds
function drawClouds() {
	if (iScreenCloud) {
		// Calculate cloud dimensions to fit height
		let cloudHeight = height * 1.3; // Use full height
		let cloudWidth = (cloudHeight * iScreenCloud.width) / iScreenCloud.height;

		// Draw multiple cloud images to create seamless scrolling
		let numClouds = ceil(width / cloudWidth) + 1;
		for (let i = -1; i < numClouds; i++) {
			let cloudX = i * cloudWidth + cloudOffset;
			image(iScreenCloud, cloudX, 0, cloudWidth, cloudHeight);
		}

		// Update cloud offset
		cloudOffset -= cloudSpeed;
		if (cloudOffset <= -cloudWidth) {
			cloudOffset = 0;
		}
	}
}

function drawScreen2() {
	noStroke();
	background(0);

	// Draw background
	if (iScreenBack) {
		// Calculate dimensions to maintain aspect ratio
		let imgAspectRatio = iScreenBack.width / iScreenBack.height;
		let canvasAspectRatio = width / height;
		let drawWidth, drawHeight, x, y;

		if (imgAspectRatio < canvasAspectRatio) {
			drawWidth = width;
			drawHeight = width / imgAspectRatio;
			x = 0;
			y = (height - drawHeight) / 2;
		} else {
			drawHeight = height;
			drawWidth = height * imgAspectRatio;
			x = (width - drawWidth) / 2;
			y = 0;
		}

		image(iScreenBack, x, y, drawWidth, drawHeight);
	}

	// Draw animated clouds
	drawClouds();

	// Draw screen content
	if (iScreen2) {
		// Calculate dimensions to maintain aspect ratio
		let imgAspectRatio = iScreen2.width / iScreen2.height;
		let canvasAspectRatio = width / height;
		let drawWidth, drawHeight, x, y;

		if (imgAspectRatio < canvasAspectRatio) {
			drawWidth = width;
			drawHeight = width / imgAspectRatio;
			x = 0;
			y = (height - drawHeight) / 2;
		} else {
			drawHeight = height;
			drawWidth = height * imgAspectRatio;
			x = (width - drawWidth) / 2;
			y = 0;
		}

		image(iScreen2, x, y, drawWidth, drawHeight);
	}
}

function drawScreen3() {
	noStroke();
	background(0);

	// Draw background
	if (iScreenBack) {
		// Calculate dimensions to maintain aspect ratio
		let imgAspectRatio = iScreenBack.width / iScreenBack.height;
		let canvasAspectRatio = width / height;
		let drawWidth, drawHeight, x, y;

		if (imgAspectRatio < canvasAspectRatio) {
			drawWidth = width;
			drawHeight = width / imgAspectRatio;
			x = 0;
			y = (height - drawHeight) / 2;
		} else {
			drawHeight = height;
			drawWidth = height * imgAspectRatio;
			x = (width - drawWidth) / 2;
			y = 0;
		}

		image(iScreenBack, x, y, drawWidth, drawHeight);
	}

	// Draw animated clouds
	drawClouds();

	// Draw screen content
	if (iScreen3) {
		// Calculate dimensions to maintain aspect ratio
		let imgAspectRatio = iScreen3.width / iScreen3.height;
		let canvasAspectRatio = width / height;
		let drawWidth, drawHeight, x, y;

		if (imgAspectRatio < canvasAspectRatio) {
			drawWidth = width;
			drawHeight = width / imgAspectRatio;
			x = 0;
			y = (height - drawHeight) / 2;
		} else {
			drawHeight = height;
			drawWidth = height * imgAspectRatio;
			x = (width - drawWidth) / 2;
			y = 0;
		}

		image(iScreen3, x, y, drawWidth, drawHeight);
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
		this.collisionDiameter = this.ww * 0.8; // Added collisionDiameter
	}

	updateThis(x, y) {
		this.x = x;
		this.y = y;
	}

	drawThis() {
		this.ww = unit / 1;
		this.hh = this.ww * 0.45;
		this.size = this.ww; // Collision size for MonsterFlame is its width
		this.collisionDiameter = this.ww * 0.8; // Update collisionDiameter

		// Draw debug collision boundary if debugMode is active
		if (debugMode) {
			noFill();
			stroke(0, 255, 255, 150); // Cyan, semi-transparent
			strokeWeight(2);
			ellipse(this.x, this.y, this.size, this.size); // Draw as a circle with diameter 'this.size'
			noStroke();
		}

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
		this.size = this.hh; // Corrected: was this.ww, now consistent with drawThis logic for collision
		this.collisionDiameter = this.ww * 2; // Added collisionDiameter
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
		this.collisionDiameter = this.ww * 2; // Update collisionDiameter

		// Draw debug collision boundary if debugMode is active
		if (debugMode) {
			noFill();
			stroke(255, 255, 0, 150); // Yellow, semi-transparent
			strokeWeight(2);
			// For Weapon, collision is based on this.size which is this.hh
			ellipse(this.x, this.y, this.collisionDiameter, this.collisionDiameter); // Draw as a circle with diameter 'this.size'
			noStroke();
		}

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
		this.collisionDiameter = this.size; // Added collisionDiameter
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
		this.size = unit / 3; // Use unit/4 for consistent scaling (this is radius)
		this.life = 400;
		this.currentLife = this.life;
		this.collisionDiameter = this.size * 2.0; // Added collisionDiameter (size is radius)
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
		// this.size = unit / 2; // Original size, less relevant now with ww/hh
		this.direction = 1;
		this.health = 10;

		this.targetY = unit / 2;
		this.ww = unit * 3;
		this.hh = this.ww * 0.8;

		this.size = this.hh; // Retained for any legacy use, but collisionDiameter is primary
		this.collisionDiameter = Math.max(this.ww, this.hh) * 0.7; // Added collisionDiameter
	}

	updateThis(x, y) {
		this.x = x;
		this.y = y;
	}

	drawThis() {
		this.ww = unit * 3;
		this.hh = this.ww * 0.8;
		this.size = this.hh; // Collision for Monster is based on its height (this.hh)
		this.collisionDiameter = Math.max(this.ww, this.hh) * 0.7; // Update collisionDiameter

		// Draw debug collision boundary if debugMode is active
		if (debugMode) {
			noFill();
			stroke(255, 0, 0, 150); // Red, semi-transparent
			strokeWeight(2);
			// Monster's collision diameter in checkCollision is Math.max(this.ww, this.hh)
			// but its .size is set to this.hh. For consistency with checkCollision:
			let collisionDiameter = Math.max(this.ww, this.hh);
			ellipse(this.x, this.y, collisionDiameter, collisionDiameter);
			noStroke();
		}

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

		this.collisionDiameter = Math.max(this.ww, this.hh) * 0.6;
	}

	updateThis(x, y) {
		this.x = x;
		this.y = y;
	}

	drawThis() {
		this.ww = unit * 1;
		this.hh = this.ww * 1.6;
		this.size = this.hh;

		// Draw debug collision boundary if debugMode is active
		if (debugMode) {
			noFill();
			stroke(0, 255, 0, 150); // Green, semi-transparent
			strokeWeight(2);
			// Player's collision diameter in checkCollision is Math.max(this.ww, this.hh)
			// but its .size is set to this.hh. For consistency with checkCollision:

			ellipse(this.x, this.y, this.collisionDiameter, this.collisionDiameter);
			noStroke();
		}

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

// New function to calculate character select screen UI element positions and sizes
function updateCharacterSelectLayout() {
	// Instruction Image (top center)
	// Assuming instruction image should be responsive, e.g., 80% of canvas width
	// and maintain its aspect ratio. Adjust as needed.
	if (iInstruction && iInstruction.width > 0) {
		// Check if image is loaded
		let aspectRatio = iInstruction.height / iInstruction.width;
		INSTRUCTION_IMG_WIDTH = width * 0.3; // Example: 60% of canvas width
		INSTRUCTION_IMG_HEIGHT = INSTRUCTION_IMG_WIDTH * aspectRatio;
		INSTRUCTION_IMG_X = (width - INSTRUCTION_IMG_WIDTH) / 2;
		INSTRUCTION_IMG_Y = unit * 0.5; // Example: 0.5 unit from top
	} else {
		// Default/fallback values if image not loaded yet
		INSTRUCTION_IMG_WIDTH = 0;
		INSTRUCTION_IMG_HEIGHT = 0;
		INSTRUCTION_IMG_X = 0;
		INSTRUCTION_IMG_Y = 0;
	}

	// Arrow Images
	// Size based on 'unit', e.g., 1 unit wide. Adjust as needed.
	if (iLeftArrow && iLeftArrow.width > 0) {
		// Check if image is loaded
		let arrowAspectRatio = iLeftArrow.height / iLeftArrow.width;
		ARROW_IMG_WIDTH = unit * 1.5;
		ARROW_IMG_HEIGHT = ARROW_IMG_WIDTH * arrowAspectRatio;
	} else {
		ARROW_IMG_WIDTH = unit * 1.5; // Fallback size
		ARROW_IMG_HEIGHT = unit * 1.5; // Fallback size (assuming square if not loaded)
	}
	LEFT_ARROW_X = width / 2 - unit * 3.5; // Adjusted spacing
	LEFT_ARROW_Y = height / 2 + unit * 0.5; // Align with character center
	RIGHT_ARROW_X = width / 2 + unit * 3.5; // Adjusted spacing
	RIGHT_ARROW_Y = height / 2 + unit * 0.5; // Align with character center

	// Select Player Button Image (bottom center)
	// Size based on 'unit', e.g., 4 units wide. Adjust as needed.
	if (iSelectPlayerBtn && iSelectPlayerBtn.width > 0) {
		// Check if image is loaded
		let btnAspectRatio = iSelectPlayerBtn.height / iSelectPlayerBtn.width;
		SELECT_BTN_IMG_WIDTH = unit * 5;
		SELECT_BTN_IMG_HEIGHT = SELECT_BTN_IMG_WIDTH * btnAspectRatio;
	} else {
		SELECT_BTN_IMG_WIDTH = unit * 5; // Fallback size
		SELECT_BTN_IMG_HEIGHT = unit * 1; // Fallback size
	}
	SELECT_BUTTON_X = (width - SELECT_BTN_IMG_WIDTH) / 2;
	SELECT_BUTTON_Y = height - unit * 1.3 - SELECT_BTN_IMG_HEIGHT / 2; // Position above bottom edge
}
