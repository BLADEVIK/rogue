# Основная структура приложения:
## Генерация карты:
- Сначала создаётся карта, полностью заполненная стенами ('W')
- Генерируется 5-10 случайных комнат размером 3-8 клеток
- Создаётся 3-5 коридоров в случайных местах
- Размещаются предметы (2 меча и 10 зелий здоровья)
- Размещается игрок в случайном пустом месте
- Размещаются 10 врагов в случайных пустых местах
## Управление:
- W - движение вверх
- S - движение вниз
- A - движение влево
- D - движение вправо
- Пробел - атака соседних врагов
## Игровая механика:
- У игрока и врагов есть полоска здоровья
- При подборе зелья здоровья (зелёное) восстанавливается 30 HP
- При подборе меча урон игрока увеличивается на 5
- Враги двигаются случайным образом
- Враги атакуют игрока, если находятся рядом
- Игра заканчивается, когда здоровье игрока падает до 0
## Отрисовка:
- Каждая клетка карты отображается как div с классом 'tile'
- Разные типы клеток имеют разные классы (стена, враг, игрок, предметы)
- Здоровье отображается как красная полоска для врагов и зелёная для игрока
- Каждая клетка имеет размер 50x50 пикселей
## Игровой цикл:
- Каждую секунду враги:
- Двигаются в случайном направлении
- Атакуют игрока, если находятся рядом
- После каждого действия происходит перерисовка карты
## Особенности реализации:
- Вся игровая логика хранится в JavaScript объектах
- DOM используется только для отображения
- Код организован в методы для переиспользования
- Все требования по размерам и количеству объектов соблюдены
- Игра работает без сервера, просто открытием HTML файла
## Безопасность:
- Проверка границ карты при движении
- Проверка столкновений со стенами
- Корректная обработка подбора предметов
- Безопасное удаление врагов при уничтожении
## Игра представляет собой классический рогалик с процедурной генерацией уровней, где игрок должен выживать, собирая предметы и сражаясь с врагами. Все механики реализованы согласно требованиям, а код организован в понятную и поддерживаемую структуру.
