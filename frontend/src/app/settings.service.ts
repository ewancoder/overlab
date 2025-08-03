import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    useLbs = signal(false);

    toggleUnits() {
        this.useLbs.update(units => !units);
    }
}
