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

// Graphics buffers for pre-scaled parallax layers
let gAddChai1, gAddChai2, gAddChai3, gAddChai4;
let parallaxBuffersInitialized = false; // Flag to track buffer initialization

// Graphics buffer for pre-scaled static screen background
let gScreenBack;
let screenBackBufferInitialized = false;

// Graphics buffer for pre-rendered scrolling clouds
let gCloudsBuffer;
let cloudsBufferInitialized = false;
let gCloudBufferWidth = 0;
let gCloudBufferHeight = 0;

let iMonster;
let iPlayer;
let iFlame;
let iWeapon;
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

// Video variables
let introVideo;
let victoryVideo;
let onIntroEnd; // To hold a reference to the 'ended' event handler
let videoLoaded = false;
let victoryVideoLoaded = false;

// Game state
let currentScreen = "welcome"; // 'welcome', 'intro', 'characterSelect', 'screen2', 'screen3', 'game', or 'gameOver'
let currentCharacter = 0;
let gameResult = ""; // "victory" or "defeat" to track the game result
const TOTAL_CHARACTERS = 10;
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
];

// Screen transition variables
let isTransitioning = false;
let fadeAlpha = 0;
let FADE_SPEED = 0.08; // Increased speed for quicker transitions
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
const VOLUME_UPDATE_INTERVAL = 200; // Update volume every 200ms (reduced frequency for better performance)

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
let ARROW_CLICK_OFFSET; // pixels to move when clicked (was 10) - Will be initialized in setup/windowResized
let ARROW_ANIMATION_SPEED = 0.2; // speed of return animation

// Parallax offset values
let PARALLAX_OFFSET_UP; // Was -95 - Will be initialized in setup/windowResized
let PARALLAX_OFFSET_DOWN; // Will be initialized in setup/windowResized

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
let lastGameDuration = 95000; // 1 minute 35 seconds for demo

// Sample leaderboard data for testing (remove this in production)
let sampleLeaderboardData = [
	{ name: "Hiren", time: 72000 }, // 1:12
	{ name: "Kedar", time: 85000 }, // 1:25
	{ name: "Manav", time: 91000 }, // 1:31
	{ name: "Jin", time: 103000 }, // 1:43
	{ name: "Reva", time: 118000 }, // 1:58
];

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
let cloudSpeed; // pixels per frame - Will be initialized in setup and windowResized

// Score submission variables
let nameInput;
let submitButton;
let scoreSubmitted = false;
let playerName = "";

// Leaderboard variables
let leaderboardData = [];
let isLoadingLeaderboard = false;
let leaderboardLoaded = false;

function preload() {
	// Preload any assets here if needed
	console.log("Preload started");

	// Load all images
	iMonster = loadImage("asset/William.png");
	iFlame = loadImage("asset/Blastt.png");
	characterSheet = loadImage("asset/character/Character Sheet_final.png");
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

	// Load weapon image
	iWeapon = loadImage("asset/weapon_web.png");

	// Load new UI images for character select
	iInstruction = loadImage("asset/map/screens/instruction.png");
	iLeftArrow = loadImage("asset/map/screens/left_arrow.png");
	iSelectPlayerBtn = loadImage("asset/map/screens/select_player_btn.png");

	// Load intro video
	introVideo = createVideo(["asset/video/introvideo_web.mp4"]);
	introVideo.hide(); // Hide the video element from the DOM
	introVideo.volume(0); // Mute the video to allow autoplay
	introVideo.elt.muted = true; // Set muted attribute for browser autoplay policy

	// Set up video event listeners using DOM events
	onIntroEnd = () => {
		console.log("Intro video ended");
		startTransition("characterSelect");
		// It's good practice to remove the listener once it's fired.
		if (introVideo && onIntroEnd) {
			introVideo.elt.removeEventListener("ended", onIntroEnd);
		}
	};
	introVideo.elt.addEventListener("ended", onIntroEnd);

	introVideo.elt.addEventListener("canplaythrough", () => {
		videoLoaded = true;
		console.log("Intro video loaded and ready to play");
	});

	introVideo.elt.addEventListener("loadeddata", () => {
		if (!videoLoaded) {
			videoLoaded = true;
			console.log("Intro video loaded via loadeddata event");
		}
	});

	// Load victory video
	victoryVideo = createVideo(["asset/video/postvideo_web.mp4"]);
	victoryVideo.hide(); // Hide the video element from the DOM
	victoryVideo.volume(0); // Mute the video to allow autoplay
	victoryVideo.elt.muted = true; // Set muted attribute for browser autoplay policy
	victoryVideo.elt.loop = true; // Loop the victory video

	// Set up victory video event listeners
	victoryVideo.elt.addEventListener("canplaythrough", () => {
		victoryVideoLoaded = true;
		console.log("Victory video loaded and ready to play");
	});

	victoryVideo.elt.addEventListener("loadeddata", () => {
		if (!victoryVideoLoaded) {
			victoryVideoLoaded = true;
			console.log("Victory video loaded via loadeddata event");
		}
	});
}

