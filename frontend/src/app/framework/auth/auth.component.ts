import {
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    HostListener,
    ViewChild
} from '@angular/core';
import { initializeGoogleAuth } from '../google-auth';
import { AuthService } from '../auth.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'tyr-auth',
    imports: [],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {
    @ViewChild('authElement') authElement!: ElementRef<HTMLDivElement>;
    @HostListener('window:load')
    async onLoad() {
        initializeGoogleAuth(this.authElement.nativeElement);
    }

    constructor(protected auth: AuthService) {
        effect(() => {
            if (auth.needsAuthSignal()) this.auth.getToken();
        });
    }
}
