import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private loadingMap = new Map<string, boolean>();
    isLoading = signal<boolean>(false);

    setLoading(key: string, loading: boolean): void {
        if (loading) {
            this.loadingMap.set(key, loading);
        } else {
            this.loadingMap.delete(key);
        }
        this.isLoading.set(this.loadingMap.size > 0);
    }

    isLoadingKey(key: string): boolean {
        return this.loadingMap.has(key);
    }
}
