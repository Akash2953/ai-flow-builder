// ThreeGraphManager.ts: High-performance Vanilla Three.js 3D DAG workflow visualizer
// Importers/Callers: src/components/landing/ThreeFlowScene.tsx
// Affected API: ThreeGraphManager (init, resize, setMousePos, updateTheme, triggerEnergyPulse, destroy)
// Data Schema: ThreeNodeData ({ id, label, sublabel, type, position, colorDark, colorLight, description })
// User Instruction: "I want to create landing page for my ai flow project. using three js. plant it using proper agents and skills" + "refereces are here https://getdesign.md/design-md?page=2"

import * as THREE from "three";

export interface ThreeNodeData {
  id: string;
  label: string;
  sublabel: string;
  type: "trigger" | "llm" | "condition" | "transform" | "output";
  position: THREE.Vector3;
  colorDark: string;
  colorLight: string;
  description: string;
}

const GRAPH_NODES: ThreeNodeData[] = [
  {
    id: "trigger-1",
    label: "Trigger",
    sublabel: "Webhook Payload",
    type: "trigger",
    position: new THREE.Vector3(-4.8, 1.8, 0.2),
    colorDark: "#38bdf8",
    colorLight: "#D97706",
    description: "Real-time streaming event ingestion endpoint with sub-5ms latency",
  },
  {
    id: "llm-1",
    label: "LLM Agent",
    sublabel: "Intent Classifier (Claude 3.5)",
    type: "llm",
    position: new THREE.Vector3(-1.6, 2.8, 1.0),
    colorDark: "#c084fc",
    colorLight: "#8B5CF6",
    description: "Zero-shot intent extraction & priority scoring with structured JSON output",
  },
  {
    id: "transform-1",
    label: "Transform",
    sublabel: "Sanitizer & RAG Context",
    type: "transform",
    position: new THREE.Vector3(-1.6, -1.8, -0.8),
    colorDark: "#f59e0b",
    colorLight: "#B45309",
    description: "Mustache template variable injection and vector embeddings lookup",
  },
  {
    id: "condition-1",
    label: "Condition",
    sublabel: "Priority >= 85?",
    type: "condition",
    position: new THREE.Vector3(1.8, 0.4, 0.4),
    colorDark: "#ec4899",
    colorLight: "#BE185D",
    description: "Deterministic JavaScript boolean evaluator branching execution paths",
  },
  {
    id: "output-1",
    label: "Output",
    sublabel: "Dispatch Agent & Webhook",
    type: "output",
    position: new THREE.Vector3(5.2, 1.4, 0.6),
    colorDark: "#10b981",
    colorLight: "#059669",
    description: "Automated ticket resolution, notification push & CRM synchronization",
  },
];

const CONNECTIONS: Array<[number, number]> = [
  [0, 1], // Trigger -> LLM
  [0, 2], // Trigger -> Transform
  [1, 3], // LLM -> Condition
  [2, 3], // Transform -> Condition
  [3, 4], // Condition -> Output
];

