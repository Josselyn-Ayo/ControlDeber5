# Implementaciones realizadas

Este proyecto ya no funciona como la plantilla inicial de Expo. Ahora tiene autenticación con Supabase, navegación protegida por sesión, persistencia de usuario y una pantalla principal enfocada en la gestión de carros.

## 1. Autenticación con Supabase

Se agregó Supabase Auth para que el usuario pueda crear una cuenta, iniciar sesión y cerrar sesión dentro de la app.

### Qué resuelve

- Permite registrar usuarios nuevos con correo y contraseña.
- Permite iniciar sesión con una cuenta existente.
- Guarda la sesión de forma persistente para que el usuario no tenga que entrar cada vez que abre la app.
- Permite cerrar sesión desde la pantalla principal.

### Archivos involucrados

- `src/api/supabase.ts`
- `src/providers/auth-provider.tsx`
- `app/login.tsx`
- `app/signup.tsx`
- `app/index.tsx`
- `app/(tabs)/_layout.tsx`

### Cómo funciona

1. `src/api/supabase.ts` crea el cliente de Supabase con las variables de entorno del proyecto.
2. Ese cliente usa `AsyncStorage` para conservar la sesión en el dispositivo.
3. `src/providers/auth-provider.tsx` centraliza el estado de autenticación.
4. Las pantallas `login` y `signup` usan ese provider para ejecutar `signIn`, `signUp` y `signOut`.
5. `app/index.tsx` decide a qué pantalla enviar al usuario según exista o no una sesión activa.
6. `app/(tabs)/_layout.tsx` evita que un usuario sin sesión entre a la parte principal de la app.

## 2. Cliente de Supabase

Se creó un cliente único de Supabase para no repetir configuración en varios archivos.

### Archivo

- `src/api/supabase.ts`

### Detalles

- Usa `EXPO_PUBLIC_SUPABASE_URL` para la URL del proyecto.
- Usa `EXPO_PUBLIC_SUPABASE_KEY` como clave pública.
- Configura `persistSession: true` para mantener la sesión.
- Configura `autoRefreshToken: true` para renovar el token cuando sea necesario.
- Desactiva `detectSessionInUrl` porque la app se ejecuta como aplicación móvil, no como flujo web basado en URL.

## 3. Provider de autenticación

Se creó un provider para no manejar la autenticación de forma dispersa en cada pantalla.

### Archivo

- `src/providers/auth-provider.tsx`

### Responsabilidad

Este archivo administra:

- `session`: almacena la sesión actual del usuario.
- `isLoading`: indica si todavía se está comprobando si ya existe una sesión guardada.
- `signIn(email, password)`: inicia sesión.
- `signUp(email, password)`: crea una cuenta.
- `signOut()`: cierra la sesión actual.

### Por qué es importante

Sin este provider, cada pantalla tendría que consultar Supabase por su cuenta. Con él, la app tiene una sola fuente de verdad para saber si el usuario está autenticado o no.

## 4. Pantalla de login

Se creó una pantalla específica para que el usuario pueda entrar con sus credenciales.

### Archivo

- `app/login.tsx`

### Qué hace

- Muestra campos para correo y contraseña.
- Llama a `signIn` cuando el usuario presiona `Entrar`.
- Si ocurre un error, lo muestra en pantalla.
- Si el login es correcto, redirige a la pantalla principal con `router.replace('/(tabs)')`.

### Detalle importante

El `router.replace` es clave porque evita que el usuario vuelva a la pantalla de login usando el botón de retroceso.

## 5. Pantalla de registro

Se agregó una pantalla para crear nuevos usuarios.

### Archivo

- `app/signup.tsx`

### Qué hace

- Permite capturar correo y contraseña.
- Llama a `signUp` para crear la cuenta en Supabase.
- Muestra un mensaje si la cuenta se creó correctamente.
- Incluye navegación de regreso a la pantalla de login.

### Observación

Si en Supabase está activa la confirmación por correo, el usuario puede necesitar validar su email antes de poder iniciar sesión.

