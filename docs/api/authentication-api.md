# Authentication API Contract

Энэхүү баримт бичиг нь нэвтрэх үйлчилгээний API гэрээг тодорхойлно.

## API Endpoints (All Implemented)

### 1. Нэвтрэх (Login)

- **IMPLEMENTED**
- **Арга**: `POST`
- **Зам**: `/api/v1/auth/login` (Gateway-ээр дамжин `/auth/login` руу чиглэгдэнэ)
- **Хүсэлтийн бие (Request Body)**:
  ```json
  {
    "email": "user@seek.mn",
    "password": "secure_password"
  }
  ```
- **Амжилттай хариу (Success Response - 201 Created)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "user-uuid",
      "email": "user@seek.mn",
      "status": "ACTIVE"
    }
  }
  ```
  _(Refresh Token-ийг HttpOnly Cookie-д Set-Cookie толгойгоор дамжуулна)._

### 2. Токен шинэчлэх (Refresh)

- **IMPLEMENTED**
- **Арга**: `POST`
- **Зам**: `/api/v1/auth/refresh`
- **Хүсэлт**: Cookie доторх Refresh Token
- **Амжилттай хариу (201 Created)**:
  ```json
  {
    "accessToken": "new-access-token"
  }
  ```

### 3. Гарах (Logout)

- **IMPLEMENTED**
- **Арга**: `POST`
- **Зам**: `/api/v1/auth/logout`
- **Хариу (200 OK)**:
  ```json
  {
    "success": true
  }
  ```
  _(Refresh Token cookie-г устгана, сессийг хүчингүй болгоно)._

### 4. Одоогийн хэрэглэгч (Me)

- **IMPLEMENTED**
- **Арга**: `GET`
- **Зам**: `/api/v1/auth/me`
- **Амжилттай хариу (200 OK)**:
  ```json
  {
    "id": "user-uuid",
    "email": "user@seek.mn",
    "status": "ACTIVE"
  }
  ```
