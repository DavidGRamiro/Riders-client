import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMap } from '@ng-icons/lucide';

@Component({
  selector: 'app-user-events-summary',
  imports: [NgIcon],
  templateUrl: './user-events-summary.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideMap,
    }),
  ]
})
export class UserEventsSummary {

   protected readonly events = [
    {
      month: 'OCT',
      day: '26',
      type: 'RITMO ALEGRE / EXPERTO',
      title: 'Kedada Trail Montes Universales',
      location: 'Gasolinera Albarracín',
      time: '08:30 AM',
      riders: ['MR', 'AG'],
      extra: 6,
    },
    {
      month: 'NOV',
      day: '09',
      type: 'TRAIL NOCTURNO · ORIENTACIÓN',
      title: 'Raid Sierras del Silencio 2025',
      location: 'Cuenca Camping Caravaning',
      time: '19:00 PM',
      riders: ['DK', 'SL'],
      extra: 14,
    },
  ];

}
