import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-update-inventory',
    imports: [RouterModule, MatButtonModule],
    templateUrl: './update-inventory.html',
    styleUrl: './update-inventory.scss',
})
export class UpdateInventory {}
