# BodyBuy - Platforma do handlu organami

## Technologie
- Python 3.10.11
- Django 5.1.7
- Rest Framework 3.15.2
- React 19.0.0
- PostgreSQL 15.2


### Backend (Python)

    pip install django
    pip install djangorestframework
    pip install django-cors-headers
    pip install djangorestframework-simplejwt
    pip install psycopg2

### Frontend (React)

    npm install react-router-dom

## Endpoints

### Frontend - React
- **`/login`** - Endpoint logowania
- **`/dashboard`** - Strona główna, dostępna po zalogowaniu
- **`/register`** - Endpoint rejestracji

### Backend - Django
- **`api/token/`** - Endpoint do uzyskiwania tokenu JWT
- **`api/token/refresh/`** - Endpoint do odświeżania tokenu JWT
- **`api/user/`** - Endpoint do pobierania danych użytkownika
- **`api/register/`** - Endpoint do rejestrowania użytkownika