function setup() {
	console.log("Setup started");

	// Calculate canvas size to fit window while maintaining 16:9 aspect ratio
	let targetAspectRatio = 16 / 9;
	let windowAspectRatio = windowWidth / windowHeight;

	let canvasWidth, canvasHeight;
	if (windowAspectRatio > targetAspectRatio) {
		// Window is wider than 16:9, fit by height
		canvasHeight = windowHeight;
		canvasWidth = canvasHeight * targetAspectRatio;
	} else {
		// Window is taller than or equal to 16:9, fit by width
		canvasWidth = windowWidth;
		canvasHeight = canvasWidth / targetAspectRatio;
	}

	createCanvas(canvasWidth, canvasHeight);

	// Set default font
	textFont("VT323");

	unit = width / 16;
	cloudSpeed = -unit / 2000; // Initialize cloudSpeed here
	ARROW_CLICK_OFFSET = unit / 1.6; // Initialize ARROW_CLICK_OFFSET here
	PARALLAX_OFFSET_UP = -unit * 6; // Initialize PARALLAX_OFFSET_UP here
	PARALLAX_OFFSET_DOWN = -unit; // Initialize PARALLAX_OFFSET_DOWN here

	updateCharacterSelectLayout(); // New function to set positions and sizes

	// Update CSS variables for responsive design
	updateFormCSSVariables();

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

	m = new Monster();
	p = new Player();

	//loading images
	iMonster = loadImage("asset/William.png");
	// iPlayer = loadImage("asset/Playerr.png"); // Not used
	iFlame = loadImage("asset/Blastt.png");
	// iWeapon = loadImage("asset/Weaponn.png"); // Not used

	console.log("Setup completed");

	gameStartTime = millis();
	gameEndTime = 0;
	lastGameDuration = 0;

	iAddChaiImg = loadImage("asset/addchai.png");

	// Don't start character select music immediately - wait for intro to finish
	// The music will start when we transition to character select screen
	screenBackBufferInitialized = updateScreenBackBuffer(); // Initialize static background buffer
	if (!screenBackBufferInitialized) {
		console.warn(
			"ScreenBack buffer not initialized during setup. Will attempt in draw loops."
		);
	}
	cloudsBufferInitialized = updateCloudsBuffer(); // Initialize clouds buffer
	if (!cloudsBufferInitialized) {
		console.warn(
			"Clouds buffer not initialized during setup. Will attempt in draw loops."
		);
	}

	// In your game's main file, when everything is loaded:
	// Send ready signal to parent window (for iframe embedding)
	if (window.parent !== window) {
		window.parent.postMessage("gameReady", "https://www.addchai.com"); // Specific domain for security
	}
}

// Firebase helper functions
async function submitScore(playerName, time) {
	try {
		if (!window.firebaseDB) {
			console.error("Firebase not initialized");
			return false;
		}

		const scoresCollection = window.firebaseCollection(
			window.firebaseDB,
			"leaderboard"
		);
		await window.firebaseAddDoc(scoresCollection, {
			name: playerName,
			time: time,
			timestamp: Date.now(),
			date: new Date().toISOString(),
		});
		console.log("Score submitted successfully");
		return true;
	} catch (error) {
		console.error("Error submitting score:", error);
		return false;
	}
}

async function loadLeaderboard() {
	try {
		if (!window.firebaseDB) {
			console.warn("Firebase not initialized, using sample data");
			leaderboardData = [...sampleLeaderboardData];
			isLoadingLeaderboard = false;
			leaderboardLoaded = true;
			return;
		}

		isLoadingLeaderboard = true;
		const scoresCollection = window.firebaseCollection(
			window.firebaseDB,
			"leaderboard"
		);
		const q = window.firebaseQuery(
			scoresCollection,
			window.firebaseOrderBy("time", "asc"),
			window.firebaseLimit(5)
		);

		const querySnapshot = await window.firebaseGetDocs(q);
		leaderboardData = [];

		querySnapshot.forEach((doc) => {
			leaderboardData.push(doc.data());
		});

		// If no Firebase data, use sample data
		if (leaderboardData.length === 0) {
			leaderboardData = [...sampleLeaderboardData];
		}

		isLoadingLeaderboard = false;
		leaderboardLoaded = true;
		console.log("Leaderboard loaded:", leaderboardData);
	} catch (error) {
		console.error("Error loading leaderboard:", error);
		console.log("Falling back to sample data");
		leaderboardData = [...sampleLeaderboardData];
		isLoadingLeaderboard = false;
		leaderboardLoaded = true;
	}
}

function formatTime(milliseconds) {
	let seconds = floor(milliseconds / 1000);
	let minutes = floor(seconds / 60);
	let displaySeconds = seconds % 60;
	return nf(minutes, 2) + ":" + nf(displaySeconds, 2);
}

// UI Helper Functions
function drawGlowText(txt, x, y, size, innerColor, outerColor) {
	textAlign(CENTER, CENTER);
	textSize(size);

	// Outer glow
	for (let r = 8; r > 0; r--) {
		stroke(red(outerColor), green(outerColor), blue(outerColor), 30);
		strokeWeight(r);
		fill(red(innerColor), green(innerColor), blue(innerColor), 200);
		text(txt, x, y);
	}

	// Inner text
	noStroke();
	fill(innerColor);
	text(txt, x, y);
}

function drawTimeDisplay(timeStr, x, y) {
	// Background panel for time
	let panelWidth = unit * 4;
	let panelHeight = unit * 1.2;

	// Panel background with border
	fill(30, 30, 50, 200);
	stroke(255, 215, 0);
	strokeWeight(3);
	rect(
		x - panelWidth / 2,
		y - panelHeight / 2,
		panelWidth,
		panelHeight,
		unit * 0.2
	);

	// Time text
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(unit * 0.6);
	fill(255, 215, 0);
	text("YOUR TIME", x, y - unit * 0.25);

	textSize(unit * 0.8);
	fill(255);
	text(timeStr, x, y + unit * 0.25);
}

function drawPanel(x, y, w, h, title, titleColor) {
	// Panel background
	fill(20, 25, 40, 220);
	stroke(100, 150, 200);
	strokeWeight(2);
	rect(x, y, w, h, unit * 0.3);

	// Panel header
	fill(30, 40, 60, 250);
	rect(x, y, w, unit * 1.2, unit * 0.3);

	// Title
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(unit * 0.5);
	fill(titleColor);
	text(title, x + w / 2, y + unit * 0.6);

	return y + unit * 1.5; // Return content start Y position
}

