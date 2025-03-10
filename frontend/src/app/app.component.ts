import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthComponent } from './framework/auth/auth.component';

@Component({
    selector: 'olab-root',
    imports: [RouterOutlet, AuthComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
