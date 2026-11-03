import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmCardImports } from "@spartan-ng/helm/card";
import { HlmButtonImports } from "@spartan-ng/helm/button";
import { lucideSignpost } from '@ng-icons/lucide';

@Component({
  selector: 'app-route-title',
  imports: [NgIcon, HlmCardImports, HlmButtonImports],
  templateUrl: './route-title.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideSignpost })]
})
export class RouteTitle {}
