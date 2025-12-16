import { H } from '@angular/cdk/keycodes';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './core/header/header';
import { LoadingSpinner } from './components/shared/loading-spinner/loading-spinner';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, LoadingSpinner],
    templateUrl: './app.html',
    styleUrl: './app.scss',
})
export class App {
    protected readonly title = signal("Bob's Woodworks");
}
