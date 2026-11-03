import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HlmCardImports } from "@spartan-ng/helm/card";

@Component({
  selector: 'app-route-map',
  imports: [HlmCardImports],
  templateUrl: './route-map.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteMap {}
