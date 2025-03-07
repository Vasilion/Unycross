// src/app/services/cyberpunk-background.service.ts
import { Injectable } from '@angular/core';
import { CyberpunkBackground } from '../utils/cyberpunk-bg';

@Injectable({
  providedIn: 'root',
})
export class CyberpunkBackgroundService {
  private background: CyberpunkBackground | null = null;

  initBackground(container: HTMLElement) {
    this.background = new CyberpunkBackground(container);
  }
}
