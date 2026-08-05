const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const ui = document.getElementById('ui');
const hud = document.getElementById('hud');
const startBtn = document.getElementById('startBtn');

// Player Stats and Customizations
let player = {
    name: '',
    color: '#0055ff',
    skinColor: '#ffcc99',
    hairType: 'short_brown',
    x: 400,
    y: 300,
    speed: 5,
    money: 0,
    strength: 10
};

let keys = {};

// ---------------------------------------------------------
// NEW & IMPROVED HAIR GRIDS (5x10 to cover the whole head!)
// ---------------------------------------------------------
const hairLayouts = {
    dreads_black: {
        color: '#111111',
        grid: [
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,0,0,1,1],
            [1,1,0,0,0,0,0,0,1,1], // Dreads hanging down
            [1,0,0,0,0,0,0,0,0,1]
        ]
    },
    short_red: {
        color: '#cc2200',
        grid: [ // Spiky top!
            [0,1,0,1,0,1,0,1,0,0],
            [1,1,1,1,1,1,1,1,1,0],
            [0,1,1,0,0,0,0,1,1,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ]
    },
    short_blonde: {
        color: '#e6c200',
        grid: [ // Side part / swoop
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,0],
            [0,1,1,1,0,0,0,0,1,0],
            [0,1,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ]
    },
    buzz_darkbrown: {
        color: '#2b1d0c',
        grid: [ // Barely there
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,0,0,0,0,1,1,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ]
    },
    short_brown: {
        color: '#5a3d28',
        grid: [ // Classic messy top
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [1,1,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ]
    },
    curly_brown: {
        color: '#4a2e1b',
        grid: [ // Big and puffy
            [0,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,0,0,0,0,1,1,1],
            [1,1,0,0,0,0,0,0,1,1],
            [0,0,0,0,0,0,0,0,0,0]
        ]
    }
};

// Base Body Grid (10x10)
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

    // 1. Draw Body & Head
    for (let row = 0; row < playerSprite.length; row++) {
        for (let col = 0; col < playerSprite[row].length; col++) {
            let colorCode = playerSprite[row][col];
            
            if (colorCode === 0) continue; 
            if (colorCode === 1) ctx.fillStyle = '#000000'; // Outline
            if (colorCode === 2) ctx.fillStyle = player.skinColor; 
            if (colorCode === 3) ctx.fillStyle = player.color; 
            if (colorCode === 4) ctx.fillStyle = '#1111aa'; 

            ctx.fillRect(x + (col * pixelSize), y + (row * pixelSize), pixelSize, pixelSize);
        }
    }

    // 2. Draw Hair Overlay (Now maps over 5 rows instead of 3)
    let selectedHair = hairLayouts[player.hairType];
    ctx.fillStyle = selectedHair.color;

    for (let row = 0; row < selectedHair.grid.length; row++) {
        for (let col = 0; col < selectedHair.grid[row].length; col++) {
            if (selectedHair.grid[row][col] === 1) {
                ctx.fillRect(x + (col * pixelSize), y + (row * pixelSize), pixelSize, pixelSize);
            }
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
