import { CalculationParams } from "../types";
import {
  convertToColombiaTime,
  convertToUTC,
  adjustToWorkingTime,
  addWorkingDays,
  addWorkingHours,
} from "../utils/dateUtils";

//Calcular fecha hábil

export function calculateWorkingDate(params: CalculationParams): Date {
  const { days, hours, startDate } = params; //desestructuración de parametro

  // Convertir a hora de Colombia
  let colombiaDate = convertToColombiaTime(startDate);

  // Ajustar a horario laboral si es necesario
  colombiaDate = adjustToWorkingTime(colombiaDate);

  // Sumar días primero
  if (days > 0) {
    colombiaDate = addWorkingDays(colombiaDate, days);
  }

  // Luego sumar horas
  if (hours > 0) {
    colombiaDate = addWorkingHours(colombiaDate, hours);
  }

  // Convertir de vuelta a UTC
  return convertToUTC(colombiaDate);
}