function drawLeaderboardPanel(x, y, w, h) {
	let contentY = drawPanel(x, y, w, h, "🏆 TOP 5 PLAYERS", color(255, 215, 0));

	if (isLoadingLeaderboard) {
		// Loading animation
		textAlign(CENTER, CENTER);
		textSize(unit * 0.4);
		fill(150, 150, 255);
		let dots = ".".repeat((currentTime / 500) % 4);
		text("Loading" + dots, x + w / 2, contentY + unit * 1.5);
	} else if (leaderboardLoaded && leaderboardData.length > 0) {
		// Leaderboard entries with proper spacing
		let entryHeight = unit * 0.6;
		let entrySpacing = unit * 0.1;

		for (let i = 0; i < Math.min(5, leaderboardData.length); i++) {
			let rank = i + 1;
			let player = leaderboardData[i];
			let displayTime = formatTime(player.time);
			let entryY = contentY + unit * 0.3 + i * (entryHeight + entrySpacing);

			// Medal/rank styling
			let medalColor;
			let medalIcon;
			if (rank === 1) {
				medalColor = color(255, 215, 0);
				medalIcon = "🥇";
			} else if (rank === 2) {
				medalColor = color(192, 192, 192);
				medalIcon = "🥈";
			} else if (rank === 3) {
				medalColor = color(205, 127, 50);
				medalIcon = "🥉";
			} else {
				medalColor = color(255, 255, 255);
				medalIcon = rank + ".";
			}

			// Entry background for top 3
			if (rank <= 3) {
				fill(40, 40, 60, 150);
				rect(
					x + unit * 0.15,
					entryY - entryHeight / 2,
					w - unit * 0.3,
					entryHeight,
					unit * 0.1
				);
			}

			// Rank/Medal
			textAlign(LEFT, CENTER);
			textSize(unit * 0.3);
			fill(medalColor);
			text(medalIcon, x + unit * 0.3, entryY);

			// Player name (truncate if too long)
			textSize(unit * 0.32);
			fill(255);
			let displayName =
				player.name.length > 12
					? player.name.substring(0, 12) + "..."
					: player.name;
			text(displayName, x + unit * 0.9, entryY);

			// Time
			textAlign(RIGHT, CENTER);
			textSize(unit * 0.3);
			fill(150, 255, 150);
			text(displayTime, x + w - unit * 0.3, entryY);
		}
	} else {
		// No scores message
		textAlign(CENTER, CENTER);
		textSize(unit * 0.35);
		fill(150, 150, 150);
		text("🎮", x + w / 2, contentY + unit * 1);
		text("No scores yet!", x + w / 2, contentY + unit * 1.5);
		textSize(unit * 0.3);
		text("Be the first to set a record!", x + w / 2, contentY + unit * 2);
	}
}

function drawSubmissionPanel(x, y, w, h) {
	if (!scoreSubmitted) {
		let contentY = drawPanel(
			x,
			y,
			w,
			h,
			"⚡ SUBMIT YOUR SCORE",
			color(255, 100, 100)
		);

		// Instructions
		textAlign(CENTER, TOP);
		textSize(unit * 0.35);
		fill(200, 200, 200);
		text("Enter your name to save your time", x + w / 2, contentY - unit * 0.2);
		text("to the leaderboard!", x + w / 2, contentY + unit * 0.1);

		// Create input elements if they don't exist
		if (!nameInput) {
			createStyledInputElements(x, contentY, w);
		}
	} else {
		let contentY = drawPanel(
			x,
			y,
			w,
			h,
			"✅ SCORE SUBMITTED!",
			color(100, 255, 100)
		);

		// Success message
		textAlign(CENTER, CENTER);
		textSize(unit * 0.5);
		fill(100, 255, 100);
		text("🎉", x + w / 2, contentY + unit * 0.4);

		textSize(unit * 0.4);
		fill(255);
		text("Thank you, " + playerName + "!", x + w / 2, contentY + unit * 1.3);

		textSize(unit * 0.35);
		fill(200, 200, 200);
		text("Your score has been added", x + w / 2, contentY + unit * 1.8);
		text("to the leaderboard!", x + w / 2, contentY + unit * 2.2);

		// Fun animation
		let pulseSize = 1 + 0.1 * sin(millis() * 0.01);
		textSize(unit * 0.6 * pulseSize);
		fill(255, 255, 0, 150 + 105 * sin(millis() * 0.008));
		text("⭐", x + w / 2, contentY + unit * 3);
	}
}

function createStyledInputElements(panelX, contentY, panelWidth) {
	console.log("Creating input elements", {
		panelX,
		contentY,
		panelWidth,
		unit,
	});

	// Update CSS variables for responsive design
	updateFormCSSVariables();

	// Calculate input positioning within the panel
	let inputWidth = panelWidth * 0.8;
	let inputHeight = unit * 0.6;
	let inputX = panelX + (panelWidth - inputWidth) / 2;
	let inputY = contentY + unit * 1.4;

	console.log("Calculated positions:", {
		inputX,
		inputY,
		inputWidth,
		inputHeight,
	});

	nameInput = createInput("");
	nameInput.position(inputX, inputY);
	nameInput.size(inputWidth, inputHeight);
	nameInput.class("score-input"); // Use CSS class instead of inline styles
	nameInput.attribute("placeholder", "🎮 Enter your name");
	nameInput.attribute("maxlength", "20");

	console.log("Created input element");

	// Submit button positioning
	let buttonY = inputY + inputHeight + unit * 0.4;

	submitButton = createButton("🚀 SUBMIT SCORE");
	submitButton.position(inputX, buttonY);
	submitButton.size(inputWidth, inputHeight);
	submitButton.class("score-submit-btn"); // Use CSS class instead of inline styles

	console.log("Created submit button");

	submitButton.mousePressed(async () => {
		let name = nameInput.value().trim();
		if (name.length > 0) {
			// Disable button during submission
			submitButton.html("⏳ SUBMITTING...");
			submitButton.elt.disabled = true;

			let success = await submitScore(name, lastGameDuration);
			if (success) {
				scoreSubmitted = true;
				playerName = name;
				// Add success animation
				nameInput.addClass("success");

				// Reload leaderboard to show updated rankings
				loadLeaderboard();

				// Play success sound if available
				if (clickSound) clickSound.play();
			} else {
				// Re-enable button on failure and show error state
				submitButton.html("🚀 SUBMIT SCORE");
				submitButton.elt.disabled = false;
				nameInput.addClass("error");

				// Remove error class after animation
				setTimeout(() => {
					if (nameInput) nameInput.removeClass("error");
				}, 300);
			}
		} else {
			// Show error for empty input
			nameInput.addClass("error");
			setTimeout(() => {
				if (nameInput) nameInput.removeClass("error");
			}, 300);
		}
	});
}

