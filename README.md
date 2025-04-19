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
    pip install django-ratelimit
    pip install django-countries

### Frontend (React)

    npm install react-router-dom

## Endpointy

### Frontend - React
- **`/`** - Strona główna
- **`/login`** - Endpoint logowania
- **`/dashboard`** - Strona główna, dostępna po zalogowaniu
- **`/register`** - Endpoint rejestracji
- **`/admin`** - Strona admina

### Backend - Django
- **`api/token/`** - Endpoint do uzyskiwania tokenu JWT
- **`api/token/refresh/`** - Endpoint do odświeżania tokenu JWT
- **`api/user/`** - Endpoint do pobierania danych użytkownika
- **`api/register/`** - Endpoint do rejestrowania użytkownika


## Schemat bazy danych 

<img width="955" alt="Zrzut ekranu 2025-04-19 o 22 46 47" src="https://github.com/user-attachments/assets/1dfe5dc4-4215-4917-b715-75e8c079999d" />

