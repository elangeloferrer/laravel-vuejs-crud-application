# Laravel + Vue.js Installation Guide

This guide helps you set up a Laravel + Vue.js single-page application (SPA) from scratch.

---

## Prerequisites

Make sure you have the following installed:

- PHP >= 8.2
- Composer
- Node.js & NPM
- Laravel CLI >= 12.\*
- MySQL or any supported DB

---

## 1. Clone the Project

```bash
https://github.com/elangeloferrer/praxxys-backend-exam.git
cd praxxys-backend-exam
```

## 2. Install PHP Dependencies

```bash
composer install
```

## 3. Install JavaScript Dependencies

```bash
npm install
```

## 4. Create private and public keys

##### Go to `storage/keys` folder

```bash
cd storage/keys
```

##### Generate a 2048-bit private key

```bash
openssl genpkey -algorithm RSA -out jwtRS256.key -pkeyopt rsa_keygen_bits:2048
```

##### Generate the corresponding public key

```bash
openssl rsa -pubout -in jwtRS256.key -out jwtRS256.key.pub
```

## 5. Environment Setup

```bash
cp .env.example .env
```

Edit the .env file and set your database credentials and app URL.

Generate the application key:

```bash
php artisan key:generate
```

## 6. Run Migrations (Optional: with Seeders)

```bash
php artisan migrate --seed
```

## 7. Compile Frontend Assets

```bash
npm run dev
```

## 8. Start Laravel Development Server

```bash
php artisan serve
```

---

You're all set — your **Laravel** + **Vue.js** project is now fully installed and ready to run! 🚀