// New function to update CSS variables for responsive design
function updateFormCSSVariables() {
	if (typeof document !== "undefined") {
		document.documentElement.style.setProperty("--unit", unit + "px");
		document.documentElement.style.setProperty(
			"--form-font-size",
			unit * 0.3 + "px"
		);
		document.documentElement.style.setProperty(
			"--form-input-height",
			unit * 0.6 + "px"
		);
		document.documentElement.style.setProperty(
			"--form-spacing",
			unit * 0.4 + "px"
		);
	}
}

function drawRestartPrompt() {
	// Animated restart button at bottom
	let buttonY = height - unit * 0.8;
	let buttonWidth = unit * 5;
	let buttonHeight = unit * 0.6;
	let buttonX = width / 2;

	// Pulsing animation
	let pulse = 1 + 0.03 * sin(millis() * 0.008);
	let alpha = 180 + 75 * sin(millis() * 0.006);

	// Button background
	fill(50, 50, 80, 220);
	stroke(255, 255, 255, alpha);
	strokeWeight(2);
	rect(
		buttonX - (buttonWidth / 2) * pulse,
		buttonY - (buttonHeight / 2) * pulse,
		buttonWidth * pulse,
		buttonHeight * pulse,
		unit * 0.15
	);

	// Button text
	noStroke();
	textAlign(CENTER, CENTER);
	textSize(unit * 0.35 * pulse);
	fill(255, 255, 255, alpha);
	text("PRESS ENTER TO PLAY AGAIN", buttonX, buttonY);
}

