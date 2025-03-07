import * as THREE from 'three';

export class CyberpunkBackground {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private container: HTMLElement;
  private points: THREE.Points;
  private lines: THREE.LineSegments;
  private animationFrame: number;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private targetMouseX: number = 0;
  private targetMouseY: number = 0;
  private pointColors: Float32Array;
  private time: number = 0;
  private isMobile: boolean = false;
  private originalWidth: number;
  private originalHeight: number;

  // Configuration - using only purple and cyan colors
  private readonly MAIN_COLOR = 0xab47bc; // Main purple color (#ab47bc)
  private readonly ACCENT_COLOR = 0x00ffff; // Cyberpunk cyan accent (#00ffff)
  private readonly LINE_COLOR = 0xce93d8; // Light purple for lines
  private readonly BACKGROUND_COLOR = 0x000000; // Deep black background
  private readonly POINT_SIZE = 3.5;
  private readonly POINT_COUNT = 150;
  private readonly MOBILE_POINT_COUNT = 100; // Fewer points on mobile
  private readonly LINE_OPACITY = 0.7;
  private readonly LINE_WIDTH = 1;
  private readonly MAX_DISTANCE = 70;
  private readonly MOBILE_MAX_DISTANCE = 90; // Adjusted for mobile
  private readonly DEPTH = 200;
  private readonly MOUSE_MOVE_FACTOR = 0.02;
  private readonly MAX_CONNECTIONS_PER_NODE = 6;
  private readonly MOBILE_MAX_CONNECTIONS_PER_NODE = 4; // Fewer connections on mobile
  private readonly DISTRIBUTION_FACTOR = 0.45;
  private readonly PULSE_SPEED = 0.001;
  private readonly GLOW_INTENSITY = 0.6;

  // Reference dimensions for consistent scaling
  private readonly REFERENCE_WIDTH = 1920;
  private readonly REFERENCE_HEIGHT = 1080;

  private lastScrollY: number = 0;
  private scrollTimeout: number | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();

    // Store original dimensions
    this.originalWidth = window.innerWidth;
    this.originalHeight = window.innerHeight;

    // Detect if on mobile
    this.isMobile = this.checkIfMobile();

    // Store initial scroll position
    this.lastScrollY = window.scrollY;

    // Add fog for depth and cyberpunk feel
    this.scene.fog = new THREE.FogExp2(0x000000, 0.002);

