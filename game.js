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
    speed: 5,
    money: 0,
    strength: 10  // Gym increases this!
};

let keys = {};

// The Undertale-style Pixel Art Grid (10x10)
// 0 = empty, 1 = outline, 2 = skin, 3 = shirt (custom color), 4 = pants
const playerSprite = [
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,2,2,2,2,2,2,1,0],
    [1,2,1,2,2,2,2,1,2,1],
    [1,2,2,2,2,2,2,2,2,1],
    [0,1,2,2,2,2,2,2,1,0],
    [0,1,1,3,3,3,3,1,1,0],
    [1,3,1,3,3,3,3,1,3,1],
    [1,1,1,4,4,4,4,1,1,1],
    [0,0,1,4,1,1,4,1,0,0],
    [0,1,1,1,0,0,1,1,1,0]
];

// When you click "Enter World"
startBtn.addEventListener('click', () => {
    player.name = document.getElementById('playerName').value || 'Hero';
    player.color = document.getElementById('playerColor').value;
    document.getElementById('hudName').innerText = player.name;

    ui.style.display = 'none';
    hud.style.display = 'block';
    canvas.style.display = 'block';

    gameLoop();
});

// Listen for keyboard presses
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function update() {
    // Movement logic
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
}

function drawPlayer(x, y) {
    // The higher the strength, the bigger the pixels! (Starts at size 4)
    let pixelSize = 4 + (player.strength - 10) * 0.2; 

    // Loop through the grid to draw the character
    for (let row = 0; row < playerSprite.length; row++) {
        for (let col = 0; col < playerSprite[row].length; col++) {
            let colorCode = playerSprite[row][col];
            
            if (colorCode === 0) continue; // Skip empty pixels
            if (colorCode === 1) ctx.fillStyle = '#000000'; // Black outline
            if (colorCode === 2) ctx.fillStyle = '#ffcc99'; // Skin tone
            if (colorCode === 3) ctx.fillStyle = player.color; // Custom shirt color!
            if (colorCode === 4) ctx.fillStyle = '#1111aa'; // Blue pants

            // Draw each individual pixel
            ctx.fillRect(
                x + (col * pixelSize), 
                y + (row * pixelSize), 
                pixelSize, 
                pixelSize
            );
        }
    }
}

function draw() {
    // Clear the screen (Sky blue background)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height); 

    // Draw the cool new pixel character
    drawPlayer(player.x, player.y);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
