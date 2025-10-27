import express, { Request, Response } from "express";
import { holidayService } from "./services/holidayService";
import { validateParams } from "./utils/validator";
import { calculateWorkingDate } from "./services/calculationService";
import { ApiResponse, ErrorResponse, QueryParams } from "./types";

const app = express(); // Crea la instancia de la aplicación express para registrar rutas
const PORT = process.env.PORT || 3000; // Obtiene el puerto desde la variable de entorno PORT si existe; si no, usa 3000.

app.use(express.json()); //Registra el middleware que parsea cuerpos JSON

// Endpoint principal
app.get(
  "/calculate", //definir ruta  HTTP GET en la URL /calculate
  async (
    req: Request<{}, {}, {}, QueryParams>,
    res: Response<ApiResponse | ErrorResponse>
  ) => {
    try {
      // Validar parámetros
      const params = validateParams(req.query);

      // Calcular fecha resultante
      const resultDate = calculateWorkingDate(params);

      // Formatear respuesta
      const response: ApiResponse = {
        date: resultDate.toISOString(), //Para devolver una cadena UTC estandar
      };

      res.status(200).json(response); //envia respuesta codigo 200 (OK)
    } catch (error) {
      const errorResponse: ErrorResponse = {
        error: "InvalidParameters",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
      res.status(400).json(errorResponse); //envia respuesta codigo 200 (BAD REQUEST)
    }
  }
);

// Health check endpoint, verificar si el servidor esta activo y funcionando
app.get("/health", (req: Request, res: Response) => {
  //definir ruta  HTTP GET en la URL /health
  res.status(200).json({ status: "OK", message: "API is running" });
});

// Inicializar servidor
async function startServer(): Promise<void> {
  try {
    // Cargar festivos antes de iniciar
    console.log(" Loading Colombian holidays...");
    await holidayService.loadHolidays();

    app.listen(PORT, () => {
      //Inicia el servidor Express para escuchar peticiones HTTP en el puerto definido.
      console.log(` Server running on port ${PORT}`);
      console.log(` Endpoint: http://localhost:${PORT}/calculate`);
      console.log(` Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error(" Failed to start server:", error);
    process.exit(1); // detiene la ejecución, codigo de error 1 (fallo)
  }
}

startServer();

// Exporta la app para Vercel
export default app;
