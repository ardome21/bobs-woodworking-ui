import { H } from '@angular/cdk/keycodes';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header/header';
import { LoadingSpinner } from './components/shared/loading-spinner/loading-spinner';
import { DemoBanner } from './components/shared/demo-banner/demo-banner';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, LoadingSpinner, DemoBanner],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal("Bob's Woodworks");
}
