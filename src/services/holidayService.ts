import axios from "axios";

const HOLIDAYS_URL = "https://content.capta.co/Recruitment/WorkingDays.json";

export class HolidayService {
  private holidays: Set<string> = new Set();  //Colección de valores unicos
  private loaded: boolean = false;

  async loadHolidays(): Promise<void> {//Descarga los festivos 
    if (this.loaded) return;

    try {

      const response = await axios.get<string[]>(HOLIDAYS_URL);  //AXIOS para petición GET a la URL 

      // Cada elemento es directamente una fecha en formato YYYY-MM-DD
      response.data.forEach((dateStr: string) => {
        this.holidays.add(dateStr);
      });

      this.loaded = true;
      console.log(` Loaded ${this.holidays.size} holidays`);
    } catch (error) {
      console.error(" Failed to load holidays:", error);
      throw new Error("Failed to load holidays");
    }
  }

  isHoliday(date: Date): boolean {
    const dateStr = date.toISOString().split("T")[0];
    return this.holidays.has(dateStr);
  }
}

// Crear una instancia única (Singleton) de la clase 
export const holidayService = new HolidayService();
