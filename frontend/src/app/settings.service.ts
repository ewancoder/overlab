import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SettingsService {
    useLbs = signal(false);
    showRepTypes = signal(false);
    compactView = signal(false);

    toggleUnits() {
        this.useLbs.update(units => !units);
    }

    toggleRepTypes() {
        this.showRepTypes.update(show => !show);
    }

    toggleCompactView() {
        this.compactView.update(compact => !compact);
    }
}
