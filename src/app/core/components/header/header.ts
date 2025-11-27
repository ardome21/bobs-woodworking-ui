import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [ RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  @Input() title: string = '';

}
