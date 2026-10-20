import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HlmNavigationMenuImports } from '@spartan-ng/helm/navigation-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';




@Component({
  selector: 'app-navbar',
  imports: [HlmNavigationMenuImports, HlmButtonImports, NgOptimizedImage],
  templateUrl: './navbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {}
