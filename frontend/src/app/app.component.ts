import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './theme.service';
import { Set } from './set/set.component';
import { RepType } from './rep/rep.component';
import { SettingsService } from './settings.service';
import { PerformanceComponent } from './performance/performance.component';

@Component({
    selector: 'olab-root',
    imports: [RouterOutlet, PerformanceComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    constructor(
        protected themeService: ThemeService,
        protected settings: SettingsService
    ) {}
}
