import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-bikes',
  imports: [],
  templateUrl: './user-bikes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBikes {}
