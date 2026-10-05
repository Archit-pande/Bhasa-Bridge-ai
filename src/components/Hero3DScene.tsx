import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  ShieldCheck, 
  Bike, 
  Sparkles, 
  Volume2, 
  FileSearch, 
  AlertTriangle,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

interface Hero3DSceneProps {
  theme?: 'dark' | 'light';
}

interface HotspotInfo {
  id: string;
  title: string;
  category: string;
  description: string;
  statutoryRight: string;
  tagColor: string;
}

export const Hero3DScene: React.FC<Hero3DSceneProps> = ({ theme = 'dark' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(null);
  const [hasWebGLError, setHasWebGLError] = useState<boolean>(false);

  // Hotspots info related to gig workers
  const hotspotsData: Record<string, HotspotInfo> = {
    vehicle: {
      id: 'vehicle',
      title: 'Delivery Two-Wheeler & EV Route Shield',
      category: 'ACCIDENT & SAFETY',
      description: 'Accidental medical coverage must protect gig riders both during active orders and idle transit wait hours.',
      statutoryRight: 'Mandatory ₹2 Lakh accidental cover via e-Shram & Motor Vehicle Aggregator Guidelines 2020.',
      tagColor: 'bg-[#10B981] text-slate-950',
    },
    cargo: {
      id: 'cargo',
      title: 'Delivery Carrier & Earnings Protection',
      category: 'PAYOUT & DEDUCTIONS',
      description: 'Arbitrary deductions for customer cancellations, spills, or bad weather delays are prohibited without itemized proof.',
      statutoryRight: 'Section 73 Indian Contract Act — platform cannot pass customer default losses onto worker pay.',
      tagColor: 'bg-[#FF7700] text-slate-950',
    },
    scanner: {
      id: 'scanner',
      title: 'Real-Time Holographic Contract Scanner',
      category: 'LEGAL & DEACTIVATION',
      description: 'Automated algorithms cannot terminate gig worker accounts with zero-day notice or without human grievance hearing.',
      statutoryRight: 'Mandatory 14-day written notice and appeal opportunity before any permanent ID deactivation.',
      tagColor: 'bg-[#38BDF8] text-slate-950',
    },
    voice: {
      id: 'voice',
      title: 'Bhasha Multilingual Spoken AI',
      category: 'VOICE AI & ACCESSIBILITY',
      description: 'Translates and narrates complex 40-page terms of service into plain spoken Hindi, Bengali, Tamil, Telugu, and more.',
      statutoryRight: 'Constitutional right to informed consent — terms in incomprehensible foreign legalese are non-binding.',
      tagColor: 'bg-[#F59E0B] text-slate-950',
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const isDark = theme === 'dark';

    try {
      scene = new THREE.Scene();

      const width = container.clientWidth || 480;
      const height = container.clientHeight || 420;

      camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
      camera.position.set(0, 1.2, 5.8);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(isDark ? 0x1e293b : 0xe2e8f0, isDark ? 2.0 : 1.6);
      scene.add(ambientLight);

      // Warm headlights / scanner glow
      const headlight = new THREE.SpotLight(0xffaa00, isDark ? 4.5 : 3.0, 12, Math.PI / 4, 0.4);
      headlight.position.set(-1.8, 1.2, 1.8);
      headlight.target.position.set(-3.5, -0.4, 3.0);
      scene.add(headlight);
      scene.add(headlight.target);

      const scannerLight = new THREE.PointLight(0xff7700, isDark ? 4.5 : 3.0, 10);
      scannerLight.position.set(1.2, 1.8, 0.5);
      scene.add(scannerLight);

      const voiceLight = new THREE.PointLight(0x10b981, isDark ? 3.5 : 2.5, 12);
      voiceLight.position.set(-1.0, 2.2, -0.5);
      scene.add(voiceLight);

      const rimLight = new THREE.DirectionalLight(isDark ? 0x38bdf8 : 0x0284c7, 2.0);
      rimLight.position.set(3, 4, 3);
      scene.add(rimLight);

      // Root 3D Project Group
      const projectGroup = new THREE.Group();
      scene.add(projectGroup);

      // ========================================================
      // 1. DYNAMIC URBAN TRANSIT ROAD & ROUTE GRID
      // ========================================================
      const roadGeo = new THREE.PlaneGeometry(8.5, 5.5, 24, 24);
      const roadMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x090e17 : 0xf1f5f9,
        roughness: 0.8,
        metalness: 0.1,
      });
      const roadMesh = new THREE.Mesh(roadGeo, roadMat);
      roadMesh.rotation.x = -Math.PI / 2.2;
      roadMesh.position.set(0, -1.35, 0);
      projectGroup.add(roadMesh);

      // Moving Dashed Lane Markers (Representing delivery transit route)
      const laneGroup = new THREE.Group();
      const laneMat = new THREE.MeshBasicMaterial({
        color: 0xff7700,
        transparent: true,
        opacity: isDark ? 0.7 : 0.5,
      });

      const dashCount = 8;
      const dashes: THREE.Mesh[] = [];
      for (let i = 0; i < dashCount; i++) {
        const dashGeo = new THREE.PlaneGeometry(0.08, 0.6);
        const dash = new THREE.Mesh(dashGeo, laneMat);
        dash.rotation.x = -Math.PI / 2.2;
        dash.position.set(-0.2, -1.33, -2.5 + i * 0.9);
        laneGroup.add(dash);
        dashes.push(dash);
      }
      projectGroup.add(laneGroup);

      // ========================================================
      // 2. THE GIG DELIVERY SCOOTER / TWO-WHEELER (Authentic Worker Asset)
      // ========================================================
      const scooterGroup = new THREE.Group();
      scooterGroup.position.set(-0.7, -0.7, 0.4);
      scooterGroup.rotation.y = Math.PI / 7;
      projectGroup.add(scooterGroup);

      // Materials for Scooter
      const bodyColor = 0xff7700; // Civic high-visibility delivery orange
      const bodyMat = new THREE.MeshStandardMaterial({
        color: bodyColor,
        roughness: 0.25,
        metalness: 0.4,
      });
      const darkChassisMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x1e293b : 0x334155,
        roughness: 0.5,
        metalness: 0.3,
      });
      const chromeMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.1,
        metalness: 0.9,
      });
      const rubberMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.9,
      });

      // A. Front Wheel & Rear Wheel
      const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.14, 24);
      wheelGeo.rotateZ(Math.PI / 2);

      const frontWheel = new THREE.Mesh(wheelGeo, rubberMat);
      frontWheel.position.set(-1.1, -0.15, 0);
      scooterGroup.add(frontWheel);

      const rearWheel = new THREE.Mesh(wheelGeo, rubberMat);
      rearWheel.position.set(0.9, -0.15, 0);
      scooterGroup.add(rearWheel);

      // Metallic Rims & Hubcaps
      const rimGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.15, 16);
      rimGeo.rotateZ(Math.PI / 2);
      const frontRim = new THREE.Mesh(rimGeo, chromeMat);
      frontWheel.add(frontRim);
      const rearRim = new THREE.Mesh(rimGeo, chromeMat);
      rearWheel.add(rearRim);

      // B. Scooter Chassis & Footboard
      const footboardGeo = new THREE.BoxGeometry(1.2, 0.08, 0.44);
      const footboard = new THREE.Mesh(footboardGeo, darkChassisMat);
      footboard.position.set(-0.05, -0.05, 0);
      scooterGroup.add(footboard);

      // C. Front Cowl & Fork
      const cowlGeo = new THREE.BoxGeometry(0.36, 0.8, 0.42);
      const cowl = new THREE.Mesh(cowlGeo, bodyMat);
      cowl.position.set(-0.95, 0.45, 0);
      cowl.rotation.z = -Math.PI / 16;
      scooterGroup.add(cowl);

      // Front Headlight (Emissive glow)
      const headlightGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.06, 16);
      headlightGeo.rotateZ(Math.PI / 2);
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfff0b3 });
      const headlightMesh = new THREE.Mesh(headlightGeo, headlightMat);
      headlightMesh.position.set(-1.14, 0.65, 0);
      scooterGroup.add(headlightMesh);

      // D. Handlebars & Rider Smartphone Mount
      const handlebarStemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12);
      const handlebarStem = new THREE.Mesh(handlebarStemGeo, chromeMat);
      handlebarStem.position.set(-0.9, 0.95, 0);
      scooterGroup.add(handlebarStem);

      const barGeo = new THREE.BoxGeometry(0.05, 0.05, 0.75);
      const handlebarBar = new THREE.Mesh(barGeo, darkChassisMat);
      handlebarBar.position.set(-0.9, 1.2, 0);
      scooterGroup.add(handlebarBar);

      // Rider Smartphone (Displaying Bhasha Bridge app)
      const phoneGeo = new THREE.BoxGeometry(0.18, 0.28, 0.03);
      const phoneMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Glowing active green
      const phoneMesh = new THREE.Mesh(phoneGeo, phoneMat);
      phoneMesh.position.set(-0.9, 1.28, 0);
      phoneMesh.rotation.x = -Math.PI / 6;
      scooterGroup.add(phoneMesh);

      // E. Rider Seat
      const seatGeo = new THREE.BoxGeometry(0.65, 0.12, 0.36);
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.set(0.1, 0.38, 0);
      scooterGroup.add(seat);

      // F. HIGH-VISIBILITY GIG DELIVERY CARGO BOX (Thermal Delivery Box)
      const boxGeo = new THREE.BoxGeometry(0.65, 0.68, 0.58);
      const boxMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x0e1626 : 0x1e293b,
        roughness: 0.3,
        metalness: 0.2,
      });
      const cargoBox = new THREE.Mesh(boxGeo, boxMat);
      cargoBox.position.set(0.85, 0.65, 0);
      scooterGroup.add(cargoBox);

      // Cargo Box Reflective Stripes (Safety warning tape)
      const stripeGeo = new THREE.PlaneGeometry(0.66, 0.08);
      const stripeMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
      const stripe1 = new THREE.Mesh(stripeGeo, stripeMat);
      stripe1.position.set(0, 0.1, 0.295);
      cargoBox.add(stripe1);

      const stripe2 = new THREE.Mesh(stripeGeo, stripeMat);
      stripe2.position.set(0, -0.12, 0.295);
      cargoBox.add(stripe2);

      // Bhasha Civic Emblem on Cargo Box
      const emblemGeo = new THREE.CircleGeometry(0.12, 24);
      const emblemMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
      const emblem = new THREE.Mesh(emblemGeo, emblemMat);
      emblem.position.set(0, 0.0, 0.296);
      cargoBox.add(emblem);

      // ========================================================
      // 3. HOLOGRAPHIC CONTRACT SCANNER (Floating Document Tablet)
      // ========================================================
      const contractGroup = new THREE.Group();
      contractGroup.position.set(1.4, 0.5, 0.3);
      contractGroup.rotation.y = -Math.PI / 9;
      projectGroup.add(contractGroup);

      const docWidth = 1.65;
      const docHeight = 2.3;
      const docGeo = new THREE.BoxGeometry(docWidth, docHeight, 0.04);
      const docMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x0b132b : 0xffffff,
        roughness: 0.2,
        metalness: 0.1,
      });
      const docMesh = new THREE.Mesh(docGeo, docMat);
      contractGroup.add(docMesh);

      // Neon Frame
      const frameGeo = new THREE.BoxGeometry(docWidth + 0.06, docHeight + 0.06, 0.02);
      const frameMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      docMesh.add(frameMesh);

      // Fine-Print Lines on Contract
      const linesGroup = new THREE.Group();
      const regularLineMat = new THREE.MeshBasicMaterial({ color: isDark ? 0x475569 : 0x94a3b8 });
      const trapLineMat = new THREE.MeshBasicMaterial({ color: 0xef4444 }); // Red trap line
      const fairLineMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Green safe line

      for (let i = 0; i < 7; i++) {
        const isTrap = i === 2 || i === 4;
        const isFair = i === 6;
        const lineGeo = new THREE.PlaneGeometry(isTrap ? 1.2 : 0.95 + (i % 2) * 0.2, 0.035);
        const lineMesh = new THREE.Mesh(lineGeo, isTrap ? trapLineMat : isFair ? fairLineMat : regularLineMat);
        lineMesh.position.set(isTrap ? 0 : -0.1, 0.8 - i * 0.24, 0.025);
        linesGroup.add(lineMesh);
      }
      docMesh.add(linesGroup);

      // Sweeping Laser Beam
      const laserBeamGeo = new THREE.CylinderGeometry(0.015, 0.015, docWidth + 0.2, 16);
      laserBeamGeo.rotateZ(Math.PI / 2);
      const laserBeamMat = new THREE.MeshBasicMaterial({ color: 0xff7700 });
      const laserBeam = new THREE.Mesh(laserBeamGeo, laserBeamMat);
      laserBeam.position.z = 0.035;
      docMesh.add(laserBeam);

      // Glowing scan plane
      const glowGeo = new THREE.PlaneGeometry(docWidth + 0.15, 0.28);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xff7700,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      });
      const scannerGlow = new THREE.Mesh(glowGeo, glowMat);
      scannerGlow.position.z = 0.03;
      docMesh.add(scannerGlow);

      // ========================================================
      // 4. AUTHENTIC MULTILINGUAL SPEECH PLAQUES (Canvas Textures)
      // ========================================================
      const createTextBadgeTexture = (text: string, subtext: string, bgColor: string, textColor: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 160;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Pill background
          ctx.fillStyle = bgColor;
          ctx.beginPath();
          ctx.roundRect(10, 10, 492, 140, 24);
          ctx.fill();

          ctx.lineWidth = 6;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();

          // Main text (Local script)
          ctx.fillStyle = textColor;
          ctx.font = 'bold 38px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, 256, 65);

          // Subtext
          ctx.font = 'bold 22px "JetBrains Mono", monospace';
          ctx.fillStyle = '#f8fafc';
          ctx.fillText(subtext, 256, 115);
        }
        return new THREE.CanvasTexture(canvas);
      };

      const badgesGroup = new THREE.Group();
      projectGroup.add(badgesGroup);

      // Badge 1: Hindi (14-day notice protection)
      const textureHi = createTextBadgeTexture('14 दिन का नोटिस अधिकार', 'SECTION 27 LEGAL SHIELD', '#ff7700', '#000000');
      const badgeGeo1 = new THREE.PlaneGeometry(1.4, 0.44);
      const badgeMat1 = new THREE.MeshBasicMaterial({ map: textureHi, transparent: true, side: THREE.DoubleSide });
      const badgeMesh1 = new THREE.Mesh(badgeGeo1, badgeMat1);
      badgeMesh1.position.set(-1.5, 1.8, 0.4);
      badgesGroup.add(badgeMesh1);

      // Badge 2: Bengali (Deduction shield)
      const textureBn = createTextBadgeTexture('বেআইনি জরিমানা সুরক্ষা', 'ZERO ARBITRARY DEDUCTIONS', '#10b981', '#000000');
      const badgeGeo2 = new THREE.PlaneGeometry(1.4, 0.44);
      const badgeMat2 = new THREE.MeshBasicMaterial({ map: textureBn, transparent: true, side: THREE.DoubleSide });
      const badgeMesh2 = new THREE.Mesh(badgeGeo2, badgeMat2);
      badgeMesh2.position.set(1.5, 2.0, 0.8);
      badgesGroup.add(badgeMesh2);

      // Badge 3: Tamil (Rights Protection)
      const textureTa = createTextBadgeTexture('உரிமை பாதுகாப்பு', 'FAIR EARNINGS SHIELD', '#38bdf8', '#000000');
      const badgeGeo3 = new THREE.PlaneGeometry(1.3, 0.42);
      const badgeMat3 = new THREE.MeshBasicMaterial({ map: textureTa, transparent: true, side: THREE.DoubleSide });
      const badgeMesh3 = new THREE.Mesh(badgeGeo3, badgeMat3);
      badgeMesh3.position.set(-0.2, 2.4, -0.4);
      badgesGroup.add(badgeMesh3);

      // ========================================================
      // 5. 3D SPEECH SOUNDWAVE EQUALIZER BARS
      // ========================================================
      const soundwavesGroup = new THREE.Group();
      soundwavesGroup.position.set(-1.0, 1.1, 0.8);
      const waveBarCount = 12;
      const waveBars: THREE.Mesh[] = [];

      for (let i = 0; i < waveBarCount; i++) {
        const barGeo = new THREE.BoxGeometry(0.04, 0.35, 0.04);
        const barMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x10b981,
          emissiveIntensity: 0.6,
        });
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.position.set((i - waveBarCount / 2) * 0.08, 0, 0);
        soundwavesGroup.add(bar);
        waveBars.push(bar);
      }
      projectGroup.add(soundwavesGroup);

      // ========================================================
      // 6. FLOATING PARTICLES (Data Stream)
      // ========================================================
      const particleCount = 40;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 6;
        posArray[i + 1] = (Math.random() - 0.5) * 4;
        posArray[i + 2] = (Math.random() - 0.5) * 3;
      }
      particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.04,
        color: isDark ? 0x38bdf8 : 0x0284c7,
        transparent: true,
        opacity: 0.6,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      projectGroup.add(particles);

      // Mouse Parallax Event
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        mouse.targetX = (clientX / rect.width) * 2 - 1;
        mouse.targetY = -(clientY / rect.height) * 2 + 1;
      };

      window.addEventListener('mousemove', handleMouseMove);

      // Resize Observer
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width: newWidth, height: newHeight } = entry.contentRect;
          if (newWidth > 0 && newHeight > 0 && camera && renderer) {
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
          }
        }
      });
      resizeObserver.observe(container);

      // Animation Loop
      let clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // 1. Moving Lane Dashes (Simulating city delivery transit)
        dashes.forEach((dash) => {
          dash.position.z += 0.035;
          if (dash.position.z > 2.2) {
            dash.position.z = -2.8;
          }
        });

        // 2. Wheels rotation
        frontWheel.rotation.x += 0.08;
        rearWheel.rotation.x += 0.08;

        // 3. Gentle Scooter Suspension suspension bounce
        scooterGroup.position.y = -0.7 + Math.sin(elapsedTime * 6) * 0.015;

        // 4. Contract Scanner Movement
        const scanY = Math.sin(elapsedTime * 2.2) * (docHeight * 0.42);
        laserBeam.position.y = scanY;
        scannerGlow.position.y = scanY;
        scannerLight.position.set(1.4, 0.5 + scanY, 0.8);

        // 5. Speech Soundwave Bars oscillation
        waveBars.forEach((bar, idx) => {
          const h = 0.4 + Math.sin(elapsedTime * 6 + idx * 0.7) * 0.35 + Math.cos(elapsedTime * 4 - idx) * 0.2;
          bar.scale.y = Math.max(0.2, h * 2.5);
        });

        // 6. Floating Regional Badges gentle orbit
        badgeMesh1.position.y = 1.8 + Math.sin(elapsedTime * 2.0) * 0.08;
        badgeMesh1.rotation.z = Math.sin(elapsedTime * 1.5) * 0.03;

        badgeMesh2.position.y = 2.0 + Math.cos(elapsedTime * 2.2) * 0.08;
        badgeMesh2.rotation.z = -Math.sin(elapsedTime * 1.7) * 0.03;

        badgeMesh3.position.y = 2.4 + Math.sin(elapsedTime * 1.8) * 0.07;

        // 7. Parallax camera / project group rotation
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        projectGroup.rotation.y = mouse.x * 0.35;
        projectGroup.rotation.x = -mouse.y * 0.25;

        renderer?.render(scene!, camera!);
      };

      animate();

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        resizeObserver.disconnect();
        cancelAnimationFrame(animationFrameId);

        // Dispose geometries & textures
        roadGeo.dispose();
        roadMat.dispose();
        laneMat.dispose();
        wheelGeo.dispose();
        rimGeo.dispose();
        footboardGeo.dispose();
        cowlGeo.dispose();
        boxGeo.dispose();
        headlightGeo.dispose();
        headlightMat.dispose();
        bodyMat.dispose();
        darkChassisMat.dispose();
        chromeMat.dispose();
        rubberMat.dispose();
        seatMat.dispose();
        docGeo.dispose();
        docMat.dispose();
        frameGeo.dispose();
        frameMat.dispose();
        laserBeamGeo.dispose();
        laserBeamMat.dispose();
        glowGeo.dispose();
        glowMat.dispose();
        badgeGeo1.dispose();
        badgeGeo2.dispose();
        badgeGeo3.dispose();
        textureHi.dispose();
        textureBn.dispose();
        textureTa.dispose();
        particleGeo.dispose();
        particleMat.dispose();

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
          renderer.dispose();
        }
      };
    } catch (err) {
      console.warn('WebGL init error:', err);
      setHasWebGLError(true);
    }
  }, [theme]);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] flex items-center justify-center select-none overflow-hidden rounded-xs border-2 border-slate-300 dark:border-slate-800 bg-[#070C16] dark:bg-[#070C16]">
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      />

      {/* Fallback Graphic if WebGL is disabled */}
      {hasWebGLError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#070C16] p-6 text-center">
          <div className="w-16 h-16 rounded-xs bg-[#FF7700]/20 border-2 border-[#FF7700] text-[#FF7700] flex items-center justify-center mx-auto mb-3">
            <Bike className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-black text-lg text-white">Gig Worker Tech Ecosystem</h4>
          <p className="font-mono text-xs text-slate-400 mt-1 max-w-sm">
            Delivery vehicle shield, real-time holographic contract laser scanner, and 22+ regional language voice wave AI.
          </p>
        </div>
      )}

      {/* Meaningful Top Badges on 3D Viewport */}
      <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 pointer-events-none z-10">
        <span className="font-mono text-[10px] uppercase font-bold text-slate-200 bg-slate-900/90 px-2 py-0.5 rounded-2xs border border-slate-700 shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7700] animate-ping" />
          <span>Gig Delivery Route & Contract Scanner</span>
        </span>
        <span className="font-mono text-[10px] uppercase font-bold text-emerald-300 bg-slate-900/90 px-2 py-0.5 rounded-2xs border border-emerald-800/80 backdrop-blur-xs hidden sm:inline-flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>22+ Language Voice AI</span>
        </span>
      </div>

      {/* Interactive 3D Hotspot Buttons (Related directly to our project) */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-10">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveHotspot(hotspotsData.vehicle)}
            className="px-2.5 py-1 rounded-2xs bg-slate-900/95 hover:bg-slate-800 border border-slate-700 hover:border-[#FF7700] text-slate-200 font-mono text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Bike className="w-3 h-3 text-[#FF7700]" />
            <span>Rider Safety</span>
          </button>

          <button
            onClick={() => setActiveHotspot(hotspotsData.cargo)}
            className="px-2.5 py-1 rounded-2xs bg-slate-900/95 hover:bg-slate-800 border border-slate-700 hover:border-[#10B981] text-slate-200 font-mono text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <ShieldCheck className="w-3 h-3 text-[#10B981]" />
            <span>Payout Shield</span>
          </button>

          <button
            onClick={() => setActiveHotspot(hotspotsData.scanner)}
            className="px-2.5 py-1 rounded-2xs bg-slate-900/95 hover:bg-slate-800 border border-slate-700 hover:border-[#38BDF8] text-slate-200 font-mono text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSearch className="w-3 h-3 text-[#38BDF8]" />
            <span>Laser Scanner</span>
          </button>

          <button
            onClick={() => setActiveHotspot(hotspotsData.voice)}
            className="px-2.5 py-1 rounded-2xs bg-slate-900/95 hover:bg-slate-800 border border-slate-700 hover:border-[#F59E0B] text-slate-200 font-mono text-[10px] font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Volume2 className="w-3 h-3 text-[#F59E0B]" />
            <span>Voice Waves</span>
          </button>
        </div>

        <div className="hidden sm:block text-right pointer-events-none">
          <span className="font-mono text-[9px] text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-2xs border border-slate-800">
            Interactive 3D • Move cursor to inspect
          </span>
        </div>
      </div>

      {/* Meaningful Hotspot Detail Modal / Popover */}
      {activeHotspot && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-30 animate-fadeIn">
          <div className="civic-card p-5 sm:p-6 rounded-xs max-w-md w-full border-2 border-[#FF7700] shadow-[4px_4px_0px_#000] relative bg-[#090E17] text-white">
            <button
              onClick={() => setActiveHotspot(null)}
              className="absolute top-3 right-3 p-1 rounded-2xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2 font-mono text-xs">
              <span className={`px-2 py-0.5 rounded-2xs font-black text-[10px] uppercase ${activeHotspot.tagColor}`}>
                {activeHotspot.category}
              </span>
              <span className="text-slate-400 font-bold">Project Architecture</span>
            </div>

            <h3 className="text-lg font-heading font-black text-white mb-2">
              {activeHotspot.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {activeHotspot.description}
            </p>

            <div className="p-3 rounded-2xs bg-[#0E1626] border border-slate-800 font-mono text-xs">
              <span className="text-[#FF7700] font-bold block mb-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Statutory Worker Protection:</span>
              </span>
              <span className="text-slate-300 text-[11px] leading-relaxed">
                {activeHotspot.statutoryRight}
              </span>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveHotspot(null)}
                className="px-3 py-1.5 rounded-xs font-mono font-bold text-xs uppercase bg-[#FF7700] text-slate-950 cursor-pointer border border-black shadow-[2px_2px_0px_#000]"
              >
                Close Hotspot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
