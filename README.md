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
    pip install python-decouple
    pip install django-filter
    pip install pilow

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

<img width="938" alt="Zrzut ekranu 2025-04-18 o 16 59 21" src="https://github.com/user-attachments/assets/84d16933-7d39-44f9-8083-2f7ab673697b" />



## Zabezpieczenia
- Walidacje danych na frontendzie
- Walidacja danych na backendzie
- Login rate limit
- Logowanie z tokenem JWT
- Podział na role
- Zapisywanie logów udanych i nieudanych zalogowań
- Hashowanie haseł
- CORS
- Wygasanie tokenu JWT
- Wyświetlanie informacji o błędach bez szczegółów(np. bez informacji czy użytkownik o danym loginie istnieje)



## Przykład pliku .env
SECRET_KEY=123
DEBUG=True

DB_NAME=Blood_market
DB_USER=postgres
DB_PASSWORD=123
DB_HOST=localhost
DB_PORT=5432