function draw() {
	let currentTime = millis(); // Cache millis() for this frame

	// Only clean up input elements when transitioning away from victory screen
	// or when explicitly on a different screen state
	let shouldShowInputs =
		currentScreen === "gameOver" && gameResult === "victory" && !scoreSubmitted;

	if (!shouldShowInputs && (nameInput || submitButton)) {
		console.log(
			"Cleaning up input elements - not on victory screen or score submitted"
		);
		cleanupInputElements();
	}

	if (isTransitioning) {
		handleTransition();
	} else {
		if (currentScreen === "welcome") {
			drawWelcome();
		} else if (currentScreen === "intro") {
			drawIntro();
			// Ensure background music is playing during intro (since video has no audio)
			if (bgMusic2 && bgMusic2.isPlaying()) {
				bgMusic2.stop();
			}
			if (bgMusic1 && !bgMusic1.isPlaying()) {
				try {
					bgMusic1.loop();
				} catch (error) {
					console.log("Error starting music during intro:", error);
				}
			}
			// Fade in background music during intro
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
					console.log("Error updating volume during intro:", error);
				}
			}
		} else if (currentScreen === "characterSelect") {
			drawCharacterSelect();
			// Ensure only bgMusic1 is playing (continue from intro)
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
			// Continue fading in music if needed
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

function drawIntro() {
	background(0);

	if (introVideo && videoLoaded) {
		// Start playing the video if it hasn't started yet
		if (introVideo.elt.paused && introVideo.elt.currentTime === 0) {
			try {
				introVideo.play();
				console.log("Starting intro video");
			} catch (error) {
				console.log(
					"Video autoplay failed, but that's okay - user can click to start"
				);
			}
		}

		// Calculate dimensions to maintain aspect ratio and center the video
		let videoAspectRatio = introVideo.width / introVideo.height;
		let canvasAspectRatio = width / height;
		let drawWidth, drawHeight, x, y;

		if (videoAspectRatio > canvasAspectRatio) {
			// Video is wider than canvas, fit by width
			drawWidth = width;
			drawHeight = width / videoAspectRatio;
			x = 0;
			y = (height - drawHeight) / 2;
		} else {
			// Video is taller than canvas, fit by height
			drawHeight = height;
			drawWidth = height * videoAspectRatio;
			x = (width - drawWidth) / 2;
			y = 0;
		}

		// Draw the video
		image(introVideo, x, y, drawWidth, drawHeight);

		// Show skip instructions or play instructions if video is paused
		fill(255, 255, 255, 200);
		textAlign(RIGHT, BOTTOM);
		textSize(unit * 0.3);
		if (introVideo.elt.paused) {
			text(
				"Click to start video or press SPACE to skip",
				width - unit * 0.5,
				height - unit * 0.3
			);
		} else {
			text(
				"Press SPACE or click to skip",
				width - unit * 0.5,
				height - unit * 0.3
			);
		}
	} else {
		// Show loading message
		fill(255);
		textAlign(CENTER, CENTER);
		textSize(unit * 0.8);
		text("Loading...", width / 2, height / 2);

		// Show loading animation
		let loadingDots = ".".repeat(floor((millis() / 500) % 4));
		textSize(unit * 0.5);
		text(loadingDots, width / 2, height / 2 + unit);

		// Auto-start video when loaded
		if (introVideo && !videoLoaded && introVideo.elt.readyState >= 3) {
			videoLoaded = true;
			console.log("Video ready to play");
		}
	}
}

function drawWelcome() {
	background(0);

	// Attempt to initialize static screen background buffer if not already done
	if (!screenBackBufferInitialized) {
		screenBackBufferInitialized = updateScreenBackBuffer();
	}

	// Attempt to initialize clouds buffer if not already done
	if (!cloudsBufferInitialized) {
		cloudsBufferInitialized = updateCloudsBuffer();
	}

	// Draw animated background
	if (gScreenBack) {
		image(gScreenBack, 0, 0);
	}

	// Draw animated clouds for visual appeal
	drawClouds();

	// Add a subtle dark overlay for better text readability
	fill(0, 0, 0, 120);
	rect(0, 0, width, height);

	// Draw William.png (iMonster)
	if (iMonster) {
		let monsterWidth = unit * 4;
		let monsterHeight = monsterWidth * (iMonster.height / iMonster.width);
		image(
			iMonster,
			width / 2 - monsterWidth / 2,
			height / 2 - monsterHeight,
			monsterWidth,
			monsterHeight
		);
	}

	// Main title
	fill(255);
	textAlign(CENTER, CENTER);
	textSize(unit * 1.5);
	stroke(0);
	strokeWeight(unit * 0.08);
	text("Beat Bad Ideas", width / 2, height / 2 + unit * 0.8);
	noStroke();

	// Subtitle/instruction
	textSize(unit * 0.8);
	fill(255, 255, 0);
	stroke(0);
	strokeWeight(unit * 0.05);
	text("Click to Start", width / 2, height / 2 + unit * 1.9);
	noStroke();

	// Additional info
	textSize(unit * 0.4);
	fill(200, 200, 200);
	// text("Audio and video will be enabled", width / 2, height / 2 + unit);

	// Pulsing effect for "Click to Start"
	let pulseAlpha = 150 + 105 * sin(millis() * 0.005);
	fill(255, 255, 255, pulseAlpha);
	textSize(unit * 0.3);
	text("🎮 Click anywhere to continue 🎮", width / 2, height - unit * 1.5);
}

function mousePressed() {
	if (currentScreen === "welcome" && !isTransitioning) {
		// Initialize audio context and start the game
		if (getAudioContext().state !== "running") {
			userStartAudio()
				.then(() => {
					console.log("Audio context started successfully");
				})
				.catch((error) => {
					console.log("Audio context start failed:", error);
				});
		}
		startTransition("intro");
	} else if (currentScreen === "intro" && !isTransitioning) {
		if (introVideo) {
			// If video is paused (due to autoplay restrictions), try to start it first
			if (introVideo.elt.paused) {
				try {
					introVideo.play();
					console.log("User clicked - starting video");
				} catch (error) {
					// If still can't play, skip to character select
					console.log("Can't play video, skipping to character select");
					introVideo.stop();
					if (onIntroEnd) {
						introVideo.elt.removeEventListener("ended", onIntroEnd);
					}
					startTransition("characterSelect");
				}
			} else {
				// Video is playing, so skip it
				introVideo.stop();
				if (onIntroEnd) {
					introVideo.elt.removeEventListener("ended", onIntroEnd);
				}
				startTransition("characterSelect");
			}
		} else {
			startTransition("characterSelect");
		}
	} else if (currentScreen === "characterSelect" && !isTransitioning) {
		// Check if left arrow was clicked
		if (
			iLeftArrow && // Ensure image is loaded
			mouseX > LEFT_ARROW_X - ARROW_IMG_WIDTH / 2 &&
			mouseX < LEFT_ARROW_X + ARROW_IMG_WIDTH / 2 &&
			mouseY > LEFT_ARROW_Y - ARROW_IMG_HEIGHT / 2 &&
			mouseY < LEFT_ARROW_Y + ARROW_IMG_HEIGHT / 2
		) {
			currentCharacter =
				(currentCharacter - 1 + TOTAL_CHARACTERS) % TOTAL_CHARACTERS;
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
			currentCharacter = (currentCharacter + 1) % TOTAL_CHARACTERS;
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
	if (currentScreen === "welcome" && !isTransitioning) {
		// Any key starts the game (same as mouse click)
		if (getAudioContext().state !== "running") {
			userStartAudio()
				.then(() => {
					console.log("Audio context started successfully");
				})
				.catch((error) => {
					console.log("Audio context start failed:", error);
				});
		}
		startTransition("intro");
	} else if (currentScreen === "intro" && !isTransitioning) {
		// Skip intro video on SPACE or ENTER key
		if (keyCode === 32 || keyCode === ENTER) {
			// 32 is SPACE
			if (introVideo) {
				introVideo.stop();
				if (onIntroEnd) {
					introVideo.elt.removeEventListener("ended", onIntroEnd);
				}
			}
			startTransition("characterSelect");
		}
	} else if (currentScreen === "characterSelect" && !isTransitioning) {
		if (keyCode === LEFT_ARROW) {
			currentCharacter =
				(currentCharacter - 1 + TOTAL_CHARACTERS) % TOTAL_CHARACTERS;
			leftArrowOffset = -ARROW_CLICK_OFFSET;
			clickSound.play();
		}
		if (keyCode === RIGHT_ARROW) {
			currentCharacter = (currentCharacter + 1) % TOTAL_CHARACTERS;
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
	// Calculate canvas size to fit window while maintaining 16:9 aspect ratio
	let targetAspectRatio = 16 / 9;
	let windowAspectRatio = windowWidth / windowHeight;

	let canvasWidth, canvasHeight;
	if (windowAspectRatio > targetAspectRatio) {
		// Window is wider than 16:9, fit by height
		canvasHeight = windowHeight;
		canvasWidth = canvasHeight * targetAspectRatio;
	} else {
		// Window is taller than or equal to 16:9, fit by width
		canvasWidth = windowWidth;
		canvasHeight = canvasWidth / targetAspectRatio;
	}

	resizeCanvas(canvasWidth, canvasHeight);

	unit = width / 16;
	cloudSpeed = -unit / 2000; // Update cloudSpeed here to be consistent with setup
	ARROW_CLICK_OFFSET = unit / 1.6; // Update ARROW_CLICK_OFFSET here
	PARALLAX_OFFSET_UP = -unit * 6; // Update PARALLAX_OFFSET_UP here
	PARALLAX_OFFSET_DOWN = -unit; // Update PARALLAX_OFFSET_DOWN here

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

	screenBackBufferInitialized = updateScreenBackBuffer(); // Update static background buffer on resize
	cloudsBufferInitialized = updateCloudsBuffer(); // Update clouds buffer on resize

	// Update CSS variables for responsive design
	updateFormCSSVariables();

	// Clean up input elements on resize to avoid positioning issues
	cleanupInputElements();
}

function drawGame() {
	noStroke(); // Prevent outlines

	// Cache millis() call for performance - only call once per frame
	let currentTime = millis();

	// Attempt to initialize static screen background buffer if not already done
	if (!screenBackBufferInitialized) {
		screenBackBufferInitialized = updateScreenBackBuffer();
		if (screenBackBufferInitialized) {
			console.log("ScreenBack buffer successfully initialized from drawGame.");
		}
	}

	background(0); // Draw black background, layers will draw on top if ready

	// --- Draw Static Background and Clouds (like screen2 & screen3) ---
	if (gScreenBack) {
		image(gScreenBack, 0, 0);
	}

	drawClouds(); // Draw animated clouds on top of iScreenBack
	// --- End Static Background and Clouds ---

	// Set blend mode for darker effect
	blendMode(BLEND);

	// Reset blend mode and tint for other elements
	blendMode(BLEND); // Ensure blend mode is still as expected or reset if necessary
	noTint(); // Crucial to reset tint for other game elements

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
		currentTime - monsterLastFired > monsterFireRate &&
		m.health > 0 &&
		currentScreen === "game"
	) {
		let flameSpeed = random(unit / 40, unit / 20); // Adjusted for unit-relativity
		let mf = new MonsterFlame(m.x - unit * 2, m.y, flameSpeed);
		mFlameArray.push(mf);
		monsterLastFired = currentTime;
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
			shootingPowerupTimer = currentTime;
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
		currentTime - shootingPowerupTimer > shootingPowerupDuration
	) {
		fireRate = defaultFireRate;
		shootingPowerupTimer = 0;
	}

	// Draw shooting power-up timer indicator if active
	if (shootingPowerupTimer > 0) {
		let indicatorX = POWERUP_INDICATOR_X;
		let indicatorY = POWERUP_INDICATOR_Y;
		let indicatorSize = POWERUP_INDICATOR_SIZE;
		let elapsed = currentTime - shootingPowerupTimer;
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
		currentGameTime = currentTime - gameStartTime;
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
			gameEndTime = currentTime;
			lastGameDuration = gameEndTime - gameStartTime;
		}
		gameResult = "victory";
		currentScreen = "gameOver";
	} else if (p.health <= 0) {
		if (gameEndTime === 0) {
			gameEndTime = currentTime;
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
	let r1 = getSpriteDiameter(entity1) / 2;
	let r2 = getSpriteDiameter(entity2) / 2;

	let dx = entity1.x - entity2.x;
	let dy = entity1.y - entity2.y;
	let squaredDistance = dx * dx + dy * dy;
	// Compare squared distance with squared sum of radii
	return squaredDistance < (r1 + r2) * (r1 + r2);
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

	if (gameResult === "victory") {
		// Victory screen with static background and moving clouds
		background(0);

		// Attempt to initialize static screen background buffer if not already done
		if (!screenBackBufferInitialized) {
			screenBackBufferInitialized = updateScreenBackBuffer();
		}

		// Draw static background
		if (gScreenBack) {
			image(gScreenBack, 0, 0);
		}

		// Draw animated clouds
		drawClouds();

		// Load leaderboard on first time seeing victory screen
		if (!leaderboardLoaded && !isLoadingLeaderboard) {
			loadLeaderboard();
		}

		// Draw semi-transparent overlay for better text visibility
		fill(0, 0, 0, 180);
		rect(0, 0, width, height);

		// Victory title with glow effect
		drawGlowText(
			"VICTORY!",
			width / 2,
			unit * 0.6,
			unit * 1,
			color(255, 215, 0),
			color(255, 255, 0)
		);

		// Your time with highlighted background
		let timeStr = formatTime(lastGameDuration);
		drawTimeDisplay(timeStr, width / 2, unit * 1.8);

		// Main content area with two panels
		let panelY = unit * 2.6;
		let panelHeight = height - panelY - unit * 1.4; // Leave space at bottom
		let panelWidth = (width - unit * 3) / 2; // Two panels with a gap
		let leftPanelX = unit;
		let rightPanelX = width / 2 + unit * 0.5;

		// Left Panel - Leaderboard
		drawLeaderboardPanel(leftPanelX, panelY, panelWidth, panelHeight);

		// Right Panel - Score Submission (includes input elements)
		drawSubmissionPanel(rightPanelX, panelY, panelWidth, panelHeight);
	} else {
		// Defeat screen with static background
		// Ensure input elements are cleaned up for defeat screen
		cleanupInputElements();

		background(0);

		// Attempt to initialize static screen background buffer if not already done
		if (!screenBackBufferInitialized) {
			screenBackBufferInitialized = updateScreenBackBuffer();
			if (screenBackBufferInitialized) {
				console.log(
					"ScreenBack buffer successfully initialized from drawGameOver."
				);
			}
		}

		// Draw background
		if (gScreenBack) {
			image(gScreenBack, 0, 0);
		}

		// Draw animated clouds
		drawClouds();

		// Draw defeat message with outline
		textAlign(CENTER, CENTER);
		textSize(unit * 2);
		stroke(0);
		strokeWeight(unit * 0.1);
		fill(255, 0, 0);
		text("GAME OVER", width / 2, height / 2 - unit * 2);
		noStroke();

		// Draw time spent
		if (lastGameDuration > 0) {
			let seconds = floor(lastGameDuration / 1000);
			let minutes = floor(seconds / 60);
			let displaySeconds = seconds % 60;
			let timeStr = nf(minutes, 2) + ":" + nf(displaySeconds, 2);
			textSize(unit * 0.7);
			stroke(0);
			strokeWeight(unit * 0.05);
			fill(255, 255, 0);
			text("Time: " + timeStr, width / 2, height / 2 - unit);
			noStroke();
		}

		// Draw selected character for defeat screen
		if (characterSheet) {
			let charWidth = 400; // Original character width in sprite sheet
			let charHeight = characterSheet.height;
			let displayWidth = unit * 2;
			let displayHeight = (displayWidth * charHeight) / charWidth;

			image(
				characterSheet,
				width / 2 - displayWidth / 2,
				height / 2 + unit / 3,
				displayWidth,
				displayHeight,
				p.characterIndex * charWidth,
				0,
				charWidth,
				charHeight
			);
		}
	}

	// Draw restart instruction at bottom with outline (for both victory and defeat)
	drawRestartPrompt();
}

function handleTransition() {
	// For a cleaner transition, just show black during the fade
	if (fadeAlpha > 128) {
		// Middle of transition - show solid black
		background(0);
	} else {
		// Draw the appropriate screen based on transition direction
		if (FADE_SPEED > 0) {
			// Fading out - draw current screen
			if (currentScreen === "welcome") {
				drawWelcome();
			} else if (currentScreen === "intro") {
				drawIntro();
			} else if (currentScreen === "characterSelect") {
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
			// Fading in - draw target screen
			if (targetScreen === "welcome") {
				drawWelcome();
			} else if (targetScreen === "intro") {
				drawIntro();
			} else if (targetScreen === "characterSelect") {
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

		// Draw fade overlay only when not fully black
		fill(0, fadeAlpha);
		rect(0, 0, width, height);
	}

	// Fade out
	if (FADE_SPEED > 0 && fadeAlpha < 255) {
		fadeAlpha += FADE_SPEED * 255;
	} else if (FADE_SPEED > 0 && fadeAlpha >= 255) {
		// Switch screens
		let screenWeCameFrom = currentScreen; // Capture the screen we are transitioning FROM
		currentScreen = targetScreen;
		fadeAlpha = 255;

		// If transitioning to intro screen, start background music
		if (currentScreen === "intro" && screenWeCameFrom === "welcome") {
			if (bgMusic1) {
				try {
					bgMusic1.setVolume(0.5);
					bgMusic1.loop();
					console.log("Started background music during intro video");
				} catch (error) {
					console.log("Error starting background music:", error);
				}
			}
		}

		// If the new screen is the game screen, prepare for a new game session
		if (currentScreen === "game") {
			gameResult = ""; // Reset gameResult for the new game
			gameStartTime = millis();
			gameEndTime = 0;
			lastGameDuration = 0;

			// Reset leaderboard state for new game
			scoreSubmitted = false;
			playerName = "";
			cleanupInputElements();

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

	// Clean up input elements if they exist
	cleanupInputElements();

	isTransitioning = true;
	targetScreen = newScreen;
	fadeAlpha = 0;
	FADE_SPEED = Math.abs(FADE_SPEED);
}

function cleanupInputElements() {
	if (nameInput) {
		nameInput.remove();
		nameInput = null;
	}
	if (submitButton) {
		submitButton.remove();
		submitButton = null;
	}
}

// Helper function to draw animated clouds
function drawClouds() {
	if (!gCloudsBuffer) {
		return;
	}

	// Calculate the offset for scrolling horizontally
	let offset = (millis() * cloudSpeed) % gCloudBufferWidth;
	if (offset < 0) offset += gCloudBufferWidth; // Handle negative offsets

	// Draw the cloud buffer twice to create seamless scrolling horizontally
	image(gCloudsBuffer, offset - gCloudBufferWidth, 0);
	image(gCloudsBuffer, offset, 0);
}

// Function to create pre-rendered cloud buffer
function updateCloudsBuffer() {
	if (!iScreenCloud) {
		console.warn("iScreenCloud not loaded yet");
		return false;
	}

	// Create buffer if it doesn't exist or if dimensions changed
	if (
		!gCloudsBuffer ||
		gCloudsBuffer.width !== width * 2 ||
		gCloudsBuffer.height !== height
	) {
		if (gCloudsBuffer) {
			gCloudsBuffer.remove();
		}
		gCloudsBuffer = createGraphics(width * 2, height);
	}

	// Clear the buffer
	gCloudsBuffer.clear();

	// Calculate dimensions to maintain aspect ratio
	let imgHeight = (width * iScreenCloud.height) / iScreenCloud.width;

	// Ensure the height fills the screen
	if (imgHeight < height) {
		imgHeight = height;
	}

	// Draw the image scaled to fit width while maintaining aspect ratio
	// Draw it twice side by side for seamless scrolling
	gCloudsBuffer.image(iScreenCloud, 0, 0, width, imgHeight);
	gCloudsBuffer.image(iScreenCloud, width, 0, width, imgHeight);

	// Store the buffer dimensions
	gCloudBufferWidth = width * 2; // Double width for seamless scrolling
	gCloudBufferHeight = imgHeight;

	return true;
}

function drawScreen2() {
	noStroke();
	background(0);

	// Attempt to initialize static screen background buffer if not already done
	if (!screenBackBufferInitialized) {
		screenBackBufferInitialized = updateScreenBackBuffer();
		if (screenBackBufferInitialized) {
			console.log(
				"ScreenBack buffer successfully initialized from drawScreen2."
			);
		}
	}

	// Draw background
	if (gScreenBack) {
		image(gScreenBack, 0, 0);
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

	// Attempt to initialize static screen background buffer if not already done
	if (!screenBackBufferInitialized) {
		screenBackBufferInitialized = updateScreenBackBuffer();
		if (screenBackBufferInitialized) {
			console.log(
				"ScreenBack buffer successfully initialized from drawScreen3."
			);
		}
	}

	// Draw background
	if (gScreenBack) {
		image(gScreenBack, 0, 0);
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
		this.active = true; // Add active flag for object pooling
	}

	updateThis(x, y) {
		this.x = x;
		this.y = y;
	}

	drawThis() {
		if (!this.active) return; // Skip inactive objects

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

		// Auto-deactivate when off screen
		if (this.y > height) {
			this.active = false;
		}
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
		this.active = true; // Add active flag for object pooling
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

		// Draw weapon image or fallback to pixel-art style laser
		let weaponWidth = this.ww * 1.5;
		let weaponHeight = this.hh * 0.7;

		if (iWeapon) {
			// Use weapon image - single draw call (centered on this.x, this.y)
			image(
				iWeapon,
				this.x - weaponWidth / 2, // Center horizontally
				this.y - weaponHeight / 2, // Center vertically
				weaponWidth,
				weaponHeight
			);
		} else {
			// Fallback to original pixel-art style laser (centered on this.x, this.y)
			// Outer red
			fill(255, 0, 0);
			rect(
				this.x - weaponWidth / 2,
				this.y - weaponHeight / 2,
				weaponWidth,
				weaponHeight,
				2
			);

			// Middle orange
			fill(255, 140, 0);
			rect(
				this.x - (weaponWidth * 0.9) / 2,
				this.y - weaponHeight / 3,
				weaponWidth * 0.9,
				weaponHeight / 1.5,
				2
			);

			// Center yellow
			fill(255, 255, 0);
			rect(
				this.x - (weaponWidth * 0.7) / 2,
				this.y - weaponHeight / 6,
				weaponWidth * 0.7,
				weaponHeight / 3,
				2
			);
		}

		this.x += this.speed;
	}
}

class Blast {
	constructor(x, y, size) {
		this.x = x;
		this.y = y;
		this.size = size; // This will be the maximum diameter of the explosion
		this.life = 20; // Duration of the blast
		this.currentLife = this.life;
		this.collisionDiameter = this.size; // Added collisionDiameter, might not be relevant if blast doesn't collide
		this.active = true; // Add active flag for object pooling
	}

	drawThis() {
		// Calculate progress (0 = new, 1 = expired)
		// Ensure currentLife doesn't go below 0 for calculations
		let actualCurrentLife = Math.max(0, this.currentLife);
		let progress = (this.life - actualCurrentLife) / this.life;

		// Explosion expands and then fades
		let currentDiameter = this.size * progress;
		let alpha = 255 * (1 - progress); // Fades out as it expands

		noStroke();
		fill(255, 120, 0, alpha); // Fiery orange color for the explosion
		ellipse(this.x, this.y, currentDiameter, currentDiameter);

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
		this.active = true; // Add active flag for object pooling
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
		ARROW_IMG_WIDTH = unit * 1.0; // Reduced from 1.5 to 1.0
		ARROW_IMG_HEIGHT = ARROW_IMG_WIDTH * arrowAspectRatio;
	} else {
		ARROW_IMG_WIDTH = unit * 1.0; // Reduced from 1.5 to 1.0
		ARROW_IMG_HEIGHT = unit * 1.0; // Reduced from 1.5 to 1.0
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

// New function to create/update pre-scaled parallax background buffers
function updateParallaxBuffers() {
	if (
		!iAddChai1 ||
		!iAddChai2 ||
		!iAddChai3 ||
		!iAddChai4 ||
		iAddChai1.width === 0 ||
		iAddChai2.width === 0 ||
		iAddChai3.width === 0 ||
		iAddChai4.width === 0
	) {
		// console.warn("Parallax images not fully loaded, skipping buffer update.");
		return false; // Indicate failure
	}

	// Buffer for iAddChai1
	let imgHeight1 = (width * iAddChai1.height) / iAddChai1.width;
	if (
		gAddChai1 &&
		(gAddChai1.width !== width || gAddChai1.height !== imgHeight1)
	) {
		gAddChai1.remove();
		gAddChai1 = null;
	}
	if (!gAddChai1) {
		gAddChai1 = createGraphics(width, imgHeight1);
		gAddChai1.tint(200);
		gAddChai1.image(iAddChai1, 0, 0, gAddChai1.width, gAddChai1.height);
		// gAddChai1.noTint(); // Not strictly needed here as tint applies to draws *on* this buffer
	}

	// Buffer for iAddChai2
	let imgHeight2 = (width * iAddChai2.height) / iAddChai2.width;
	if (
		gAddChai2 &&
		(gAddChai2.width !== width || gAddChai2.height !== imgHeight2)
	) {
		gAddChai2.remove();
		gAddChai2 = null;
	}
	if (!gAddChai2) {
		gAddChai2 = createGraphics(width, imgHeight2);
		gAddChai2.tint(200);
		gAddChai2.image(iAddChai2, 0, 0, gAddChai2.width, gAddChai2.height);
	}

	// Buffer for iAddChai3
	let imgHeight3 = (width * iAddChai3.height) / iAddChai3.width;
	if (
		gAddChai3 &&
		(gAddChai3.width !== width || gAddChai3.height !== imgHeight3)
	) {
		gAddChai3.remove();
		gAddChai3 = null;
	}
	if (!gAddChai3) {
		gAddChai3 = createGraphics(width, imgHeight3);
		gAddChai3.tint(200);
		gAddChai3.image(iAddChai3, 0, 0, gAddChai3.width, gAddChai3.height);
	}

	// Buffer for iAddChai4
	let imgHeight4 = (width * iAddChai4.height) / iAddChai4.width;
	if (
		gAddChai4 &&
		(gAddChai4.width !== width || gAddChai4.height !== imgHeight4)
	) {
		gAddChai4.remove();
		gAddChai4 = null;
	}
	if (!gAddChai4) {
		gAddChai4 = createGraphics(width, imgHeight4);
		gAddChai4.tint(200);
		gAddChai4.image(iAddChai4, 0, 0, gAddChai4.width, gAddChai4.height);
	}
	return true; // Indicate success
}

// New function to create/update the pre-scaled static screen background buffer
function updateScreenBackBuffer() {
	if (!iScreenBack) {
		console.warn("iScreenBack not loaded yet");
		return false;
	}

	// Create buffer if it doesn't exist
	if (!gScreenBack) {
		gScreenBack = createGraphics(width, height);
	}

	// Clear the buffer
	gScreenBack.clear();

	// Calculate height to maintain aspect ratio
	let imgHeight = (width * iScreenBack.height) / iScreenBack.width;

	// Draw the image scaled to fit width while maintaining aspect ratio
	gScreenBack.image(iScreenBack, 0, 0, width, imgHeight);

	return true;
}
