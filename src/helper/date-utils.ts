import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

//   Utility to get the current date as NgbDateStruct 
export function getCurrentDate(): NgbDateStruct {
    const today = new Date();
    return {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
    };
}

// Utility to get the next specific day of the week 
export function getNextDayByWeekday(weekday: number): NgbDateStruct {
    const currentDate = new Date();
    const daysUntilNextDay = (7 - currentDate.getDay() + weekday) % 7;
    currentDate.setDate(currentDate.getDate() + daysUntilNextDay);
    return {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
    };
}

// Utility to add a number of days to the current date and return the new date as NgbDateStruct

export function addDays(daysToAdd: number): NgbDateStruct {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysToAdd);
    return {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: currentDate.getDate(),
    };
}

// Utility to convert date object to string
export function convertToDateString(date: NgbDateStruct | null): string | null {
    if (date) {
        const year = date.year;
        const month = date.month < 10 ? `0${date.month}` : date.month;
        const day = date.day < 10 ? `0${date.day}` : date.day;
        return `${year}-${month}-${day}`;
    }
    return null;
}

// Utility to to format date to patch value in form
export function formatDate(date: string): string {
    const parsedDate = new Date(date);
    const day = parsedDate.getDate();
    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const year = parsedDate.getFullYear();
    return `${day} ${month} ${year}`;
}
