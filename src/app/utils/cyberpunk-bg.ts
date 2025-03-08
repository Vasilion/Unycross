import * as THREE from 'three';

// Define the types for userData to avoid index signature errors
interface ParticleData {
  timeOffset: number;
  width: number;
  height: number;
  zPos: number;
}

export class CyberpunkBackground {
  private containerId: string;
  private container: HTMLElement;
  private width: number;
  private height: number;
  private stormColor: THREE.Color;
  private accentColor: THREE.Color;
  private purpleColor: THREE.Color;
  private brighterPurpleColor: THREE.Color;

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private particles: {
    mesh: THREE.Points;
    positions: Float32Array;
    velocities: Float32Array;
    sizes: Float32Array;
  };
  private rain: THREE.Points;
  private stars: THREE.Points;
  private clock: THREE.Clock;
  private mouse: THREE.Vector2;
  private particleTexture: THREE.Texture;

  constructor(container?: string | HTMLElement) {
    if (typeof container === 'string') {
      this.containerId = container;
      this.container = document.getElementById(this.containerId) as HTMLElement;
    } else if (container instanceof HTMLElement) {
      this.container = container;
      this.containerId = container.id || 'bgContainer';
    } else {
      this.containerId = 'bgContainer';
      this.container = document.getElementById(this.containerId) as HTMLElement;
    }

    // Get actual viewport dimensions including potential scroll overflow
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.stormColor = new THREE.Color('#0066cc');
    this.accentColor = new THREE.Color('#00ccff');
    this.purpleColor = new THREE.Color('#592388');
    this.brighterPurpleColor = new THREE.Color('#ce93d8'); // Updated rain color

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#000000'); // Pure black background
    this.camera = new THREE.PerspectiveCamera(
      60, // Reduced FOV for less intensity
      this.width / this.height,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.clock = new THREE.Clock();
    this.mouse = new THREE.Vector2();

    // Create a circular particle texture
    this.createParticleTexture();

    this.init();
  }

  private createParticleTexture(): void {
    // Create a canvas to draw the particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');

    if (context) {
      // Draw a white circle with soft edges
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2;

      // Create a radial gradient
      const gradient = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      // Draw the circle
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, Math.PI * 2);
      context.fill();

      // Create texture from canvas
      this.particleTexture = new THREE.CanvasTexture(canvas);
    }
  }

  private init(): void {
    // Create camera
    this.camera.position.z = 50;
    this.camera.position.y = 10;
    this.camera.lookAt(0, 0, 0);

    // Create renderer with oversized canvas to prevent white flashing
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this.renderer.setSize(this.width, this.height);

    // Set renderer to maintain full height with scrolling
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '0';
    this.renderer.domElement.style.left = '0';
    this.renderer.domElement.style.width = '100vw'; // Use viewport units
    this.renderer.domElement.style.height = '100vh'; // Use viewport units
    this.renderer.domElement.style.zIndex = '-1';
    // Expand canvas beyond viewport to handle momentum scrolling
    this.renderer.domElement.style.transform = 'scale(1.2)'; // Scale up to prevent white edges
    this.renderer.domElement.style.transformOrigin = 'center';

    this.container.appendChild(this.renderer.domElement);

    // Add event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));
    window.addEventListener('scroll', this.onWindowScroll.bind(this));

    // Create elements
    this.createStars();
    this.createStormParticles();
    this.createRain();

    // Start animation loop
    this.animate();
  }

