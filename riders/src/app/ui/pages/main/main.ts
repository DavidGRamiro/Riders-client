import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Navbar } from '../../components';

@Component({
  selector: 'app-main',
  imports: [Navbar],
  templateUrl: './main.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {}
