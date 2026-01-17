# Instrucciones para Implementar el Flujo de Login en Frontend

## Resumen del Flujo de Login en Backend

El backend proporciona un endpoint POST `/api/v1/login` que espera un JSON con `username` y `password`. Si las credenciales son válidas, devuelve un token JWT.

### Endpoint: POST /api/v1/login

- **Body esperado:**
  ```json
  {
    "username": "string",
    "password": "string" // mínimo 8 caracteres
  }
  ```
- **Respuesta exitosa:**
  ```json
  {
    "success": true,
    "message": "Inicio de sesión exitoso",
    "data": {
      "token": "jwt_token_here"
    }
  }
  ```
- **Errores posibles:**
  - 400: Datos inválidos
  - 500: Error interno (credenciales inválidas, etc.)

## Pasos para Implementar en Frontend

1. **Crear Formulario de Login:**
   - Campo para username (requerido)
   - Campo para password (requerido, mínimo 8 caracteres)
   - Botón de submit
   - Manejo de errores (mostrar mensajes de error del backend)

2. **Enviar Solicitud de Login:**
   - Usar fetch o axios para POST a `/api/v1/login`
   - Enviar JSON con username y password
   - Manejar respuesta: si success=true, almacenar token; si no, mostrar error

3. **Almacenar Token:**
   - Guardar el token en localStorage o sessionStorage
   - Ejemplo: `localStorage.setItem('authToken', token)`

4. **Usar Token en Solicitudes Autenticadas:**
   - Incluir en header: `Authorization: Bearer ${token}`
   - Para rutas protegidas en el backend

5. **Manejo de Logout:**
   - Remover token del storage
   - Redirigir a página de login

6. **Consideraciones Adicionales:**
   - Validar campos en frontend antes de enviar
   - Manejar expiración de token (401 responses)
   - Redirigir después de login exitoso
   - Implementar protección de rutas en frontend (verificar token presente)

## Ejemplo de Código Básico (JavaScript/React)

```javascript
// Función de login
async function login(username, password) {
  try {
    const response = await fetch("/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem("authToken", data.data.token);
      // Redirigir a dashboard
    } else {
      // Mostrar error
    }
  } catch (error) {
    // Manejar error de red
  }
}

// Usar token en requests
const token = localStorage.getItem("authToken");
fetch("/api/v1/protected-route", {
  headers: { Authorization: `Bearer ${token}` },
});
```
