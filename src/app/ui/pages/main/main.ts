import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Navbar } from '../../components';
import { UserStore } from '../../../shared';

@Component({
  selector: 'app-main',
  imports: [Navbar],
  templateUrl: './main.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Main {}
