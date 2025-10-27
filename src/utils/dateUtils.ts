import { toZonedTime, fromZonedTime } from "date-fns-tz";
import {
  addDays,
  addMinutes,
  getDay,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { holidayService } from "../services/holidayService";

const TIMEZONE = "America/Bogota"; //identificador estandar  global para la zona horaria de colombia
const WORK_START_HOUR = 8;
const WORK_END_HOUR = 17; // 5 PM
const LUNCH_START_HOUR = 12;
const LUNCH_END_HOUR = 13;

// Verifica si es fin de semana
export function isWeekend(date: Date): boolean {
  const day = getDay(date);
  return day === 0 || day === 6; // Domingo o Sábado
}

// Verifica si es día hábil
export function isWorkingDay(date: Date): boolean {
  return !isWeekend(date) && !holidayService.isHoliday(date); //uso del operador de negación
}

// Verifica si está dentro del horario laboral
export function isWithinWorkingHours(date: Date): boolean {
  const hours = date.getHours(); //devuelve la hora (0-23)
  const minutes = date.getMinutes(); //devuelve los minutos (0-59)
  const timeInMinutes = hours * 60 + minutes;

  const workStart = WORK_START_HOUR * 60; // 8:00 AM
  const lunchStart = LUNCH_START_HOUR * 60; // 12:00 PM
  const lunchEnd = LUNCH_END_HOUR * 60; // 1:00 PM
  const workEnd = WORK_END_HOUR * 60; // 5:00 PM

  // Está dentro del horario laboral pero no en almuerzo
  return (
    (timeInMinutes >= workStart && timeInMinutes < lunchStart) || //basta con que una sea true (or)
    (timeInMinutes >= lunchEnd && timeInMinutes < workEnd)
  );
}

// Ajusta la fecha al horario laboral más cercano hacia atrás
export function adjustToWorkingTime(date: Date): Date {
  let adjusted = new Date(date);

  // Si es fin de semana o festivo, retroceder al último día hábil a las 5 PM
  while (!isWorkingDay(adjusted)) {
    adjusted = addDays(adjusted, -1);
    adjusted = setHours(adjusted, WORK_END_HOUR);
    adjusted = setMinutes(adjusted, 0);
  }

  // Ajustar hora si está fuera del horario laboral
  const hours = adjusted.getHours();
  const minutes = adjusted.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  if (timeInMinutes < WORK_START_HOUR * 60) {
    // Antes de las 8 AM -> mover a 8 AM
    adjusted = setHours(adjusted, WORK_START_HOUR);
    adjusted = setMinutes(adjusted, 0);
  } else if (
    timeInMinutes >= LUNCH_START_HOUR * 60 && // operador logico and
    timeInMinutes < LUNCH_END_HOUR * 60
  ) {
    // Durante almuerzo -> mover a 12 PM (antes del almuerzo)
    adjusted = setHours(adjusted, LUNCH_START_HOUR);
    adjusted = setMinutes(adjusted, 0);
  } else if (timeInMinutes >= WORK_END_HOUR * 60) {
    // Después de las 5 PM -> mover a 5 PM
    adjusted = setHours(adjusted, WORK_END_HOUR);
    adjusted = setMinutes(adjusted, 0);
  }

  adjusted = setSeconds(adjusted, 0);
  adjusted = setMilliseconds(adjusted, 0);

  return adjusted;
}

// Agrega días hábiles
export function addWorkingDays(startDate: Date, daysToAdd: number): Date {
  let currentDate = new Date(startDate);
  let daysAdded = 0; //variable para llevar la cuenta de los dias agregados

  while (daysAdded < daysToAdd) {
    currentDate = addDays(currentDate, 1);

    if (isWorkingDay(currentDate)) {
      daysAdded++;
    }
  }

  return currentDate;
}

// Agrega horas hábiles
export function addWorkingHours(startDate: Date, hoursToAdd: number): Date {
  let currentDate = new Date(startDate);
  let minutesToAdd = hoursToAdd * 60;

  while (minutesToAdd > 0) {
    // Si no es día hábil, avanzar al siguiente día hábil a las 8 AM
    if (!isWorkingDay(currentDate)) {
      currentDate = addDays(currentDate, 1);
      currentDate = setHours(currentDate, WORK_START_HOUR);
      currentDate = setMinutes(currentDate, 0);
      continue;
    }

    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Calcular minutos disponibles hasta el final del día/almuerzo
    let availableMinutes = 0;

    if (currentTimeInMinutes < LUNCH_START_HOUR * 60) {
      // Antes del almuerzo
      availableMinutes = LUNCH_START_HOUR * 60 - currentTimeInMinutes;
    } else if (
      currentTimeInMinutes >= LUNCH_END_HOUR * 60 &&
      currentTimeInMinutes < WORK_END_HOUR * 60
    ) {
      // Después del almuerzo
      availableMinutes = WORK_END_HOUR * 60 - currentTimeInMinutes;
    } else {
      // Fuera de horario, ir al siguiente período
      if (currentTimeInMinutes < LUNCH_END_HOUR * 60) {
        currentDate = setHours(currentDate, LUNCH_END_HOUR);
        currentDate = setMinutes(currentDate, 0);
      } else {
        currentDate = addDays(currentDate, 1);
        currentDate = setHours(currentDate, WORK_START_HOUR);
        currentDate = setMinutes(currentDate, 0);
      }
      continue;
    }

    if (minutesToAdd <= availableMinutes) {
      // Podemos agregar todos los minutos restantes
      currentDate = addMinutes(currentDate, minutesToAdd);
      minutesToAdd = 0;
    } else {
      // Agregar lo que podemos y continuar
      minutesToAdd -= availableMinutes;

      if (currentTimeInMinutes < LUNCH_START_HOUR * 60) {
        // Saltar al final del almuerzo
        currentDate = setHours(currentDate, LUNCH_END_HOUR);
        currentDate = setMinutes(currentDate, 0);
      } else {
        // Ir al siguiente día hábil
        currentDate = addDays(currentDate, 1);
        currentDate = setHours(currentDate, WORK_START_HOUR);
        currentDate = setMinutes(currentDate, 0);
      }
    }
  }

  currentDate = setSeconds(currentDate, 0);
  currentDate = setMilliseconds(currentDate, 0);

  return currentDate;
}

// Convierte de UTC a hora de Colombia
export function convertToColombiaTime(utcDate: Date): Date {
  return toZonedTime(utcDate, TIMEZONE);
}

// Convierte de hora de Colombia a UTC
export function convertToUTC(colombiaDate: Date): Date {
  return fromZonedTime(colombiaDate, TIMEZONE);
}
