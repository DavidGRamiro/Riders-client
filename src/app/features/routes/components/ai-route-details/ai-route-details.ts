import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouteTitle } from './route-title/route-title';
import { RouteMap } from './route-map/route-map';
import { RouteAnalytics } from './route-analytics/route-analytics';

@Component({
  selector: 'app-ai-route-details',
  imports: [RouteTitle, RouteMap, RouteAnalytics],
  templateUrl: './ai-route-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiRouteDetails {}
