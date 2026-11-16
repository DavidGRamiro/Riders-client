import { Component, } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { SplashOverlay } from './ui/components';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToasterImports, SplashOverlay],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