    // Setup camera with wider field of view for cinematic effect
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      5000
    );

    // Setup renderer with appropriate sizing
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.BACKGROUND_COLOR);

    // Make renderer canvas fixed and full-screen
    if (this.isMobile) {
      this.applyFixedCanvas();
    }

    this.container.appendChild(this.renderer.domElement);

    this.initScene();
    this.setupEvents();
    this.animate();
  }

  private checkIfMobile(): boolean {
    return window.innerWidth < 768;
  }

  // Get scaled value to maintain desktop-like proportions on mobile
  private getScaledValue(value: number): number {
    if (!this.isMobile) return value;

    // Use a fixed reference size rather than actual window dimensions
    // This ensures mobile gets the "desktop experience" just scaled down
    const scaleFactor = Math.min(
      this.REFERENCE_WIDTH / this.REFERENCE_HEIGHT,
      window.innerWidth / window.innerHeight
    );

    return value * scaleFactor;
  }

  private initScene(): void {
    // Position the camera for better perspective
    this.camera.position.z = this.DEPTH;

    // Adjust camera field of view to maintain the same look on mobile
    if (this.isMobile) {
      // Use a wider FOV on mobile to simulate being further back
      this.camera.fov = 85;
      this.camera.updateProjectionMatrix();
    }

    // Create points (nodes) with color attribute for animation
    const pointGeometry = new THREE.BufferGeometry();
    const actualPointCount = this.isMobile
      ? this.MOBILE_POINT_COUNT
      : this.POINT_COUNT;
    const pointPositions = new Float32Array(actualPointCount * 3);
    this.pointColors = new Float32Array(actualPointCount * 3);

    // Calculate distribution space - use reference size for consistency
    const spaceWidth = this.REFERENCE_WIDTH * this.DISTRIBUTION_FACTOR;
    const spaceHeight = this.REFERENCE_HEIGHT * this.DISTRIBUTION_FACTOR;
    const spaceDepth = this.DEPTH * 0.3;

    // Distribute points in 3D space
    for (let i = 0; i < actualPointCount; i++) {
      const i3 = i * 3;

      // Strategic distribution using fixed reference values for consistent look
      pointPositions[i3] = (Math.random() - 0.5) * spaceWidth;
      pointPositions[i3 + 1] = (Math.random() - 0.5) * spaceHeight;
      pointPositions[i3 + 2] = (Math.random() - 0.5) * spaceDepth;

      // Initialize all points with the main purple color
      const color = new THREE.Color(this.MAIN_COLOR);
      this.pointColors[i3] = color.r;
      this.pointColors[i3 + 1] = color.g;
      this.pointColors[i3 + 2] = color.b;
    }

    pointGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(pointPositions, 3)
    );

    pointGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.pointColors, 3)
    );

    // Create circular points with vertex colors for cyberpunk glow
    const pointMaterial = new THREE.PointsMaterial({
      size: this.isMobile
        ? this.getScaledValue(this.POINT_SIZE)
        : this.POINT_SIZE,
      vertexColors: true, // Use vertex colors
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      map: this.createGlowTexture(), // Use glow texture instead of plain circle
      blending: THREE.AdditiveBlending, // Add cyberpunk glow effect
      depthTest: false, // Make sure glow is visible
      alphaTest: 0.1,
    });

    this.points = new THREE.Points(pointGeometry, pointMaterial);
    this.scene.add(this.points);

    // Create glowing cyberpunk lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: this.LINE_COLOR,
      transparent: true,
      opacity: this.LINE_OPACITY,
      linewidth: this.LINE_WIDTH,
      blending: THREE.AdditiveBlending, // Enhance glow
      fog: true, // Lines are affected by fog
    });

    this.lines = new THREE.LineSegments(
      new THREE.BufferGeometry(),
      lineMaterial
    );
    this.scene.add(this.lines);

    // Initial line update
    this.updateLines();
  }

  // Create a glow texture for points
  private createGlowTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;

    const context = canvas.getContext('2d');
    if (context) {
      // Create radial gradient for glow effect - using white for base glow
      // The actual color will come from the vertex colors
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
    }

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private updateLines(): void {
    const positions = this.points.geometry.attributes['position'].array;
    const linePositions: number[] = [];
    const actualPointCount = this.isMobile
      ? this.MOBILE_POINT_COUNT
      : this.POINT_COUNT;
    const maxDistance = this.isMobile
      ? this.MOBILE_MAX_DISTANCE
      : this.MAX_DISTANCE;
    const maxConnectionsPerNode = this.isMobile
      ? this.MOBILE_MAX_CONNECTIONS_PER_NODE
      : this.MAX_CONNECTIONS_PER_NODE;

    // Interface for node connections
    interface NodeConnection {
      index: number;
      distance: number;
    }

    // Store all node connections
    const allConnections: { [index: number]: NodeConnection[] } = {};

    // First pass: calculate all distances between nodes
    for (let i = 0; i < actualPointCount; i++) {
      const i3 = i * 3;
      const x1 = positions[i3];
      const y1 = positions[i3 + 1];
      const z1 = positions[i3 + 2];

      allConnections[i] = [];

      for (let j = 0; j < actualPointCount; j++) {
        if (i === j) continue; // Skip self

        const j3 = j * 3;
        const x2 = positions[j3];
        const y2 = positions[j3 + 1];
        const z2 = positions[j3 + 2];

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Only consider connections within MAX_DISTANCE
        if (distance < maxDistance) {
          allConnections[i].push({
            index: j,
            distance: distance,
          });
        }
      }

      // Sort connections by distance (closest first)
      allConnections[i].sort((a, b) => a.distance - b.distance);
    }

    // Second pass: create connections
    const processedConnections = new Set<string>();

    for (let i = 0; i < actualPointCount; i++) {
      const i3 = i * 3;
      const x1 = positions[i3];
      const y1 = positions[i3 + 1];
      const z1 = positions[i3 + 2];

      // Get the closest nodes
      const connections = allConnections[i];
      let connectionsAdded = 0;

      // Add connections to the closest nodes
      for (const connection of connections) {
        if (connectionsAdded >= maxConnectionsPerNode) break;

        const j = connection.index;
        // Create a unique key for this connection (using the smaller index first)
        const connectionKey = i < j ? `${i}-${j}` : `${j}-${i}`;

        // Check if we've already processed this connection
        if (!processedConnections.has(connectionKey)) {
          const j3 = j * 3;

          // Add the line points
          linePositions.push(x1, y1, z1);
          linePositions.push(
            positions[j3],
            positions[j3 + 1],
            positions[j3 + 2]
          );

          processedConnections.add(connectionKey);
          connectionsAdded++;
        }
      }

      // Ensure every node has at least one connection
      if (connectionsAdded === 0 && connections.length > 0) {
        const j = connections[0].index;
        const j3 = j * 3;

        linePositions.push(x1, y1, z1);
        linePositions.push(positions[j3], positions[j3 + 1], positions[j3 + 2]);
      }
    }

    // Update the line geometry
    this.lines.geometry.dispose();
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    this.lines.geometry = lineGeometry;
  }

  private animate = (): void => {
    this.animationFrame = requestAnimationFrame(this.animate);
    this.time += this.PULSE_SPEED;

    // Smooth mouse movement
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Reduce mouse effect on mobile for less chaotic movement
    const mouseFactor = this.isMobile ? 0.1 : 0.2;

    // Rotate scene based on mouse position
    this.scene.rotation.x = this.mouseY * mouseFactor;
    this.scene.rotation.y = this.mouseX * mouseFactor;

    const positions = this.points.geometry.attributes['position'].array;
    const colors = this.points.geometry.attributes['color'].array;
    const actualPointCount = this.isMobile
      ? this.MOBILE_POINT_COUNT
      : this.POINT_COUNT;

    // Cyberpunk color cycling using only purple and cyan
    for (let i = 0; i < actualPointCount; i++) {
      const i3 = i * 3;

      // Scale movement based on device to keep animation consistent
      const movementScale = this.isMobile ? 0.05 : 0.1;

      // Subtle sine wave movement
      positions[i3] += Math.sin(this.time * 10 + i * 0.1) * movementScale;
      positions[i3 + 1] += Math.cos(this.time * 8 + i * 0.1) * movementScale;
      positions[i3 + 2] += Math.cos(this.time * 9 + i * 0.1) * movementScale;

      // Keep points within bounds - using reference dimensions for consistency
      const boundX = this.REFERENCE_WIDTH * this.DISTRIBUTION_FACTOR;
      const boundY = this.REFERENCE_HEIGHT * this.DISTRIBUTION_FACTOR;
      const boundZ = this.DEPTH * 0.25;

      if (Math.abs(positions[i3]) > boundX) {
        positions[i3] = Math.sign(positions[i3]) * boundX;
      }
      if (Math.abs(positions[i3 + 1]) > boundY) {
        positions[i3 + 1] = Math.sign(positions[i3 + 1]) * boundY;
      }
      if (Math.abs(positions[i3 + 2]) > boundZ) {
        positions[i3 + 2] = Math.sign(positions[i3 + 2]) * boundZ;
      }

      // Cyberpunk color pulsing - using ONLY purple and cyan
      const pulseVal = Math.sin(this.time * 3 + i * 0.2) * 0.5 + 0.5;

      // Every 7th node gets the accent cyan color
      if (i % 7 === 0) {
        const purpleColor = new THREE.Color(this.MAIN_COLOR);
        const cyanColor = new THREE.Color(this.ACCENT_COLOR);

        // Lerp between purple and cyan
        const mixedColor = purpleColor
          .clone()
          .lerp(cyanColor, pulseVal * this.GLOW_INTENSITY);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      } else {
        // Regular nodes pulse with the main purple color at different brightness
        const color = new THREE.Color(this.MAIN_COLOR);
        const brightness = 0.8 + pulseVal * 0.4; // Pulse brightness

        colors[i3] = color.r * brightness;
        colors[i3 + 1] = color.g * brightness;
        colors[i3 + 2] = color.b * brightness;
      }
    }

    // Update material properties for pulsing effect on lines
    const linePulse = Math.sin(this.time * 4) * 0.2 + 0.8;
    (this.lines.material as THREE.LineBasicMaterial).opacity =
      this.LINE_OPACITY * linePulse;

    // Line color alternates between purple and lighter purple - no other colors
    if (Math.floor(this.time * 10) % 20 === 0) {
      const lineColor = Math.random() > 0.5 ? this.LINE_COLOR : this.MAIN_COLOR;
      (this.lines.material as THREE.LineBasicMaterial).color.set(lineColor);
    }

    this.points.geometry.attributes['position'].needsUpdate = true;
    this.points.geometry.attributes['color'].needsUpdate = true;

    // Update lines for movement
    this.updateLines();

    // If on mobile, make sure the fixed canvas is still properly positioned
    if (this.isMobile && (this.time * 100) % 30 === 0) {
      this.applyFixedCanvas();
    }

    this.renderer.render(this.scene, this.camera);
  };

  // Helper method to ensure canvas is fixed and covers the entire screen
  private applyFixedCanvas(): void {
    if (!this.renderer || !this.renderer.domElement) return;

    const canvas = this.renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    // Make canvas 20% taller than viewport to account for scroll
    canvas.style.width = '100vw';
    canvas.style.height = '120vh'; // Increase height
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';

    // Force renderer to match this larger size
    this.renderer.setSize(window.innerWidth, window.innerHeight * 1.2);
  }

  private setupEvents(): void {
    // Handle window resize
    window.addEventListener('resize', this.handleResize);

    // Mouse movement tracking
    document.addEventListener('mousemove', this.handleMouseMove);

    // Touch events for mobile
    document.addEventListener('touchmove', this.handleTouchMove, {
      passive: true,
    });

    // Add scroll events with throttling for better performance
    // if (this.isMobile) {
    //   window.addEventListener('scroll', this.handleScroll, { passive: true });
    //   // Also refresh after any momentum scrolling has stopped
    //   window.addEventListener('touchend', this.handleTouchEnd, {
    //     passive: true,
    //   });
    // }

    // Add visibility change handler to fix canvas when returning to tab
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleTouchEnd = (): void => {
    if (!this.isMobile) return;

    // Apply fixed canvas immediately
    this.applyFixedCanvas();

    // And also after a delay to handle momentum scrolling
    setTimeout(() => {
      this.applyFixedCanvas();
      this.renderer.render(this.scene, this.camera);
    }, 500);
  };

  // Handle visibility changes (switching tabs, etc.)
  private handleVisibilityChange = (): void => {
    if (document.visibilityState === 'visible' && this.isMobile) {
      // When returning to the tab, ensure canvas is properly fixed
      this.applyFixedCanvas();
      this.renderer.render(this.scene, this.camera);
    }
  };

  private handleResize = (): void => {
    // Check if device type has changed
    const wasMobile = this.isMobile;
    this.isMobile = this.checkIfMobile();

    // If device type changed (e.g. rotation), reinitialize scene
    if (wasMobile !== this.isMobile) {
      // Clean up old scene
      this.scene.remove(this.points);
      this.scene.remove(this.lines);
      this.points.geometry.dispose();
      (this.points.material as THREE.PointsMaterial).dispose();
      this.lines.geometry.dispose();
      (this.lines.material as THREE.LineBasicMaterial).dispose();

      // Reinitialize with new settings
      this.initScene();
    }

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    // Apply fixed canvas for mobile
    if (this.isMobile) {
      this.applyFixedCanvas();
    } else {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };

  private handleMouseMove = (event: MouseEvent): void => {
    // Convert mouse position to normalized coordinates (-1 to 1)
    this.targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    this.targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  };

  private handleTouchMove = (event: TouchEvent): void => {
    if (event.touches.length > 0) {
      // Convert touch position to normalized coordinates (-1 to 1)
      this.targetMouseX =
        (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      this.targetMouseY =
        -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
    }
  };

  private handleScroll = (): void => {
    if (!this.isMobile) return;

    // Apply fixed canvas positioning
    this.applyFixedCanvas();

    // Force render after scroll
    this.renderer.render(this.scene, this.camera);

    // Clear any existing timeout
    if (this.scrollTimeout !== null) {
      window.clearTimeout(this.scrollTimeout);
    }

    // Set a new timeout to ensure canvas is fixed after scrolling stops
    this.scrollTimeout = window.setTimeout(() => {
      // Double-check the canvas position and size after scrolling stops
      this.applyFixedCanvas();
      this.renderer.render(this.scene, this.camera);
    }, 100);
  };

  // Public methods for external control
  public dispose(): void {
    cancelAnimationFrame(this.animationFrame);

    // Clear timeout if any
    if (this.scrollTimeout !== null) {
      window.clearTimeout(this.scrollTimeout);
    }

    // Cleanup event listeners
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchmove', this.handleTouchMove);
    // window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange
    );

    // Dispose of THREE.js objects
    this.points.geometry.dispose();
    (this.points.material as THREE.PointsMaterial).dispose();
    this.lines.geometry.dispose();
    (this.lines.material as THREE.LineBasicMaterial).dispose();

    // Remove from DOM
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }

    this.renderer.dispose();
  }
}