## 6. Protección de rutas

La app principal ya no queda abierta para cualquiera.

### Archivos

- `app/index.tsx`
- `app/(tabs)/_layout.tsx`
- `app/_layout.tsx`

### Qué hace el flujo

- `app/index.tsx` actúa como puerta de entrada.
- Si hay sesión, redirige a `/(tabs)`.
- Si no hay sesión, redirige a `/login`.
- `app/(tabs)/_layout.tsx` vuelve a validar la sesión antes de mostrar las pestañas.

### Beneficio

Aunque el usuario intente entrar manualmente a una ruta interna, la app sigue controlando el acceso según la sesión actual.

## 7. Layout raíz

Se ajustó el layout principal para que toda la app comparta el mismo contexto de sesión y el mismo cliente de TanStack Query.

### Archivo

- `app/_layout.tsx`

### Qué contiene

- `QueryClientProvider` para la cache y mutaciones de TanStack Query.
- `AuthProvider` para el estado de autenticación.
- `Stack` de Expo Router para definir la navegación principal.

### Por qué se hizo así

Esto permite que cualquier pantalla pueda usar el estado de auth y las consultas de red sin repetir configuración.

## 8. Pantalla principal de carros

La pantalla inicial de ejemplo fue reemplazada por una vista funcional de la app.

### Archivo

- `app/(tabs)/index.tsx`

### Qué hace

- Muestra un formulario para agregar carros.
- Lista los carros existentes.
- Permite cerrar sesión.
- Usa `useCarros` para obtener datos.
- Usa `useAgregarCarro` para crear registros.

### Qué cambió respecto al starter

- Se quitó la pantalla demo inicial.
- Se convirtió en una pantalla de trabajo real enfocada en el dominio del proyecto.

## 9. Consumo de API para carros

La lógica de carros quedó separada en servicios y hooks.

### Archivos

- `src/api/client.ts`
- `src/api/carros.service.ts`
- `src/hooks/useCarros.ts`
- `src/types/carro.ts`

### Función de cada uno

- `src/api/client.ts`: cliente HTTP base con la URL del backend.
- `src/api/carros.service.ts`: métodos para obtener y agregar carros.
- `src/hooks/useCarros.ts`: hooks reutilizables para leer y mutar datos.
- `src/types/carro.ts`: tipo `Carro` compartido para mantener consistencia.

### Ventaja

La UI no habla directamente con la API. En vez de eso, consume hooks y servicios más fáciles de mantener.

## 10. Variables de entorno

Se definieron variables obligatorias para que la app funcione correctamente.

### Archivo

- `.env`

### Variables usadas

- `EXPO_PUBLIC_API_URL`: base URL del backend de carros.
- `EXPO_PUBLIC_SUPABASE_URL`: URL del proyecto Supabase.
- `EXPO_PUBLIC_SUPABASE_KEY`: clave pública de Supabase.

### Importancia

Si una de estas variables falta, la app no podrá conectar con la API o con Supabase.

## 11. Dependencias agregadas

### Paquetes nuevos

- `@supabase/supabase-js`: cliente oficial de Supabase.
- `@react-native-async-storage/async-storage`: persistencia local de la sesión.
- `@tanstack/react-query`: manejo de cache, queries y mutaciones.
- `axios`: cliente HTTP para la API de carros.

## 12. Flujo completo de la app

Este es el recorrido real del usuario ahora:

1. El usuario abre la app.
2. La app entra por `app/index.tsx`.
3. Si ya existe una sesión guardada, lo manda a la pantalla principal.
4. Si no hay sesión, lo manda al login.
5. Desde login puede entrar o desde signup puede crear una cuenta.
6. Cuando la sesión queda activa, la navegación principal se desbloquea.
7. En la pantalla principal puede ver carros, agregar nuevos y cerrar sesión.

## 13. Resumen corto

La app quedó preparada para trabajar con autenticación real y navegación protegida. Además, la lógica de carros quedó separada en servicios, hooks y tipos, lo que hace el proyecto más ordenado y más fácil de extender.