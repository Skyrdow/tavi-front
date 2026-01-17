# API Endpoints Documentation

This document lists all available endpoints in the llm-cm-agent-backend API, designed for frontend integration.

## Base URL

The API runs on `https://llm-cm-agent-backend.onrender.com`.

## Endpoints

### 1. Ping (Health Check)

- **Method:** GET
- **Path:** `/api/v1/ping`
- **Description:** Test endpoint to check if the server is running.
- **Response:**
  ```json
  {
    "message": "pong"
  }
  ```

### 2. Gemini Request

- **Method:** POST
- **Path:** `/api/v1/geminiRequest`
- **Description:** Generate content using Google's Gemini AI.
- **Request Body:**
  ```json
  {
    "prompt": "string (required)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Solicitud a Gemini completada",
    "data": "generated content string"
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "Datos inválidos",
    "error": {
      "details": "error message",
      "code": 400
    }
  }
  ```

### 3. Instagram Login

- **Method:** GET
- **Path:** `/auth/instagram/login`
- **Description:** Initiates Instagram OAuth login flow. Redirects to Instagram authorization page.
- **Response:** Redirect to Instagram OAuth URL.

### 4. Instagram OAuth Callback

- **Method:** GET
- **Path:** `/auth/instagram/callback`
- **Description:** Handles the OAuth callback from Instagram after user authorization.
- **Query Parameters:** `code` (authorization code from Instagram)
- **Response:**
  ```json
  {
    "access_token": "instagram access token",
    "user_id": "instagram user id"
  }
  ```
- **Error Response:**
  ```json
  {
    "error": "Code not provided"
  }
  ```

### 5. Instagram Publish

- **Method:** POST
- **Path:** `/api/v1/instagram/publish`
- **Description:** Publishes an image to Instagram Business account.
- **Request Body:**
  ```json
  {
    "user_id": "string (required)",
    "access_token": "string (required)",
    "image_url": "string (required)",
    "caption": "string (optional)"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "creation_id": "media creation id",
    "publish_data": {
      // Instagram API response object
    }
  }
  ```
- **Error Responses:**
  - Missing data: `{"error": "Faltan datos requeridos", "details": "error message"}`
  - Media creation failure: `{"error": "Fallo en creación de media", "details": "response body"}`
  - Publishing failure: `{"error": "Fallo en publicación de media", "details": "response body"}`

### 6. Admin Register

- **Method:** POST
- **Path:** `/api/v1/admin-register`
- **Description:** Registers a new admin user.
- **Request Body:**
  ```json
  {
    "names": "string",
    "lastnames": "string",
    "rut": "string",
    "dv": "string",
    "email": "string"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "token": "string"
    },
    "message": "Registro exitoso",
    "success": true
  }
  ```

### 7. Verification Response

- **Method:** POST
- **Path:** `/api/v1/verification-response`
- **Description:** Verifies the admin account using a code.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "code": "string"
  }
  ```
- **Response:**
  ```json
  {
    "data": null,
    "message": "Cuenta verificada correctamente",
    "success": true
  }
  ```

### 8. Create Tenant

- **Method:** POST
- **Path:** `/api/v1/tenants`
- **Description:** Creates a new tenant/business.
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "string",
    "slug": "string",
    "categoryID": "string"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "id": "string",
      "name": "string",
      "description": "",
      "status": "active",
      "slug": "string",
      "categoryID": "string",
      "adminID": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "deletedAt": "string"
    },
    "message": "Negocio creado correctamente",
    "success": true
  }
  ```

### 9. Login

- **Method:** POST
- **Path:** `/api/v1/login`
- **Description:** Logs in a user with username and password.
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "data": {
      "token": "string"
    },
    "message": "Inicio de sesión exitoso",
    "success": true
  }
  ```

### 10. Get Comments

- **Method:** GET
- **Path:** `/api/v1/comments/:tenantid`
- **Description:** Retrieves comments for a specific tenant.
- **Response:**
  ```json
  {
    // Response structure not specified, assuming array of comments
  }
  ```

## Authentication

- Instagram endpoints require OAuth flow to obtain `access_token` and `user_id`.
- Gemini endpoint does not require authentication.

## Notes

- All responses are in JSON format.
- Error responses include appropriate HTTP status codes.
- The server uses Gin framework and runs on port 8080.
