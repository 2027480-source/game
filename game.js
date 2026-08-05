const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ui = document.getElementById('ui');
const hud = document.getElementById('hud');
const startBtn = document.getElementById('startBtn');

let player = {
    name: '',
    color: '#0055ff',
    skinColor: '#ffcc99',
    hairType: 'short_brown',
    accessory: 'none',
    x: 400,
    y: 300,
    speed: 5,
    money: 0,
    strength: 10
};

let keys = {};

// ---------------------------------------------------------
// HAIR GRIDS (Updated short_orange color to #ff7700)
// ---------------------------------------------------------
const hairLayouts = {
    dreads_black: { color: '#111111', grid: [ [0,0,1,1,1,1,1,1,0,0], [0,1,1,1,1,1,1,1,1,0], [1,1,0,0,0,0,0,0,1,1], [1,1,0,0,0,0,0,0,1,1], [1,0,0,0,0,0,0,0,0,1] ] },
    short_orange: { color: '#ff7700', grid: [ [0,1,0,1,0,1,0,1,0,0], [1,1,1,1,1,1,1,1,1,0], [0,1,1,0,0,0,0,1,1,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0] ] },
    short_blonde: { color: '#e6c200', grid: [ [0,0,0,1,1,1,1,0,0,0], [0,0,1,1,1,1,1,1,1,0], [0,1,1,1,0,0,0,0,1,0], [0,1,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0] ] },
    buzz_darkbrown: { color: '#2b1d0c', grid: [ [0,0,0,0,0,0,0,0,0,0], [0,0,1,1,1,1,1,1,0,0], [0,1,1,0,0,0,0,1,1,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0] ] },
    short_brown: { color: '#5a3d28', grid: [ [0,0,1,1,1,1,1,1,0,0], [0,1,1,1,1,1,1,1,1,0], [1,1,0,0,0,0,0,0,1,1], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0] ] },
    curly_brown: { color: '#4a2e1b', grid: [ [0,1,1,1,1,1,1,1,1,0], [1,1,1,1,1,1,1,1,1,1], [1,1,1,0,0,0,0,1,1,1], [1,1,0,0,0,0,0,0,1,1], [0,0,0,0,0,0,0,0,0,0] ] }
};

// ---------------------------------------------------------
// NEW: ACCESSORIES GRIDS (10x10 to fit the whole body)
// Numbers map to different colors inside the draw function
// ---------------------------------------------------------
const accessoriesLayouts = {
    none: [
        [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0]
    ],
    glasses: [ // 1 = Black frames, 2 = White lens shine
        [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,1], // Top of glasses
        [1,2,2,1,0,0,1,2,2,1], // Lenses
        [1,1,1,1,0,0,1,1,1,1], // Bottom of glasses
        [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0]
    ],
    necklace: [ // 1 = Gold chain, 2 = Diamond/Pendant
        [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], 
        [0,0,1,0,0,0,0,1,0,0], // Chain on neck
        [0,0,0,1,0,0,1,0,0,0], // Chain on collar
        [0,0,0,0,1,1,0,0,0,0], // Chain center
        [0,0,0,0,2,2,0,0,0,0], // Pendant
        [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0]
    ],
    propeller: [ // 1 = Red cap, 2 = Blue cap, 3 = Propeller stick, 4 = Blades
        [0,0,0,0,4,4,4,4,0,0], // Blades
        [0,0,0,0,0,3,0,0,0,0], // Stick
        [0,0,1,1,2,2,1,1,0,0], // Cap top
        [1,1,1,1,1,1,1,1,1,1], // Brim
        [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0,0,0]
    ]
};

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

startBtn.addEventListener('click', () => {
    player.name = document.getElementById('playerName').value || 'Hero';
    player.color = document.getElementById('playerColor').value;
    player.skinColor = document.getElementById('skinTone').value;
    player.hairType = document.getElementById('hairStyle').value;
    player.accessory = document.getElementById('accessory').value;
    
    document.getElementById('hudName').innerText = player.name;

    ui.style.display = 'none';
    hud.style.display = 'block';
    canvas.style.display = 'block';

    gameLoop();
});

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

function update() {
    if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
    if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
    if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
    if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
}

function drawPlayer(x, y) {
    let pixelSize = 4 + (player.strength - 10) * 0.2; 

    // 1. Draw Body
    for (let row = 0; row < playerSprite.length; row++) {
        for (let col = 0; col < playerSprite[row].length; col++) {
            let colorCode = playerSprite[row][col];
            if (colorCode === 0) continue; 
            if (colorCode === 1) ctx.fillStyle = '#000000'; 
            if (colorCode === 2) ctx.fillStyle = player.skinColor; 
            if (colorCode === 3) ctx.fillStyle = player.color; 
            if (colorCode === 4) ctx.fillStyle = '#1111aa'; 
            ctx.fillRect(x + (col * pixelSize), y + (row * pixelSize), pixelSize, pixelSize);
        }
    }

    // 2. Draw Hair
    let selectedHair = hairLayouts[player.hairType];
    ctx.fillStyle = selectedHair.color;
    for (let row = 0; row < selectedHair.grid.length; row++) {
        for (let col = 0; col < selectedHair.grid[row].length; col++) {
            if (selectedHair.grid[row][col] === 1) {
                // If wearing a propeller hat, skip drawing hair on the very top of the head so it doesn't clip weirdly
                if (player.accessory === 'propeller' && row < 2) continue; 
                ctx.fillRect(x + (col * pixelSize), y + (row * pixelSize), pixelSize, pixelSize);
            }
        }
    }

    // 3. Draw Accessories
    let accGrid = accessoriesLayouts[player.accessory];
    for (let row = 0; row < accGrid.length; row++) {
        for (let col = 0; col < accGrid[row].length; col++) {
            let accCode = accGrid[row][col];
            if (accCode === 0) continue;

            // Determine colors based on the chosen accessory
            if (player.accessory === 'glasses') {
                if (accCode === 1) ctx.fillStyle = '#000000'; // Black frames
                if (accCode === 2) ctx.fillStyle = '#ffffff'; // White lens shine
            } 
            else if (player.accessory === 'necklace') {
                if (accCode === 1) ctx.fillStyle = '#ffd700'; // Gold chain
                if (accCode === 2) ctx.fillStyle = '#00ffff'; // Diamond pendant
            } 
            else if (player.accessory === 'propeller') {
                if (accCode === 1) ctx.fillStyle = '#ff0000'; // Red hat part
                if (accCode === 2) ctx.fillStyle = '#0000ff'; // Blue hat part
                if (accCode === 3) ctx.fillStyle = '#aaaaaa'; // Silver stick
                if (accCode === 4) ctx.fillStyle = '#ffff00'; // Yellow propeller blades
            }

            ctx.fillRect(x + (col * pixelSize), y + (row * pixelSize), pixelSize, pixelSize);
        }
    }
}

function draw() {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    drawPlayer(player.x, player.y);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
