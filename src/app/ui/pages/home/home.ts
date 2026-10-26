import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Navbar } from '../../components';

@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
