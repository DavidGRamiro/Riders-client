import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../components';

@Component({
  selector: 'app-layout',
  imports: [Navbar, RouterOutlet],
  template: `
    <app-navbar />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Layout {}
