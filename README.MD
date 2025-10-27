# Working Days API

**API Desplegada en:** https://working-days-api-psi.vercel.app

**Repositorio:** https://github.com/Checho004/Working-Days-API

## Descripción

API REST para calcular fechas hábiles en Colombia considerando:

- Días laborales (lunes a viernes)
- Horario laboral (8:00 AM - 5:00 PM, hora de Colombia)
- Hora de almuerzo (12:00 PM - 1:00 PM)
- Festivos colombianos oficiales

## Prueba la API en Producción

La API está desplegada y lista para usar. Prueba estos endpoints:

**Health Check:** Para revisar el estado del servidor de la API

```
https://working-days-api-psi.vercel.app/health
```

**Ejemplos de uso:**

````
https://working-days-api-psi.vercel.app/calculate?hours=1
https://working-days-api-psi.vercel.app/calculate?days=1
https://working-days-api-psi.vercel.app/calculate?days=1&hours=4
https://working-days-api-psi.vercel.app/calculate?date=2025-04-10T15:00:00.000Z&days=5&hours=4


## Instalación

```bash
npm install
````

## Ejecución Local

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`

## Endpoints

### GET /calculate

Calcula la fecha resultante después de sumar días y/o horas hábiles.

**Parámetros (query string):**

- `days` (opcional): Número entero positivo de días hábiles a sumar
- `hours` (opcional): Número entero positivo de horas hábiles a sumar
- `date` (opcional): Fecha inicial en UTC (ISO 8601 con sufijo Z). Si no se provee, usa la fecha actual.

**Ejemplos:**

```
GET /calculate?hours=1
GET /calculate?days=1
GET /calculate?days=1&hours=4
GET /calculate?date=2025-04-10T15:00:00.000Z&days=5&hours=4
```

**Respuesta exitosa (200):**

```json
{
  "date": "2025-08-01T14:00:00.000Z"
}
```

**Respuesta de error (400):**

```json
{
  "error": "InvalidParameters",
  "message": "Detalle del error"
}
```

### GET /health

Verifica que la API esté funcionando.

**Respuesta:**

```json
{
  "status": "OK",
  "message": "API is running"
}
```

## Build para Producción

```bash
npm run build
npm start
```

## Tecnologías

- **Node.js** - Runtime
- **TypeScript** - Lenguaje
- **Express** - Framework web
- **date-fns** - Manipulación de fechas
- **date-fns-tz** - Manejo de zonas horarias
- **axios** - Cliente HTTP

## Reglas de Negocio

- Días hábiles: Lunes a viernes
- Horario laboral: 8:00 AM - 5:00 PM (Colombia, UTC-5)
- Almuerzo: 12:00 PM - 1:00 PM (no cuenta como tiempo laboral)
- Se excluyen festivos colombianos oficiales
- Si la fecha inicial está fuera del horario laboral, se ajusta hacia atrás al horario válido más cercano
- Los cálculos se hacen en hora de Colombia, la respuesta en UTC

## Estructura del Proyecto

```
src/
├── services/
│   ├── calculationService.ts  # Lógica de cálculo principal
│   └── holidayService.ts      # Manejo de festivos
├── types/
│   └── index.ts               # Definiciones de tipos
├── utils/
│   ├── dateUtils.ts          # Utilidades de fechas
│   └── validator.ts          # Validación de parámetros
└── index.ts                  # Servidor Express
```

## Autor

Sergio Andres Arenas Castaño