  private createStars(): void {
    const starCount = 800; // Reduced star count
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      transparent: true,
      opacity: 0.6, // Reduced opacity
      map: this.particleTexture, // Use the circular texture
    });

    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 2000;
      positions[i3 + 1] = (Math.random() - 0.5) * 1000;
      positions[i3 + 2] = (Math.random() - 0.5) * 2000 - 500;

      sizes[i] = Math.random() * 1.5; // Reduced size variation
    }

    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  private createStormParticles(): void {
    const particleCount = 1000; // Reduced particle count
    const particleGeometry = new THREE.BufferGeometry();

    // Create a custom point material with a storm particle texture using the circular texture
    const particleMaterial = new THREE.PointsMaterial({
      color: this.stormColor,
      size: 0.6, // Smaller particles
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
      map: this.particleTexture, // Use the circular texture
    });

    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Position - create a tunnel effect
      const i3 = i * 3;
      const radius = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = -100 - Math.random() * 500; // Depth of the tunnel

      // Velocity - particles moving toward the camera (MUCH slower)
      velocities[i3] = (Math.random() - 0.5) * 0.05; // Reduced horizontal drift
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.05; // Reduced vertical drift
      velocities[i3 + 2] = 0.3 + Math.random() * 1; // Significantly slower forward speed

      // Size variation
      sizes[i] = Math.random() * 1.5 + 0.3; // Smaller size range

      // Colors - blend between storm color and accent color
      const blend = Math.random();
      colors[i3] = this.stormColor.r * (1 - blend) + this.accentColor.r * blend;
      colors[i3 + 1] =
        this.stormColor.g * (1 - blend) + this.accentColor.g * blend;
      colors[i3 + 2] =
        this.stormColor.b * (1 - blend) + this.accentColor.b * blend;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      'velocity',
      new THREE.BufferAttribute(velocities, 3)
    );
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    this.particles = {
      mesh: new THREE.Points(particleGeometry, particleMaterial),
      positions,
      velocities,
      sizes,
    };

    this.scene.add(this.particles.mesh);
  }

  private createRain(): void {
    // Create purple rain with the same particle style as the storm particles
    const rainCount = 2000; // Reduced rain count (from 3000 to 2000)
    const rainGeometry = new THREE.BufferGeometry();

    // Use the same point material type as the particles, but with purple color
    const rainMaterial = new THREE.PointsMaterial({
      color: this.brighterPurpleColor,
      size: 0.8, // Slightly larger than storm particles
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
      map: this.particleTexture, // Use the same circular texture
    });

    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount * 3);
    const sizes = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      const i3 = i * 3;
      // Distribute rain across the entire canvas with wider spread
      positions[i3] = (Math.random() - 0.5) * 400; // Wide x-spread
      positions[i3 + 1] = Math.random() * 300 - 50; // Higher start position
      positions[i3 + 2] = Math.random() * 400 - 400; // Wider and deeper depth range

      // Rain falling velocity - maintaining slower speed
      velocities[i3] = (Math.random() - 0.5) * 0.1; // Reduced sideways drift
      velocities[i3 + 1] = -0.8 - Math.random() * 1.2; // Downward speed
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1; // Reduced depth movement

      // Size variation - match storm particles but slightly larger
      sizes[i] = Math.random() * 2 + 0.5;
    }

    rainGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    rainGeometry.setAttribute(
      'velocity',
      new THREE.BufferAttribute(velocities, 3)
    );
    rainGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.rain = new THREE.Points(rainGeometry, rainMaterial);
    this.scene.add(this.rain);
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Animate storm particles
    if (this.particles) {
      const positions = this.particles.mesh.geometry.attributes['position']
        .array as Float32Array;
      const velocities = this.particles.mesh.geometry.attributes['velocity']
        .array as Float32Array;
      const sizes = this.particles.mesh.geometry.attributes['size']
        .array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        // Update positions based on velocity (with slower movement)
        positions[i] += velocities[i] * 0.5; // 50% slower horizontal movement
        positions[i + 1] += velocities[i + 1] * 0.5; // 50% slower vertical movement
        positions[i + 2] += velocities[i + 2] * 0.5; // 50% slower forward movement

        // Reset particles that move too close to the camera
        if (positions[i + 2] > 50) {
          // Reset to far away and slightly randomize the position
          const radius = 20 + Math.random() * 30;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;

          positions[i] = radius * Math.sin(phi) * Math.cos(theta);
          positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[i + 2] = -600;

          // Significantly reduce the velocity for slower movement
          velocities[i] = (Math.random() - 0.5) * 0.05; // Further reduced velocity
          velocities[i + 1] = (Math.random() - 0.5) * 0.05; // Further reduced velocity
          velocities[i + 2] = 0.3 + Math.random() * 1; // Much slower forward movement

          // Update size
          const index = i / 3;
          sizes[index] = Math.random() * 1.5 + 0.3; // Smaller size
        }
      }

      this.particles.mesh.geometry.attributes['position'].needsUpdate = true;
      this.particles.mesh.geometry.attributes['size'].needsUpdate = true;

      // Rotate the particle system much slower for a more subtle effect
      this.particles.mesh.rotation.z += delta * 0.01; // Even slower rotation
    }

    // Animate rain
    if (this.rain) {
      const positions = this.rain.geometry.attributes['position']
        .array as Float32Array;
      const velocities = this.rain.geometry.attributes['velocity']
        .array as Float32Array;
      const sizes = this.rain.geometry.attributes['size'].array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        // Update rain drop positions
        positions[i] += velocities[i];
        positions[i + 1] += velocities[i + 1];
        positions[i + 2] += velocities[i + 2];

        // Reset rain drops that fall below the view
        if (positions[i + 1] < -100) {
          positions[i] = (Math.random() - 0.5) * 400; // Wider x-spread
          positions[i + 1] = 150 + Math.random() * 50; // Reset higher
          positions[i + 2] = Math.random() * 400 - 400; // Wider z-spread

          // Vary the falling speed slightly, but keep it slow
          velocities[i + 1] = -0.8 - Math.random() * 1.2; // Slower rain

          // Update sizes for some variation
          const index = i / 3;
          sizes[index] = Math.random() * 2 + 0.5;
        }
      }

      this.rain.geometry.attributes['position'].needsUpdate = true;
      this.rain.geometry.attributes['size'].needsUpdate = true;

      // Make rain shimmer similarly to stars
      const sizesArray = sizes;
      for (let i = 0; i < sizesArray.length; i++) {
        sizesArray[i] =
          (Math.sin(elapsedTime * 1.3 + i) * 0.2 + 1) *
          (Math.random() * 0.5 + 0.75);
      }
    }

    // Animate stars
    if (this.stars) {
      this.stars.rotation.z += delta * 0.003; // Even slower rotation

      // Make stars twinkle (less dramatic)
      const sizes = this.stars.geometry.attributes[
        'size'
      ] as THREE.BufferAttribute;
      const sizesArray = sizes.array as Float32Array;
      for (let i = 0; i < sizes.count; i++) {
        sizesArray[i] =
          (Math.sin(elapsedTime * 1.5 + i) * 0.3 + 1) * Math.random();
      }
      sizes.needsUpdate = true;
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    // Update dimensions and scale
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Set a buffer size slightly larger than the viewport
    const bufferWidth = this.width * 1.2;
    const bufferHeight = this.height * 1.2;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(bufferWidth, bufferHeight);

    // Center the oversized canvas
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.top = '50%';
    this.renderer.domElement.style.left = '50%';
    this.renderer.domElement.style.transform =
      'translate(-50%, -50%) scale(1.2)';
  }

  private onWindowScroll(): void {
    // For mobile scrolling, ensure the canvas is always visible
    // by making sure it stays centered regardless of scroll position
    this.renderer.domElement.style.top = '50%';
    this.renderer.domElement.style.left = '50%';
    this.renderer.domElement.style.transform =
      'translate(-50%, -50%) scale(1.2)';
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / this.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.height) * 2 + 1;

    // Subtle camera movement (reduced)
    this.camera.position.x = this.mouse.x * 3; // Reduced movement
    this.camera.position.y = this.mouse.y * 3 + 10; // Reduced movement
    this.camera.lookAt(0, 0, 0);
  }

  private onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      this.mouse.x = (touch.clientX / this.width) * 2 - 1;
      this.mouse.y = -(touch.clientY / this.height) * 2 + 1;

      // Subtle camera movement (reduced)
      this.camera.position.x = this.mouse.x * 3; // Reduced movement
      this.camera.position.y = this.mouse.y * 3 + 10; // Reduced movement
      this.camera.lookAt(0, 0, 0);
    }
  }
}
