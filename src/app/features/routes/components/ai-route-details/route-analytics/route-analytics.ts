import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { lucideBookmark, lucideMap, lucideRefreshCw } from '@ng-icons/lucide';

@Component({
  selector: 'app-route-analytics',
  imports: [NgIcon,HlmCardImports,HlmButtonImports],
  templateUrl: './route-analytics.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({lucideBookmark, lucideRefreshCw, lucideMap})]
})
export class RouteAnalytics {}
