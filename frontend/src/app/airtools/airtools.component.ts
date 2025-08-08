import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { generate, interval, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'olab-airtools',
    imports: [FormsModule, AsyncPipe],
    templateUrl: './airtools.component.html',
    styleUrl: './airtools.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AirtoolsComponent {
    protected date = interval(1000).pipe(map(x => new Date().toUTCString()));

    protected generateFlightNumber(
        now: string,
        departure: string,
        destination: string,
        scheduledTakeoff: string,
        routeDistanceNm: string
    ) {
        const date = new Date(scheduledTakeoff + ' GMT');
        return generateFlightNumber(departure, destination, date, routeDistanceNm);
    }

    protected getLocalScheduledForTakeoff(scheduledTakeoff: string, departureTimezone: string) {
        const scheduled = new Date(scheduledTakeoff + ' GMT');
        scheduled.setTime(scheduled.getTime() + Number(departureTimezone) * 60 * 60 * 1000);
        return scheduled.toUTCString().split(' ')[4];
    }

    protected getLocalTime(utc: string | null, timeZone: string) {
        if (!utc) return '';

        const utcDate = new Date(utc);
        if (timeZone != '') {
            const tz = Number(timeZone);
            utcDate.setTime(utcDate.getTime() + tz * 60 * 60 * 1000);
        }

        return utcDate.toUTCString();
    }

    protected getLocalTimeInMinutes(utc: string | null, timeZone: string, ete: string) {
        if (!utc) return '';

        const eteMinutes = Number(ete);
        const localTime = this.getLocalTime(utc, timeZone);
        const time = new Date(localTime);
        time.setTime(time.getTime() + eteMinutes * 60 * 1000);
        return time.toUTCString().split(' ')[4];
    }

    protected getTimeOfDay(date: string) {
        const d = new Date(date);
        if (d.getHours() > 5 && d.getHours() <= 11) {
            return 'morning';
        }

        if (d.getHours() > 11 && d.getHours() <= 17) {
            return 'day';
        }

        if (d.getHours() > 17 && d.getHours() <= 0) {
            return 'evening';
        }

        return 'day';
    }

    protected getFlightTime(ete: string) {
        const minutes = Number(ete);
        const hours = Math.floor(minutes / 60);
        const minutesLeft = minutes % 60;
        let result = '';
        if (hours > 0) {
            result += hours + ` ${hours > 1 ? 'hours' : 'hour'}`;
        }
        if (minutesLeft < 5) return result;
        if (hours === 0) return `${minutesLeft} minutes`;

        return `${result} and ${minutesLeft} minutes`;
    }

    protected getFTemp(cTemp: string) {
        const temp = Number(cTemp);
        return (temp * 9) / 5 + 32;
    }

    protected getAltMeters(feet: string) {
        const ft = Number(feet);
        return Math.ceil((ft * 10) / 3.28) / 10;
    }

    protected getDistanceInMiles(nm: string) {
        const value = Number(nm);
        return Math.ceil(value * 1.15078 * 10) / 10;
    }

    protected getDistanceInKm(nm: string) {
        const value = Number(nm);
        return Math.ceil(value * 1.852 * 10) / 10;
    }

    protected getKmGroundSpeed(groundSpeed: string) {
        return this.getDistanceInKm(groundSpeed);
    }

    protected getMilesGroundSpeed(groundSpeed: string) {
        return this.getDistanceInMiles(groundSpeed);
    }

    protected readonly generate = generate;
}

function generateFlightNumber(
    departure: string,
    destination: string,
    scheduledTakeoff: Date,
    routeDistanceNm: string
): number {
    // Simple string hash function
    const hashString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) % 1000;
        }
        return hash;
    };

    // Hash the route
    const routeHash = (hashString(departure) + hashString(destination)) % 1000;

    // Time component
    const date = new Date(scheduledTakeoff);
    const timeComponent = date.getUTCHours() * 100 + date.getUTCMinutes(); // 0-2359
    console.log(timeComponent);

    // Base flight number
    let baseNumber = (routeHash + timeComponent) % 10000; // 1-9999
    console.log(baseNumber);

    // Decide length based on route distance
    let flightNumber: number;
    if (Number(routeDistanceNm) > 1500) {
        // Long route → 1–2 digits
        flightNumber = (baseNumber % 99) + 1; // 1–99
    } else if (Number(routeDistanceNm) > 500) {
        // Medium route → 3 digits
        flightNumber = (baseNumber % 900) + 100; // 100–999
    } else {
        // Short route → 3–4 digits
        flightNumber = (baseNumber % 9000) + 100; // 100–9199
    }

    return flightNumber;
}
