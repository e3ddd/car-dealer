# How to run the project

Car Dealer — Laravel 13 + React (Vite). The backend serves a JSON API; the frontend is rendered from `resources/js`.

## Requirements

- PHP **8.3+**
- Composer
- Node.js **18+** and npm
- MySQL **or** SQLite

## 1. Install dependencies

From the project root:

```bash
composer install
npm install
```

## 2. Environment

```bash
cp .env.example .env
php artisan key:generate
```

### Option A: SQLite (quick start)

In `.env`:

```env
DB_CONNECTION=sqlite
```

Create the database file:

```bash
touch database/database.sqlite
```

You can comment out `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD`.

### Option B: MySQL

In `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=car_dealer
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Create the `car_dealer` database beforehand.

## 3. Migrations and seeder

```bash
php artisan migrate
php artisan db:seed --class=CarDealerSeeder
```

The seeder creates manufacturers, dealers, and cars (up to 10 cars).

Full seed via `DatabaseSeeder`:

```bash
php artisan db:seed
```

## 4. Run

You need **two processes**: Laravel and Vite.

### Terminal 1 — backend

```bash
php artisan serve
```

App: [http://127.0.0.1:8000](http://127.0.0.1:8000)

### Terminal 2 — frontend (hot reload)

```bash
npm run dev
```

### Or as a single command

```bash
composer run dev
```

(`php artisan dev` starts the Laravel development environment.)

### Production frontend build

If you do not need Vite running continuously:

```bash
npm run build
php artisan serve
```

## 5. Pages

| URL | Description |
|-----|-------------|
| `/` | Home |
| `/cars` | Cars |
| `/dealers` | Dealers |
| `/manufacturers` | Manufacturers |

## 6. Useful API endpoints

- `GET /car`, `POST /car`, `PUT /car`, `DELETE /car`
- `GET /car/filter?...` (size, color, fuel, dealer_id, manufacture_id)
- `GET /dealer`, `GET /dealer/filter?...`
- `GET /manufacture`

## Quick checklist

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
# configure DB in .env
php artisan migrate
php artisan db:seed --class=CarDealerSeeder
php artisan serve
# in another terminal:
npm run dev
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).
