import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UIPreferencesService {
    private readonly DEMO_BANNER_KEY = 'bw3_demo_banner_session_dismissed';

    // Using signal for reactive state management
    private _isDemoBannerDismissed = signal<boolean>(this.loadSessionDismissal());

    /**
     * Check if demo banner was dismissed in current session
     */
    private loadSessionDismissal(): boolean {
        try {
            // Check sessionStorage (resets on new tab/window)
            return sessionStorage.getItem(this.DEMO_BANNER_KEY) === 'true';
        } catch (error) {
            console.error('Error loading demo banner state:', error);
            return false;
        }
    }

    /**
     * Dismiss the demo banner for the current session
     */
    dismissDemoBanner(): void {
        try {
            sessionStorage.setItem(this.DEMO_BANNER_KEY, 'true');
            this._isDemoBannerDismissed.set(true);
        } catch (error) {
            console.error('Error saving demo banner preference:', error);
        }
    }

    /**
     * Get the demo banner dismissal state as a signal
     */
    get isDemoBannerDismissed() {
        return this._isDemoBannerDismissed.asReadonly();
    }

    /**
     * Reset the demo banner state (for testing)
     */
    resetDemoBanner(): void {
        try {
            sessionStorage.removeItem(this.DEMO_BANNER_KEY);
            this._isDemoBannerDismissed.set(false);
        } catch (error) {
            console.error('Error resetting demo banner:', error);
        }
    }
}
