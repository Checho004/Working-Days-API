export interface ApiResponse {
  date: string; //Formato de la respuesta exitosa de la API
}

export interface ErrorResponse {
  error: string;
  message: string; // Formato de respuesta cuando existe un error en el input
}

export interface QueryParams {
  days?: string;
  hours?: string; // Parametros de consulta validos en la API
  date?: string;
}

export interface CalculationParams {
  days: number;
  hours: number; // Formato  interno aceptado de los parametros de la API para el calculo interno de las fechas hábiles
  startDate: Date;
}