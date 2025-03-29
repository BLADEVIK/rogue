class Game {
    constructor() {
        // Инициализация основных параметров игры
        this.width = 40;        // Ширина игрового поля в клетках
        this.height = 24;       // Высота игрового поля в клетках
        this.map = [];          // Двумерный массив для хранения карты
        this.player = null;     // Объект игрока (создаётся позже)
        this.enemies = [];      // Массив врагов
        this.items = [];        // Массив предметов
        this.playerHealth = 100; // Начальное здоровье игрока
        this.playerDamage = 10;  // Начальный урон игрока
    }

    init() {
        // Инициализация игры: создание карты, настройка управления и запуск игрового цикла
        this.generateMap();
        this.setupEventListeners();
        this.gameLoop();
    }

    generateMap() {
        // Создание пустой карты, заполненной стенами
        for (let y = 0; y < this.height; y++) {
            this.map[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.map[y][x] = 'W'; // 'W' означает стену
            }
        }

        // Генерация случайного количества комнат (от 5 до 10)
        const numRooms = Math.floor(Math.random() * 6) + 5;
        for (let i = 0; i < numRooms; i++) {
            // Случайные размеры комнаты (от 3 до 8 клеток)
            const roomWidth = Math.floor(Math.random() * 6) + 3;
            const roomHeight = Math.floor(Math.random() * 6) + 3;
            // Случайное положение комнаты с отступом от краёв
            const x = Math.floor(Math.random() * (this.width - roomWidth - 1)) + 1;
            const y = Math.floor(Math.random() * (this.height - roomHeight - 1)) + 1;
            
            this.createRoom(x, y, roomWidth, roomHeight);
        }

        // Генерация коридоров (от 3 до 5)
        const numCorridors = Math.floor(Math.random() * 3) + 3;
        for (let i = 0; i < numCorridors; i++) {
            this.createCorridor();
        }

        // Размещение всех игровых объектов
        this.placeItems();      // Размещение предметов (мечи и зелья)
        this.placePlayer();     // Размещение игрока
        this.placeEnemies();    // Размещение врагов
        
        this.render();         // Первоначальная отрисовка карты
    }

    createRoom(x, y, width, height) {
        // Создание прямоугольной комнаты заданного размера
        for (let i = y; i < y + height; i++) {
            for (let j = x; j < x + width; j++) {
                this.map[i][j] = '.'; // '.' означает пустую клетку
            }
        }
    }

    createCorridor() {
        // Создание случайного коридора (горизонтального или вертикального)
        const isHorizontal = Math.random() < 0.5;
        if (isHorizontal) {
            // Создание горизонтального коридора
            const y = Math.floor(Math.random() * (this.height - 1)) + 1;
            const startX = Math.floor(Math.random() * (this.width - 1)) + 1;
            const length = Math.floor(Math.random() * (this.width - startX - 1)) + 1;
            for (let x = startX; x < startX + length; x++) {
                this.map[y][x] = '.';
            }
        } else {
            // Создание вертикального коридора
            const x = Math.floor(Math.random() * (this.width - 1)) + 1;
            const startY = Math.floor(Math.random() * (this.height - 1)) + 1;
            const length = Math.floor(Math.random() * (this.height - startY - 1)) + 1;
            for (let y = startY; y < startY + length; y++) {
                this.map[y][x] = '.';
            }
        }
    }

    placeItems() {
        // Размещение предметов на карте
        // Размещение 2 мечей
        for (let i = 0; i < 2; i++) {
            this.placeRandomItem('SW'); // 'SW' означает меч
        }
        // Размещение 10 зелий здоровья
        for (let i = 0; i < 10; i++) {
            this.placeRandomItem('HP'); // 'HP' означает зелье здоровья
        }
    }

    placeRandomItem(type) {
        // Размещение случайного предмета в пустой клетке
        let x, y;
        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while (this.map[y][x] !== '.'); // Ищем пустую клетку
        this.map[y][x] = type;
    }

    placePlayer() {
        // Размещение игрока в случайной пустой клетке
        let x, y;
        do {
            x = Math.floor(Math.random() * this.width);
            y = Math.floor(Math.random() * this.height);
        } while (this.map[y][x] !== '.');
        // Создание объекта игрока с начальными параметрами
        this.player = { x, y, health: this.playerHealth, damage: this.playerDamage };
        this.map[y][x] = 'P'; // 'P' означает игрока
    }

    placeEnemies() {
        // Размещение 10 врагов в случайных пустых клетках
        for (let i = 0; i < 10; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * this.width);
                y = Math.floor(Math.random() * this.height);
            } while (this.map[y][x] !== '.');
            // Создание объекта врага с начальными параметрами
            this.enemies.push({ x, y, health: 100, damage: 5 });
            this.map[y][x] = 'E'; // 'E' означает врага
        }
    }

    render() {
        // Отрисовка игрового поля
        const field = document.querySelector('.field');
        field.innerHTML = ''; // Очистка поля перед отрисовкой
        
        // Проход по всем клеткам карты
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                
                // Добавление соответствующего класса в зависимости от типа клетки
                switch (this.map[y][x]) {
                    case 'W': tile.classList.add('tileW'); break; // Стена
                    case 'E': tile.classList.add('tileE'); break; // Враг
                    case 'P': tile.classList.add('tileP'); break; // Игрок
                    case 'HP': tile.classList.add('tileHP'); break; // Зелье здоровья
                    case 'SW': tile.classList.add('tileSW'); break; // Меч
                }

                // Добавление полоски здоровья для врагов и игрока
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

                // Установка позиции клетки на поле
                tile.style.left = `${x * 50}px`;
                tile.style.top = `${y * 50}px`;
                field.appendChild(tile);
            }
        }
    }

    setupEventListeners() {
        // Настройка обработчиков клавиш
        document.addEventListener('keydown', (e) => {
            switch (e.key.toLowerCase()) {
                case 'w': this.movePlayer(0, -1); break; // Вверх
                case 's': this.movePlayer(0, 1); break;  // Вниз
                case 'a': this.movePlayer(-1, 0); break; // Влево
                case 'd': this.movePlayer(1, 0); break;  // Вправо
                case ' ': this.attack(); break;          // Атака (пробел)
            }
        });
    }

    movePlayer(dx, dy) {
        // Движение игрока
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;

        // Проверка границ карты и столкновений со стенами
        if (newX < 0 || newX >= this.width || newY < 0 || newY >= this.height) return;
        if (this.map[newY][newX] === 'W') return;

        // Обработка подбора предметов
        if (this.map[newY][newX] === 'HP') {
            this.player.health = Math.min(100, this.player.health + 30); // Восстановление здоровья
        } else if (this.map[newY][newX] === 'SW') {
            this.player.damage += 5; // Увеличение урона
        }

        // Перемещение игрока
        this.map[this.player.y][this.player.x] = '.';
        this.map[newY][newX] = 'P';
        this.player.x = newX;
        this.player.y = newY;

        this.render();
    }

    attack() {
        // Атака игрока по соседним клеткам
        const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // Вниз, вправо, вверх, влево
        for (const [dx, dy] of directions) {
            const targetX = this.player.x + dx;
            const targetY = this.player.y + dy;
            
            // Проверка границ карты
            if (targetX < 0 || targetX >= this.width || targetY < 0 || targetY >= this.height) continue;
            
            // Если в клетке враг, наносим ему урон
            if (this.map[targetY][targetX] === 'E') {
                const enemy = this.enemies.find(e => e.x === targetX && e.y === targetY);
                if (enemy) {
                    enemy.health -= this.player.damage;
                    // Если враг уничтожен, удаляем его с карты
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
        // Основной игровой цикл
        for (const enemy of this.enemies) {
            // Случайное движение врагов
            const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
            const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
            
            const newX = enemy.x + dx;
            const newY = enemy.y + dy;

            // Проверка возможности движения врага
            if (newX >= 0 && newX < this.width && newY >= 0 && newY < this.height && 
                this.map[newY][newX] === '.') {
                this.map[enemy.y][enemy.x] = '.';
                this.map[newY][newX] = 'E';
                enemy.x = newX;
                enemy.y = newY;
            }

            // Атака врага по игроку, если они рядом
            if (Math.abs(enemy.x - this.player.x) <= 1 && Math.abs(enemy.y - this.player.y) <= 1) {
                this.player.health -= enemy.damage;
                // Проверка окончания игры
                if (this.player.health <= 0) {
                    alert('Game Over!');
                    location.reload();
                }
            }
        }
        
        this.render();
        // Запуск следующего цикла через 1 секунду
        setTimeout(() => this.gameLoop(), 1000);
    }
} 