import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideHistory,
  lucideLayers,
  lucideRoute,
  lucideSparkles,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { AiRoute, AiRouteDetails, AiUserRoute } from '../../../features';


@Component({
  selector: 'app-routes',
  imports: [NgIcon, HlmButtonImports, AiRoute, AiRouteDetails, AiUserRoute],
  templateUrl: './routes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideIcons({
      lucideLayers,
      lucideSparkles,
      lucideRoute,
      lucideHistory
    }),
  ],
})
export class Routes {

  protected readonly tabs = [
    { id: 'assisted', label: 'Trazada Asistida por IA', icon: 'lucideRoute', count: null },
    { id: 'history', label: 'Historial de Generaciones', icon: 'lucideHistory', count: 14 },
  ] as const;

  protected readonly activeTab = signal<string>('assisted');
  protected  eventNewRoute = signal<boolean>(false)
  
  protected selectTab(tabId: string): void {
    this.activeTab.set(tabId);
    if (tabId === 'history') {
      this.eventNewRoute.set(false);
    }
  }

  public getEmitterNewRoute( event: boolean){
    this.eventNewRoute.set(event)
  }
}
