const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const ui = document.getElementById('ui');
const hud = document.getElementById('hud');
const startBtn = document.getElementById('startBtn');

// Player Stats and Info
let player = {
    name: '',
    color: '#0055ff',
    x: 400,
    y: 300,
    baseSize: 32, // Starting size
    speed: 5,
    money: 0,
    strength: 10  // We will increase this at the gym
};

let keys = {};

// When you click "Enter World"
startBtn.addEventListener('click', () => {
    // 1. Get the customization choices
    player.name = document.getElementById('playerName').value || 'Unknown';
    player.color = document.getElementById('playerColor').value;

    // 2. Update the HUD
    document.getElementById('hudName').innerText = player.name;

    // 3. Hide menu, show game
    ui.style.display = 'none';
    hud.style.display = 'block';
    canvas.style.display = 'block';

    // 4. Start the game loop!
    gameLoop();
});

// Listen for keyboard presses for movement
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function update() {
    // Move the player
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
}

function draw() {
    // Clear the screen every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    // Draw the Player
    ctx.fillStyle = player.color;
    
    // The player gets bigger as strength increases!
    let currentSize = player.baseSize + (player.strength - 10); 
    
    ctx.fillRect(player.x, player.y, currentSize, currentSize);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop); // Keeps the game running forever
}