export class ThreeGraphManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;
  private isLight: boolean;

  // 3D Objects & Meshes
  private nodeObjects: Array<{
    group: THREE.Group;
    data: ThreeNodeData;
    boxMesh: THREE.Mesh;
    coreMesh: THREE.Mesh;
    wireMesh: THREE.LineSegments;
    glowLight: THREE.PointLight;
    baseScale: number;
    targetScale: number;
  }> = [];

  private edgeTubes: Array<{
    mesh: THREE.Mesh;
    curve: THREE.CubicBezierCurve3;
    material: THREE.MeshStandardMaterial;
  }> = [];

  private streamParticles: THREE.Points | null = null;
  private streamParticleCount = 120;
  private streamProgress: Float32Array = new Float32Array(120);
  private streamSpeeds: Float32Array = new Float32Array(120);
  private streamEdgeIndices: Int32Array = new Int32Array(120);

  private ambientStarfield: THREE.Points | null = null;
  private lights: {
    ambient: THREE.AmbientLight;
    dirLight1: THREE.DirectionalLight;
    dirLight2: THREE.DirectionalLight;
  } | null = null;

  // Interaction & Raycasting
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2(0, 0);
  private targetCameraPos = new THREE.Vector3(0, 0.4, 10.5);
  private currentCameraPos = new THREE.Vector3(0, 0.4, 10.5);
  private hoveredNodeId: string | null = null;
  private onNodeHoverCallback?: (node: ThreeNodeData | null) => void;
  private clock = new THREE.Clock();

  constructor(
    container: HTMLElement,
    isLight: boolean,
    onNodeHover?: (node: ThreeNodeData | null) => void
  ) {
    this.container = container;
    this.isLight = isLight;
    this.onNodeHoverCallback = onNodeHover;

    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(
      this.isLight ? 0xfaf8f5 : 0x080d18,
      0.035
    );

    // 2. Camera Setup
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.copy(this.currentCameraPos);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = this.isLight ? 1.0 : 1.25;
    this.container.appendChild(this.renderer.domElement);

    // 4. Build 3D Entities
    this.setupLighting();
    this.buildStarfield();
    this.buildNodes();
    this.buildEdges();
    this.buildParticleStreams();

    // 5. Start Animation Loop
    this.clock.start();
    this.animate = this.animate.bind(this);
    this.animate();
  }

  private setupLighting() {
    const ambient = new THREE.AmbientLight(
      this.isLight ? 0xffffff : 0x1e293b,
      this.isLight ? 1.6 : 0.8
    );
    this.scene.add(ambient);

    const dirLight1 = new THREE.DirectionalLight(
      this.isLight ? 0xfffaed : 0x38bdf8,
      this.isLight ? 1.8 : 1.4
    );
    dirLight1.position.set(6, 8, 8);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(
      this.isLight ? 0xfef3c7 : 0xa855f7,
      this.isLight ? 1.2 : 1.0
    );
    dirLight2.position.set(-8, -6, -4);
    this.scene.add(dirLight2);

    this.lights = { ambient, dirLight1, dirLight2 };
  }

  private buildStarfield() {
    const count = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const color1 = new THREE.Color(this.isLight ? "#D97706" : "#38bdf8");
    const color2 = new THREE.Color(this.isLight ? "#059669" : "#c084fc");

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16 - 2;

      const mixed = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: this.isLight ? 0.07 : 0.09,
      vertexColors: true,
      transparent: true,
      opacity: this.isLight ? 0.35 : 0.6,
      blending: this.isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    this.ambientStarfield = new THREE.Points(geometry, material);
    this.scene.add(this.ambientStarfield);
  }

  private createNodeBadgeTexture(
    title: string,
    subtitle: string,
    accentColor: string,
    isLight: boolean
  ): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // Card background
    ctx.fillStyle = isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(15, 23, 42, 0.92)";
    ctx.beginPath();
    ctx.roundRect(8, 8, 496, 240, 24);
    ctx.fill();

    // Border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.stroke();

    // Accent Pill badge
    ctx.fillStyle = accentColor;
    ctx.beginPath();
    ctx.roundRect(36, 36, 120, 36, 18);
    ctx.fill();

    ctx.fillStyle = isLight ? "#ffffff" : "#0f172a";
    ctx.font = "bold 20px Inter, system-ui, sans-serif";
    ctx.fillText(title.toUpperCase(), 52, 61);

    // Subtitle text
    ctx.fillStyle = isLight ? "#2C2724" : "#f8fafc";
    ctx.font = "bold 32px Inter, system-ui, sans-serif";
    ctx.fillText(subtitle, 36, 130);

    // Status indicator dot
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(48, 190, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isLight ? "#7A7269" : "#94a3b8";
    ctx.font = "500 22px 'JetBrains Mono', monospace";
    ctx.fillText("READY • 2.4ms", 68, 196);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }

  private buildNodes() {
    GRAPH_NODES.forEach((nodeData) => {
      const group = new THREE.Group();
      group.position.copy(nodeData.position);

      const accentHex = this.isLight ? nodeData.colorLight : nodeData.colorDark;

      // 1. Outer Rounded Card Mesh
      const boxGeo = new THREE.BoxGeometry(2.4, 1.2, 0.25);
      const texture = this.createNodeBadgeTexture(
        nodeData.label,
        nodeData.sublabel,
        accentHex,
        this.isLight
      );

      const materials = [
        new THREE.MeshStandardMaterial({
          color: this.isLight ? 0xffffff : 0x0f172a,
          roughness: 0.2,
          metalness: 0.1,
        }),
        new THREE.MeshStandardMaterial({
          color: this.isLight ? 0xffffff : 0x0f172a,
          roughness: 0.2,
          metalness: 0.1,
        }),
        new THREE.MeshStandardMaterial({
          color: this.isLight ? 0xffffff : 0x0f172a,
          roughness: 0.2,
          metalness: 0.1,
        }),
        new THREE.MeshStandardMaterial({
          color: this.isLight ? 0xffffff : 0x0f172a,
          roughness: 0.2,
          metalness: 0.1,
        }),
        new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.1,
          metalness: 0.2,
        }), // Front facing
        new THREE.MeshStandardMaterial({
          color: this.isLight ? 0xffffff : 0x0f172a,
          roughness: 0.2,
          metalness: 0.1,
        }), // Back
      ];

      const boxMesh = new THREE.Mesh(boxGeo, materials);
      boxMesh.userData = { nodeId: nodeData.id, data: nodeData };
      group.add(boxMesh);

      // 2. Glowing Core Sphere behind node
      const coreGeo = new THREE.SphereGeometry(0.24, 24, 24);
      const coreMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(accentHex),
        emissive: new THREE.Color(accentHex),
        emissiveIntensity: this.isLight ? 0.6 : 1.4,
        roughness: 0.1,
        metalness: 0.8,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.set(-1.0, 0.45, 0.15);
      group.add(coreMesh);

      // 3. Neon Outline Wireframe
      const edgesGeo = new THREE.EdgesGeometry(boxGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(accentHex),
        transparent: true,
        opacity: this.isLight ? 0.6 : 0.85,
        linewidth: 2,
      });
      const wireMesh = new THREE.LineSegments(edgesGeo, wireMat);
      group.add(wireMesh);

      // 4. Subtle Point Light for volumetric illumination
      const glowLight = new THREE.PointLight(
        new THREE.Color(accentHex),
        this.isLight ? 1.0 : 2.0,
        3.5
      );
      glowLight.position.set(0, 0, 0.8);
      group.add(glowLight);

      this.scene.add(group);

      this.nodeObjects.push({
        group,
        data: nodeData,
        boxMesh,
        coreMesh,
        wireMesh,
        glowLight,
        baseScale: 1.0,
        targetScale: 1.0,
      });
    });
  }

  private buildEdges() {
    CONNECTIONS.forEach(([fromIdx, toIdx]) => {
      const fromNode = GRAPH_NODES[fromIdx];
      const toNode = GRAPH_NODES[toIdx];

      const start = fromNode.position.clone().add(new THREE.Vector3(1.2, 0, 0));
      const end = toNode.position.clone().add(new THREE.Vector3(-1.2, 0, 0));

      const dx = (end.x - start.x) * 0.55;
      const ctrl1 = new THREE.Vector3(start.x + dx, start.y, start.z);
      const ctrl2 = new THREE.Vector3(end.x - dx, end.y, end.z);

      const curve = new THREE.CubicBezierCurve3(start, ctrl1, ctrl2, end);
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 0.035, 8, false);

      const accent = this.isLight
        ? toNode.colorLight
        : toNode.colorDark;

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(accent),
        emissive: new THREE.Color(accent),
        emissiveIntensity: this.isLight ? 0.3 : 0.7,
        roughness: 0.3,
        metalness: 0.4,
        transparent: true,
        opacity: this.isLight ? 0.65 : 0.8,
      });

      const mesh = new THREE.Mesh(tubeGeo, material);
      this.scene.add(mesh);

      this.edgeTubes.push({ mesh, curve, material });
    });
  }

  private buildParticleStreams() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.streamParticleCount * 3);
    const colors = new Float32Array(this.streamParticleCount * 3);

    for (let i = 0; i < this.streamParticleCount; i++) {
      const edgeIndex = i % this.edgeTubes.length;
      this.streamEdgeIndices[i] = edgeIndex;
      this.streamProgress[i] = Math.random();
      this.streamSpeeds[i] = 0.15 + Math.random() * 0.25;

      const curve = this.edgeTubes[edgeIndex].curve;
      const pt = curve.getPoint(this.streamProgress[i]);

      positions[i * 3] = pt.x;
      positions[i * 3 + 1] = pt.y;
      positions[i * 3 + 2] = pt.z;

      const nodeColor = new THREE.Color(
        this.isLight ? "#D97706" : "#38bdf8"
      );
      colors[i * 3] = nodeColor.r;
      colors[i * 3 + 1] = nodeColor.g;
      colors[i * 3 + 2] = nodeColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: this.isLight ? 0.14 : 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: this.isLight ? THREE.NormalBlending : THREE.AdditiveBlending,
    });

    this.streamParticles = new THREE.Points(geometry, material);
    this.scene.add(this.streamParticles);
  }

  public setMousePos(x: number, y: number) {
    this.mouse.x = x;
    this.mouse.y = y;

    // Smooth camera tilt
    this.targetCameraPos.x = x * 1.8;
    this.targetCameraPos.y = 0.4 + y * 1.2;
  }

  public triggerEnergyPulse() {
    // Accelerate particles momentarily
    for (let i = 0; i < this.streamParticleCount; i++) {
      this.streamSpeeds[i] += 0.4;
    }
  }

  public updateTheme(isLight: boolean) {
    this.isLight = isLight;
    this.scene.fog = new THREE.FogExp2(
      this.isLight ? 0xfaf8f5 : 0x080d18,
      0.035
    );

    if (this.lights) {
      this.lights.ambient.color.set(this.isLight ? 0xffffff : 0x1e293b);
      this.lights.ambient.intensity = this.isLight ? 1.6 : 0.8;
      this.lights.dirLight1.color.set(this.isLight ? 0xfffaed : 0x38bdf8);
      this.lights.dirLight2.color.set(this.isLight ? 0xfef3c7 : 0xa855f7);
    }

    this.renderer.toneMappingExposure = this.isLight ? 1.0 : 1.25;

    // Update nodes & edges
    this.nodeObjects.forEach((node) => {
      const accent = this.isLight
        ? node.data.colorLight
        : node.data.colorDark;
      (node.coreMesh.material as THREE.MeshStandardMaterial).color.set(accent);
      (node.coreMesh.material as THREE.MeshStandardMaterial).emissive.set(accent);
      (node.wireMesh.material as THREE.LineBasicMaterial).color.set(accent);
      node.glowLight.color.set(accent);
    });

    this.edgeTubes.forEach((edge, idx) => {
      const toNode = GRAPH_NODES[CONNECTIONS[idx][1]];
      const accent = this.isLight ? toNode.colorLight : toNode.colorDark;
      edge.material.color.set(accent);
      edge.material.emissive.set(accent);
    });
  }

  public resize(width: number, height: number) {
    if (!this.renderer || !this.camera) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Smooth Camera Damping
    this.currentCameraPos.lerp(this.targetCameraPos, 0.05);
    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(0, 0.4, 0);

    // 2. Ambient Floating Node Motion & Hover Scaling
    this.nodeObjects.forEach((node, i) => {
      // Floating sinusoidal motion
      const floatOffset = Math.sin(elapsedTime * 1.5 + i * 1.2) * 0.08;
      node.group.position.y = node.data.position.y + floatOffset;

      // Smooth scale interpolation
      node.baseScale = THREE.MathUtils.lerp(
        node.baseScale,
        node.targetScale,
        0.15
      );
      node.group.scale.setScalar(node.baseScale);

      // Core rotation
      node.coreMesh.rotation.y += 0.02;
    });

    // 3. Ambient Starfield Rotation
    if (this.ambientStarfield) {
      this.ambientStarfield.rotation.y = elapsedTime * 0.02;
      this.ambientStarfield.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;
    }

    // 4. Update Particle Streams
    if (this.streamParticles && this.edgeTubes.length > 0) {
      const positions = (
        this.streamParticles.geometry.attributes.position as THREE.BufferAttribute
      ).array as Float32Array;

      for (let i = 0; i < this.streamParticleCount; i++) {
        const edgeIdx = this.streamEdgeIndices[i];
        const curve = this.edgeTubes[edgeIdx].curve;

        this.streamProgress[i] += this.streamSpeeds[i] * delta;
        if (this.streamProgress[i] > 1.0) {
          this.streamProgress[i] = 0.0;
          // Normal decay back to base speed
          this.streamSpeeds[i] = 0.15 + Math.random() * 0.25;
        }

        const pt = curve.getPoint(this.streamProgress[i]);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;
      }

      this.streamParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 5. Raycasting for Mouse Hover
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactiveMeshes = this.nodeObjects.map((n) => n.boxMesh);
    const intersects = this.raycaster.intersectObjects(interactiveMeshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const hitNode = this.nodeObjects.find((n) => n.boxMesh === hitMesh);

      if (hitNode) {
        if (this.hoveredNodeId !== hitNode.data.id) {
          this.hoveredNodeId = hitNode.data.id;
          this.onNodeHoverCallback?.(hitNode.data);
          this.container.style.cursor = "pointer";
        }
        hitNode.targetScale = 1.15;
      }
    } else {
      if (this.hoveredNodeId !== null) {
        this.hoveredNodeId = null;
        this.onNodeHoverCallback?.(null);
        this.container.style.cursor = "default";
      }
      this.nodeObjects.forEach((n) => (n.targetScale = 1.0));
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Traverse and dispose geometries and materials
    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.LineSegments) {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      }
    });

    if (this.renderer && this.renderer.domElement) {
      if (this.renderer.domElement.parentElement) {
        this.renderer.domElement.parentElement.removeChild(
          this.renderer.domElement
        );
      }
      this.renderer.dispose();
    }
  }
}
