import { Injectable } from '@angular/core';
import confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root',
})
export class Confeti {

  public show(){
    confetti({
      particleCount: 400,
      angle: 90,
      spread: 120,
      origin: {
        x: 0.5,
        y: 1.1,
      },
    });
  }

}
