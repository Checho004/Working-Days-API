import { QueryParams } from "../types";

export function validateParams(query: QueryParams): {
  days: number;
  hours: number;
  startDate: Date;
} {
  const { days, hours, date } = query;

  // Al menos uno debe estar presente
  if (!days && !hours) {
    throw new Error("At least one parameter (days or hours) must be provided");
  }

  // Validar days
  let daysNum = 0;
  if (days !== undefined) {
    //operador desigual estricto
    daysNum = parseInt(days, 10);
    if (isNaN(daysNum) || daysNum < 0) {
      throw new Error("days must be a positive integer");
    }
  }

  // Validar hours
  let hoursNum = 0;
  if (hours !== undefined) {
    //operador desigual estricto
    hoursNum = parseInt(hours, 10);
    if (isNaN(hoursNum) || hoursNum < 0) {
      throw new Error("hours must be a positive integer");
    }
  }

  // Validar y parsear fecha
  let startDate: Date;
  if (date) {
    if (!date.endsWith("Z")) {
      throw new Error(
        "date must be in UTC format with Z suffix (e.g., 2025-04-10T15:00:00.000Z)"
      );
    }
    startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
      throw new Error("date must be a valid ISO 8601 UTC date");
    }
  } else {
    startDate = new Date(); // Hora actual UTC
  }

  return { days: daysNum, hours: hoursNum, startDate };
}
