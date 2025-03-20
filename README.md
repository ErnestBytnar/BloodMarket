# BodyBuy - Platforma do handlu organami

## Technologie
- Python
- Django
- React
- PostgreSQL


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

### Backend - Django
- **`api/token/`** - Endpoint do uzyskiwania tokenu JWT
- **`api/token/refresh/`** - Endpoint do odświeżania tokenu JWT
- **`api/user/`** - Endpoint do pobierania danych użytkownika
