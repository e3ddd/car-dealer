# Как запустить проект

Car Dealer — Laravel 13 + React (Vite). Backend отдаёт JSON API, фронтенд рендерится через `resources/js`.

## Требования

- PHP **8.3+**
- Composer
- Node.js **18+** и npm
- MySQL **или** SQLite

## 1. Установка зависимостей

Из корня проекта:

```bash
composer install
npm install
```

## 2. Окружение

```bash
cp .env.example .env
php artisan key:generate
```

### Вариант A: SQLite (быстрый старт)

В `.env`:

```env
DB_CONNECTION=sqlite
```

Создайте файл БД:

```bash
touch database/database.sqlite
```

Строки `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` можно закомментировать.

### Вариант B: MySQL

В `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=car_dealer
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Создайте базу `car_dealer` заранее.

## 3. Миграции и сидер

```bash
php artisan migrate
php artisan db:seed --class=CarDealerSeeder
```

Сидер создаёт производителей, дилеров и машины (до 10 машин).

Полный сид через `DatabaseSeeder`:

```bash
php artisan db:seed
```

## 4. Запуск

Нужны **два процесса**: Laravel и Vite.

### Терминал 1 — backend

```bash
php artisan serve
```

Приложение: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Терминал 2 — frontend (hot reload)

```bash
npm run dev
```

### Или одной командой

```bash
composer run dev
```

(`php artisan dev` поднимает окружение разработки Laravel.)

### Production-сборка фронта

Если Vite не нужен постоянно:

```bash
npm run build
php artisan serve
```

## 5. Страницы

| URL | Описание |
|-----|----------|
| `/` | Главная |
| `/cars` | Машины |
| `/dealers` | Дилеры |
| `/manufacturers` | Производители |

## 6. Полезные API

- `GET /car`, `POST /car`, `PUT /car`, `DELETE /car`
- `GET /car/search?term=...`, `GET /car/filter?...`
- `GET /dealer`, `GET /dealer/search?term=...`
- `GET /manufacture`, `GET /manufacture/search?term=...`

## Быстрый чеклист

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
# настроить DB в .env
php artisan migrate
php artisan db:seed --class=CarDealerSeeder
php artisan serve
# в другом терминале:
npm run dev
```

Откройте [http://127.0.0.1:8000](http://127.0.0.1:8000).
