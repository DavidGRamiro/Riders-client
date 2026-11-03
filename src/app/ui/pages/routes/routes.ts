import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideHistory,
  lucideLayers,
  lucideRoute,
  lucideSparkles,
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmChartImports } from '@spartan-ng/helm/chart';
import { HlmSliderImports } from '@spartan-ng/helm/slider';
import { HlmSwitchImports } from '@spartan-ng/helm/switch';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { AiRoute, AiRouteDetails } from '../../../features';


@Component({
  selector: 'app-routes',
  imports: [
    NgIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmChartImports,
    HlmSliderImports,
    HlmSwitchImports,
    HlmTextareaImports,
    AiRoute,
    AiRouteDetails
],
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
  
  protected selectTab(tabId: string): void {
    this.activeTab.set(tabId);
  }
}
