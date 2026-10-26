import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Navbar } from '../../components';
import { UserStore } from '../../../shared';

@Component({
  selector: 'app-home',
  imports: [Navbar],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {}
