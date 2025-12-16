import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../services/loading.service';

@Component({
    selector: 'app-loading-spinner',
    imports: [MatProgressSpinnerModule],
    template: `
        @if (loadingService.isLoading()) {
            <div class="loading-overlay">
                <mat-spinner></mat-spinner>
            </div>
        }
    `,
    styles: `
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
    `,
})
export class LoadingSpinner {
    loadingService = inject(LoadingService);
}
