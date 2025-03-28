class Game {
    constructor() {
        this.width = 40;        // Ширина карты
        this.height = 24;       // Высота карты
        this.map = [];          // Массив для хранения карты
        this.player = null;     // Объект игрока
        this.enemies = [];      // Массив врагов
        this.items = [];        // Массив предметов
        this.playerHealth = 100; // Здоровье игрока
        this.playerDamage = 10;  // Урон игрока
    }

    init() {
        this.generateMap();
        this.setupEventListeners();
        this.gameLoop();
    }

    generateMap() {
        // Initialize map with walls
        for (let y = 0; y < this.height; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.map[y][x] = 'W';
            }
        }

        // Generate rooms
        const numRooms = Math.floor(Math.random() * 6) + 5; // 5-10 rooms
        for (let i = 0; i < numRooms; i++) {
            const roomWidth = Math.floor(Math.random() * 6) + 3; // 3-8
            const roomHeight = Math.floor(Math.random() * 6) + 3;
            const x = Math.floor(Math.random() * (this.width - roomWidth - 1)) + 1;
            const y = Math.floor(Math.random() * (this.height - roomHeight - 1)) + 1;
            
            this.createRoom(x, y, roomWidth, roomHeight);
        }

        // Generate corridors
        const numCorridors = Math.floor(Math.random() * 3) + 3; // 3-5
        for (let i = 0; i < numCorridors; i++) {
            this.createCorridor();
        }

        // Place items and entities
        this.placeItems();
        this.placePlayer();
        this.placeEnemies();
        
        this.render();
    }

    createRoom(x, y, width, height) {
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                this.map[i][j] = '.';
            }
        }
    }

    createCorridor() {
        const isHorizontal = Math.random() < 0.5;
        if (isHorizontal) {
            const y = Math.floor(Math.random() * (this.height - 1)) + 1;
            const startX = Math.floor(Math.random() * (this.width - 1)) + 1;
            const length = Math.floor(Math.random() * (this.width - startX - 1)) + 1;
            for (let x = startX; x < startX + length; x++) {
                this.map[y][x] = '.';
            }
        } else {
            const x = Math.floor(Math.random() * (this.width - 1)) + 1;
            const startY = Math.floor(Math.random() * (this.height - 1)) + 1;
            const length = Math.floor(Math.random() * (this.height - startY - 1)) + 1;
            for (let y = startY; y < startY + length; y++) {
                this.map[y][x] = '.';
            }
        }
    }

    placeItems() {
        // Place swords
        for (let i = 0; i < 2; i++) {
            this.placeRandomItem('SW');
        }
        // Place health potions
        for (let i = 0; i < 10; i++) {
            this.placeRandomItem('HP');
        }
    }

    placeRandomItem(type) {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while (this.map[y][x] !== '.');
        this.map[y][x] = type;
    }

    placePlayer() {
        let x, y;
        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while (this.map[y][x] !== '.');
        this.player = { x, y, health: this.playerHealth, damage: this.playerDamage };
        this.map[y][x] = 'P';
    }

    placeEnemies() {
        for (let i = 0; i < 10; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.width);
                y = Math.floor(Math.random() * this.height);
            } while (this.map[y][x] !== '.');
            this.enemies.push({ x, y, health: 100, damage: 5 });
            this.map[y][x] = 'E';
        }
    }

    render() {
        const field = document.querySelector('.field');
        field.innerHTML = '';
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                
                switch (this.map[y][x]) {
                    case 'W': tile.classList.add('tileW'); break;
                    case 'E': tile.classList.add('tileE'); break;
                    case 'P': tile.classList.add('tileP'); break;
                    case 'HP': tile.classList.add('tileHP'); break;
                    case 'SW': tile.classList.add('tileSW'); break;
                }

                // Add health bars
                if (this.map[y][x] === 'E') {
                    const enemy = this.enemies.find(e => e.x === x && e.y === y);
                    if (enemy) {
                        const health = document.createElement('div');
                        health.className = 'health';
                        health.style.width = `${enemy.health}%`;
                        tile.appendChild(health);
                    }
                } else if (this.map[y][x] === 'P') {
                    const health = document.createElement('div');
                    health.className = 'health';
                    health.style.width = `${this.player.health}%`;
                    tile.appendChild(health);
                }

                tile.style.left = `${x * 50}px`;
                tile.style.top = `${y * 50}px`;
                field.appendChild(tile);
            }
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': this.movePlayer(0, -1); break;
                case 's': this.movePlayer(0, 1); break;
                case 'a': this.movePlayer(-1, 0); break;
                case 'd': this.movePlayer(1, 0); break;
                case ' ': this.attack(); break;
            }
        });
    }

    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        if (newX < 0 || newX >= this.width || newY < 0 || newY >= this.height) return;
        if (this.map[newY][newX] === 'W') return;

        // Handle items
        if (this.map[newY][newX] === 'HP') {
            this.player.health = Math.min(100, this.player.health + 30);
        } else if (this.map[newY][newX] === 'SW') {
            this.player.damage += 5;
        }

        // Move player
        this.map[this.player.y][this.player.x] = '.';
        this.map[newY][newX] = 'P';
        this.player.x = newX;
        this.player.y = newY;

        this.render();
    }

    attack() {
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dx, dy] of directions) {
            const targetX = this.player.x + dx;
            const targetY = this.player.y + dy;
            
            if (targetX < 0 || targetX >= this.width || targetY < 0 || targetY >= this.height) continue;
            
            if (this.map[targetY][targetX] === 'E') {
                const enemy = this.enemies.find(e => e.x === targetX && e.y === targetY);
                if (enemy) {
                    enemy.health -= this.player.damage;
                    if (enemy.health <= 0) {
                        this.map[targetY][targetX] = '.';
                        this.enemies = this.enemies.filter(e => e !== enemy);
                    }
                }
            }
        }
        this.render();
    }

    gameLoop() {
        // Enemy movement and attacks
        for (const enemy of this.enemies) {
            // Simple random movement
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
            
            const newX = enemy.x + dx;
            const newY = enemy.y + dy;

            if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height && 
                this.map[newY][newX] === '.') {
                this.map[enemy.y][enemy.x] = '.';
                this.map[newY][newX] = 'E';
                enemy.x = newX;
                enemy.y = newY;
            }

            // Enemy attack
            if (Math.abs(enemy.x - this.player.x) <= 1 && Math.abs(enemy.y - this.player.y) <= 1) {
                this.player.health -= enemy.damage;
                if (this.player.health <= 0) {
                    alert('Game Over!');
                    location.reload();
                }
            }
        }
        
        this.render();
        setTimeout(() => this.gameLoop(), 1000);
    }
} 