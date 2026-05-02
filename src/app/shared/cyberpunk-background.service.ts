import { Injectable } from '@angular/core';
import { CyberpunkBackground } from '../utils/cyberpunk-bg';

@Injectable({
  providedIn: 'root',
})
export class CyberpunkBackgroundService {
  private background: CyberpunkBackground | null = null;
  private container: HTMLElement | null = null;

  /** Bind a host container; the service will mount/unmount the canvas inside it. */
  attach(container: HTMLElement): void {
    this.container = container;
  }

  /** Mount the cyberpunk canvas into the attached container. No-op if already mounted. */
  start(): void {
    if (this.background || !this.container) return;
    this.background = new CyberpunkBackground(this.container);
  }

  /** Tear down the canvas and animation loop. No-op if not mounted. */
  stop(): void {
    if (!this.background) return;
    this.background.dispose();
    this.background = null;
  }

  /** Whether the background is currently mounted. */
  isActive(): boolean {
    return this.background !== null;
  }
}
