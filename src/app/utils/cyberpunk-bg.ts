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

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.stormColor = new THREE.Color('#0066cc');
    this.accentColor = new THREE.Color('#00ccff');
    this.purpleColor = new THREE.Color('#592388');

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

    // Create renderer
    this.renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);

    // Add event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this));

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
    // Create purple acidic rain effect with teardrop shapes
    const rainCount = 3000; // Increased rain count for better coverage
    const rainGeometry = new THREE.BufferGeometry();

    // Use a sprite material with a raindrop texture
    const rainMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 velocity;
        varying float vSize;
        
        void main() {
          vSize = size;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vSize;
        uniform float time;
        
        float drawRaindrop(vec2 uv) {
          // Transform UV to center the raindrop
          vec2 center = vec2(0.5, 0.5);
          vec2 p = uv - center;
          
          // Draw a teardrop shape
          float d = length(p);
          
          // Create a teardrop shape by modifying a circle
          // Make the bottom part elongated
          float teardrop = smoothstep(0.5, 0.4, d + 0.2 * p.y);
          
          return teardrop;
        }
        
        void main() {
          vec2 uv = gl_PointCoord;
          float drop = drawRaindrop(uv);
          
          // Purple color for acid rain effect
          vec3 color = vec3(0.35, 0.14, 0.53); // Purple
          
          // Add some shimmer
          float brightness = 0.6 + 0.4 * sin(time * 2.0 + vSize * 10.0);
          color *= brightness;
          
          // Set the final color with transparency
          gl_FragColor = vec4(color, drop * 0.7);
          
          // Discard pixels outside the raindrop
          if (drop < 0.01) discard;
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const positions = new Float32Array(rainCount * 3);
    const velocities = new Float32Array(rainCount * 3);
    const sizes = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      const i3 = i * 3;
      // Distribute rain across the entire canvas with wider spread
      positions[i3] = (Math.random() - 0.5) * 400; // Doubled width spread
      positions[i3 + 1] = Math.random() * 300 - 50; // Higher start position
      positions[i3 + 2] = Math.random() * 400 - 400; // Wider and deeper depth range

      // Rain falling velocity - much slower
      velocities[i3] = (Math.random() - 0.5) * 0.1; // Reduced sideways drift
      velocities[i3 + 1] = -0.8 - Math.random() * 1.2; // Slower downward speed (60% slower)
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1; // Reduced depth movement

      // Varied droplet sizes
      sizes[i] = Math.random() * 2.5 + 2; // Slightly larger sizes for better visibility
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
      const positions =
        this.particles.mesh.geometry.attributes['position'].array;
      const velocities =
        this.particles.mesh.geometry.attributes['velocity'].array;
      const sizes = this.particles.mesh.geometry.attributes['size'].array;

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
      const positions = this.rain.geometry.attributes['position'].array;
      const velocities = this.rain.geometry.attributes['velocity'].array;

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
        }
      }

      this.rain.geometry.attributes['position'].needsUpdate = true;

      // Update time uniform for rain shader
      if (this.rain.material instanceof THREE.ShaderMaterial) {
        this.rain.material.uniforms['time'].value = elapsedTime;
      }
    }

    // Animate stars
    if (this.stars) {
      this.stars.rotation.z += delta * 0.003; // Even slower rotation

      // Make stars twinkle (less dramatic)
      const sizes = this.stars.geometry.attributes['size'];
      for (let i = 0; i < sizes.count; i++) {
        sizes.array[i] =
          (Math.sin(elapsedTime * 1.5 + i) * 0.3 + 1) * Math.random();
      }
      sizes.needsUpdate = true;
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
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
