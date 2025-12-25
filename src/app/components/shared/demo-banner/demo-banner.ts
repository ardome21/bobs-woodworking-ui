import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UIPreferencesService } from '../../../services/ui-preferences.service';

@Component({
    selector: 'app-demo-banner',
    imports: [CommonModule, MatButtonModule, MatIconModule],
    templateUrl: './demo-banner.html',
    styleUrl: './demo-banner.scss',
})
export class DemoBanner {
    protected uiPreferences = inject(UIPreferencesService);

    onDismiss(): void {
        this.uiPreferences.dismissDemoBanner();
    }
}
