import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const PrimeFrameworkVisualization = () => {
  const [activeTab, setActiveTab] = useState('navier-stokes');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Simulation parameters
  const [viscosity, setViscosity] = useState(0.1);
  const [externalForce, setExternalForce] = useState(0.05);
  const [vortexStrength, setVortexStrength] = useState(0.3);
  const [primeLimit, setPrimeLimit] = useState(30);
  
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationRef = useRef(null);
  const objectsRef = useRef([]);
  
  // Simulation status
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);

  // Tab content definitions
  const tabs = [
    { id: 'navier-stokes', label: 'Fluid Dynamics' },
    { id: 'number-theory', label: 'Number Theory' },
    { id: 'connection', label: 'Unified Framework' }
  ];

  // Steps for each tab
  const navierstokesSteps = [
    {
      title: "Manifold Structure (M, g)",
      description: "The fluid domain as a smooth, connected, orientable manifold with metric tensor",
      details: "We model the fluid domain as a smooth manifold M equipped with a nondegenerate metric tensor g. This provides the geometric foundation for our differential operators and ensures a coordinate-invariant formulation."
    },
    {
      title: "Clifford Algebra Fibers (Cx)",
      description: "Attaching Clifford algebra fibers at each point x ∈ M",
      details: "At each point x on our manifold, we attach a Clifford algebra fiber Cx = Cl(TxM, gx). This algebraic structure encodes scalar and vector quantities in a unified framework, providing an intrinsic representation for velocity and pressure fields."
    },
    {
      title: "Coherence Inner Product",
      description: "Ensuring unique, canonical representation of physical fields",
      details: "A positive-definite inner product ⟨·,·⟩c on Cx ensures that multiple representations of a field cohere into a unique, canonical form. This is crucial for maintaining consistency in our velocity field and stress tensor representations."
    },
    {
      title: "Velocity Field Embedding",
      description: "Representing v(x,t) intrinsically within the algebraic structure",
      details: "The velocity field v(x,t) is embedded as an element v̂(x,t) in the Clifford algebra, with its graded components encoding vector components. The coherence inner product guarantees uniqueness, and the embedding remains invariant under the symmetry group G."
    },
    {
      title: "Conservation Laws",
      description: "Mass and momentum conservation through intrinsic operators",
      details: "The incompressibility condition ∇·v = 0 is expressed via the intrinsic divergence operator in Clifford algebra. Similarly, Newton's second law applied to fluid elements yields the momentum equation with intrinsic differential operators."
    },
    {
      title: "Navier-Stokes Equations",
      description: "Recovering the classical equations from our framework",
      details: "When expressed in local coordinates, the intrinsic equations reduce to the familiar Navier-Stokes equations: ∂v/∂t + (v·∇)v = -∇p + ν∇²v + f and ∇·v = 0."
    }
  ];

  const numberTheorySteps = [
    {
      title: "Number Embedding",
      description: "Embedding numbers into the fiber algebra Cx",
      details: "Each natural number N is embedded into a fiber algebra Cx by encoding its digits in every possible base b ≥ 2 within distinct graded components. The coherence inner product ensures a unique canonical representation."
    },
    {
      title: "Intrinsic Primes",
      description: "Numbers that cannot be factored nontrivially within Cx",
      details: "An embedded number N̂ is intrinsically prime if whenever N̂ = Â·B̂ for some embedded numbers Â, B̂, then either A=1 or B=1. These are the building blocks of all numbers in the framework."
    },
    {
      title: "Unique Factorization",
      description: "Every number factors uniquely into intrinsic primes",
      details: "Every embedded number N̂ can be expressed as a product of intrinsic primes, and this factorization is unique up to the order of factors. This mirrors the fundamental theorem of arithmetic but derived entirely within the framework."
    },
    {
      title: "Prime Operator",
      description: "Linear operator encoding divisor structure",
      details: "We define the Prime Operator H on ℓ²(ℕ) by H(δN) = ∑d|N δd, encoding the divisor structure of numbers. Its spectral properties reveal deep connections to analytic number theory."
    },
    {
      title: "Intrinsic Zeta Function",
      description: "Derived from the spectral properties of H",
      details: "The formal determinant D(s) = det(I - p⁻ˢH) factorizes according to the unique factorization property, yielding ζP(s) = 1/D(s) = ∏p (1-p⁻ˢ)⁻¹, recovering the classical Euler product."
    },
    {
      title: "Analytic Number Theory Results",
      description: "Prime Number Theorem and Riemann Hypothesis",
      details: "The symmetry in the framework forces ζP(s) to satisfy a functional equation and an analogue of the Riemann Hypothesis, placing all nontrivial zeros on the critical line."
    }
  ];

  const connectionSteps = [
    {
      title: "Unified Axioms",
      description: "Four core axioms underlying both domains",
      details: "The Prime Framework is built on four axioms: a reference manifold M, fiber algebras Cx, a symmetry group G, and a coherence inner product. These serve as the foundation for both number theory and fluid dynamics."
    },
    {
      title: "Algebraic Structures",
      description: "Clifford algebras encode both numbers and vector fields",
      details: "The same algebraic structure (typically Clifford algebras) is used to embed both natural numbers (through their digit representations) and physical fields (through their vector components)."
    },
    {
      title: "Coherence Principle",
      description: "Minimal-norm representations in both domains",
      details: "The coherence inner product forces multiple representations of the same abstract object (number or vector field) to cohere into a unique canonical form with minimal norm."
    },
    {
      title: "Intrinsic Differential Operators",
      description: "Operators derived from the same principles",
      details: "The Prime Operator in number theory and differential operators in fluid dynamics emerge from the same underlying algebraic structures, creating a deep connection between discrete and continuous mathematics."
    },
    {
      title: "Symmetry Groups",
      description: "Group actions preserve structure in both domains",
      details: "The symmetry group G acts by isometries, ensuring that representations are consistent under transformations in both number theory and fluid dynamics."
    },
    {
      title: "Unified Mathematics",
      description: "Number theory and fluid dynamics from first principles",
      details: "The Prime Framework demonstrates how seemingly disparate fields of mathematics can emerge from the same fundamental principles, suggesting a deeper unity in mathematical structures."
    }
  ];

  const getSteps = () => {
    switch(activeTab) {
      case 'navier-stokes': return navierstokesSteps;
      case 'number-theory': return numberTheorySteps;
      case 'connection': return connectionSteps;
      default: return navierstokesSteps;
    }
  };

  const steps = getSteps();

  useEffect(() => {
    // Reset step when changing tabs
    setStep(0);
    setPlaying(false);
    
    // Initialize Three.js
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Clear previous objects
    objectsRef.current.forEach(obj => {
      scene.remove(obj);
    });
    objectsRef.current = [];

    // Create visualizations based on active tab
    switch (activeTab) {
      case 'navier-stokes':
        createFluidVisualization(scene);
        break;
      case 'number-theory':
        createNumberTheoryVisualization(scene);
        break;
      case 'connection':
        createConnectionVisualization(scene);
        break;
      default:
        createFluidVisualization(scene);
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Update visualization based on active tab
      switch (activeTab) {
        case 'navier-stokes':
          animateFluidVisualization(scene, step);
          break;
        case 'number-theory':
          animateNumberTheoryVisualization(scene, step);
          break;
        case 'connection':
          animateConnectionVisualization(scene, step);
          break;
      }
      
      // Update simulation time if running
      if (isRunning) {
        setSimulationTime(prev => prev + 0.01);
      }
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationRef.current);
      renderer.dispose();
    };
  }, [activeTab]);

  // Update visualization based on step change
  useEffect(() => {
    updateVisualizationForStep();
  }, [step]);

  const updateVisualizationForStep = () => {
    const scene = sceneRef.current;
    if (!scene) return;

    switch (activeTab) {
      case 'navier-stokes':
        updateFluidVisualizationStep(scene, step);
        break;
      case 'number-theory':
        updateNumberTheoryVisualizationStep(scene, step);
        break;
      case 'connection':
        updateConnectionVisualizationStep(scene, step);
        break;
    }
  };

  // Create Fluid Dynamics visualization
  const createFluidVisualization = (scene) => {
    // Create manifold (representing a smooth manifold with metric tensor)
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: 0x3d85c6,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const manifold = new THREE.Mesh(geometry, material);
    scene.add(manifold);
    objectsRef.current.push(manifold);

    // Create a subtle grid pattern for the metric tensor
    const gridGeometry = new THREE.SphereGeometry(2.01, 16, 16);
    const gridMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(grid);
    objectsRef.current.push(grid);

    // Create particles for fluid visualization
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 1.9 + Math.random() * 0.1;
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xd0f0ff,
      size: 0.04,
      transparent: true,
      opacity: 0.7
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particles.visible = false;
    scene.add(particles);
    objectsRef.current.push(particles);

    // Create container for velocity field
    const velocityField = new THREE.Group();
    scene.add(velocityField);
    objectsRef.current.push(velocityField);
  };

  // Create Number Theory visualization
  const createNumberTheoryVisualization = (scene) => {
    // Create manifold as a torus to represent the number field
    const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0x9370db,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);
    objectsRef.current.push(torus);

    // Create number points
    const numberGroup = new THREE.Group();
    scene.add(numberGroup);
    objectsRef.current.push(numberGroup);

    // Create prime operator representation
    const operatorGroup = new THREE.Group();
    scene.add(operatorGroup);
    objectsRef.current.push(operatorGroup);
    operatorGroup.visible = false;

    // Create zeta function representation
    const zetaGroup = new THREE.Group();
    scene.add(zetaGroup);
    objectsRef.current.push(zetaGroup);
    zetaGroup.visible = false;
  };

  // Create Connection visualization
  const createConnectionVisualization = (scene) => {
    // Create center manifold 
    const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x4682b4,
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    const centerSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(centerSphere);
    objectsRef.current.push(centerSphere);

    // Create number theory domain (represented as a torus segment)
    const torusGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 50, Math.PI);
    const torusMaterial = new THREE.MeshPhongMaterial({
      color: 0x9370db,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(-2, 1, 0);
    torus.rotation.set(Math.PI/2, 0, 0);
    scene.add(torus);
    objectsRef.current.push(torus);

    // Create fluid domain (represented as wave-like surface)
    const planeGeometry = new THREE.PlaneGeometry(1.5, 1.5, 20, 20);
    // Deform the plane to make it wave-like
    const vertices = planeGeometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      vertices[i + 2] = 0.2 * Math.sin(4 * x) * Math.cos(4 * y);
    }
    planeGeometry.attributes.position.needsUpdate = true;
    planeGeometry.computeVertexNormals();
    
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x3cb371,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const wavePlane = new THREE.Mesh(planeGeometry, planeMaterial);
    wavePlane.position.set(2, 1, 0);
    wavePlane.rotation.set(Math.PI/3, 0, 0);
    scene.add(wavePlane);
    objectsRef.current.push(wavePlane);

    // Create connection lines (initially invisible)
    const connectionsGroup = new THREE.Group();
    scene.add(connectionsGroup);
    objectsRef.current.push(connectionsGroup);

    // Create Clifford algebra representations
    const cliffordGroup = new THREE.Group();
    scene.add(cliffordGroup);
    objectsRef.current.push(cliffordGroup);
    cliffordGroup.visible = false;
  };

  // Animate Fluid Visualization
  const animateFluidVisualization = (scene, step) => {
    // Find objects
    const manifold = objectsRef.current[0];
    const grid = objectsRef.current[1];
    const particles = objectsRef.current[2];
    const velocityField = objectsRef.current[3];

    // Gently rotate the manifold
    if (manifold) {
      manifold.rotation.y += 0.002;
      if (grid) {
        grid.rotation.y = manifold.rotation.y;
        grid.rotation.x = manifold.rotation.x;
      }
    }

    // Animate particles for later steps
    if (step >= 4 && particles && particles.geometry) {
      animateFluidParticles(particles);
    }

    // Animate velocity field if visible
    if (step >= 3 && velocityField && velocityField.children.length > 0) {
      animateVelocityField(velocityField);
    }
  };

  // Animate Number Theory Visualization
  const animateNumberTheoryVisualization = (scene, step) => {
    // Find objects
    const torus = objectsRef.current[0];
    const numberGroup = objectsRef.current[1];
    const operatorGroup = objectsRef.current[2];
    const zetaGroup = objectsRef.current[3];

    // Rotate torus
    if (torus) {
      torus.rotation.x += 0.002;
      torus.rotation.z += 0.001;
    }

    // Animate numbers
    if (step >= 0 && numberGroup && numberGroup.children.length > 0) {
      numberGroup.children.forEach((numObj, i) => {
        // Pulsate primes
        if (numObj.userData && numObj.userData.isPrime) {
          const scale = 1 + 0.1 * Math.sin(simulationTime * 2 + i);
          numObj.scale.set(scale, scale, scale);
        }
        
        // Rotate positions slightly
        numObj.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.002);
      });
    }

    // Animate operator connections
    if (step >= 3 && operatorGroup && operatorGroup.children.length > 0) {
      operatorGroup.children.forEach((line, i) => {
        if (line.material) {
          line.material.opacity = 0.3 + 0.2 * Math.sin(simulationTime * 3 + i * 0.2);
        }
      });
    }

    // Animate zeta function
    if (step >= 4 && zetaGroup && zetaGroup.children.length > 0) {
      zetaGroup.rotation.y += 0.003;
      
      zetaGroup.children.forEach((point, i) => {
        if (point.userData && point.userData.isZero) {
          point.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(simulationTime * 4 + i);
        }
      });
    }
  };

  // Animate Connection Visualization
  const animateConnectionVisualization = (scene, step) => {
    // Find objects
    const centerSphere = objectsRef.current[0];
    const torus = objectsRef.current[1];
    const wavePlane = objectsRef.current[2];
    const connectionsGroup = objectsRef.current[3];
    const cliffordGroup = objectsRef.current[4];

    // Rotate center sphere
    if (centerSphere) {
      centerSphere.rotation.y += 0.003;
      centerSphere.rotation.x += 0.001;
    }

    // Rotate number theory domain
    if (torus) {
      torus.rotation.z += 0.002;
    }

    // Animate fluid domain waves
    if (wavePlane && wavePlane.geometry) {
      const positions = wavePlane.geometry.attributes.position.array;
      const time = simulationTime;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        // Create moving waves
        positions[i + 2] = 0.2 * Math.sin(4 * x + time) * Math.cos(4 * y + time * 0.7);
      }
      
      wavePlane.geometry.attributes.position.needsUpdate = true;
      wavePlane.geometry.computeVertexNormals();
    }

    // Animate connection lines
    if (step >= 2 && connectionsGroup && connectionsGroup.children.length > 0) {
      connectionsGroup.children.forEach((line, i) => {
        if (line.material) {
          line.material.opacity = 0.3 + 0.2 * Math.sin(simulationTime * 2 + i * 0.5);
        }
      });
    }

    // Animate Clifford algebras
    if (step >= 1 && cliffordGroup && cliffordGroup.children.length > 0) {
      cliffordGroup.children.forEach((algebra, i) => {
        algebra.rotation.x += 0.01;
        algebra.rotation.y += 0.007;
        
        // Pulsate
        const scale = 1 + 0.1 * Math.sin(simulationTime * 3 + i);
        algebra.scale.set(scale, scale, scale);
      });
    }
  };

  // Helper function to animate fluid particles
  const animateFluidParticles = (particles) => {
    const positions = particles.geometry.attributes.position.array;
    // Apply flow parameters to particle movement
    const particleSpeed = 0.025;
    const vortexEffect = vortexStrength * 0.03;
    const viscosityDamping = 1 - (viscosity * 0.5);
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Get normalized position (direction from center)
      const length = Math.sqrt(x*x + y*y + z*z);
      const nx = x / length;
      const ny = y / length;
      const nz = z / length;
      
      // Create rotation based on position
      // This creates a swirling motion tangent to the sphere
      const vx = particleSpeed * (-ny + vortexEffect * nz * ny);
      const vy = particleSpeed * (nx - vortexEffect * nz * nx);
      const vz = particleSpeed * (vortexEffect * (nx * nx + ny * ny));
      
      // Apply velocity with viscosity damping
      positions[i] += vx * viscosityDamping;
      positions[i + 1] += vy * viscosityDamping;
      positions[i + 2] += vz * viscosityDamping;
      
      // Add external force effect if significant
      if (externalForce > 0.01) {
        const forceAngle = Math.atan2(ny, nx) * 3;
        positions[i] += externalForce * 0.01 * Math.sin(forceAngle);
        positions[i + 1] += externalForce * 0.01 * Math.cos(forceAngle);
      }
      
      // Project back to sphere surface
      const newLength = Math.sqrt(
        positions[i]**2 + 
        positions[i+1]**2 + 
        positions[i+2]**2
      );
      
      const scale = (1.9 + Math.random() * 0.1) / newLength;
      
      positions[i] *= scale;
      positions[i + 1] *= scale;
      positions[i + 2] *= scale;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
  };

  // Helper function to animate velocity field
  const animateVelocityField = (velocityField) => {
    const time = simulationTime;
    
    velocityField.children.forEach((arrow, index) => {
      if (arrow instanceof THREE.ArrowHelper && arrow.userData) {
        const originalLength = arrow.userData.originalLength || 0.4;
        
        // Apply pulsing effect
        const pulseFactor = 0.8 + 0.2 * Math.sin(time * 2 + index * 0.2);
        arrow.setLength(originalLength * pulseFactor);
        
        // Apply rotation if not in vortex mode
        if (!arrow.userData.vortexCenter) {
          const originalDirection = arrow.userData.originalDirection;
          if (originalDirection) {
            const axis = new THREE.Vector3(0, 1, 0);
            const angle = 0.02 * Math.sin(time + index * 0.1);
            const rotatedDir = originalDirection.clone();
            rotatedDir.applyAxisAngle(axis, angle);
            arrow.setDirection(rotatedDir);
          }
        }
      }
    });
  };

  // Update fluid visualization for specific step
  const updateFluidVisualizationStep = (scene, step) => {
    // Find objects
    const particles = objectsRef.current[2];
    const velocityField = objectsRef.current[3];
    
    // Clear previous state
    if (velocityField) {
      while (velocityField.children.length > 0) {
        velocityField.remove(velocityField.children[0]);
      }
    }
    
    // Set visibility based on current step
    if (particles) {
      particles.visible = step >= 4;
    }
    
    if (velocityField) {
      velocityField.visible = step >= 3;
    }

    // Add appropriate elements for each step
    switch (step) {
      case 0: // Manifold Structure
        addCoordinateSystem(scene);
        break;
      case 1: // Clifford Algebra Fibers
        addFiberAlgebras(scene);
        break;
      case 2: // Coherence Inner Product
        addFiberAlgebras(scene);
        addCoherenceLinks(scene);
        break;
      case 3: // Velocity Field Embedding
        addFiberAlgebras(scene);
        addVelocityVectors(scene);
        break;
      case 4: // Conservation Laws
        addDivergenceFreeField(scene);
        break;
      case 5: // Navier-Stokes Equations
        addNavierStokesField(scene);
        break;
    }
  };

  // Update number theory visualization for specific step
  const updateNumberTheoryVisualizationStep = (scene, step) => {
    // Find objects
    const numberGroup = objectsRef.current[1];
    const operatorGroup = objectsRef.current[2];
    const zetaGroup = objectsRef.current[3];
    
    // Set visibility based on current step
    if (numberGroup) {
      numberGroup.visible = step >= 0;
      // Clear previous numbers
      while (numberGroup.children.length > 0) {
        numberGroup.remove(numberGroup.children[0]);
      }
    }
    
    if (operatorGroup) {
      operatorGroup.visible = step >= 3;
      // Clear previous operator lines
      while (operatorGroup.children.length > 0) {
        operatorGroup.remove(operatorGroup.children[0]);
      }
    }
    
    if (zetaGroup) {
      zetaGroup.visible = step >= 4;
      // Clear previous zeta representation
      while (zetaGroup.children.length > 0) {
        zetaGroup.remove(zetaGroup.children[0]);
      }
    }

    // Add appropriate elements for each step
    switch (step) {
      case 0: // Number Embedding
        addNumberEmbeddings(scene);
        break;
      case 1: // Intrinsic Primes
        addPrimeNumbers(scene);
        break;
      case 2: // Unique Factorization
        addNumberFactorization(scene);
        break;
      case 3: // Prime Operator
        addPrimeOperator(scene);
        break;
      case 4: // Intrinsic Zeta Function
        addZetaFunction(scene);
        break;
      case 5: // Analytic Number Theory Results
        addRiemannHypothesis(scene);
        break;
    }
  };

  // Update connection visualization for specific step
  const updateConnectionVisualizationStep = (scene, step) => {
    // Find objects
    const connectionsGroup = objectsRef.current[3];
    const cliffordGroup = objectsRef.current[4];
    
    // Set visibility based on current step
    if (connectionsGroup) {
      connectionsGroup.visible = step >= 2;
      // Clear previous connections
      while (connectionsGroup.children.length > 0) {
        connectionsGroup.remove(connectionsGroup.children[0]);
      }
    }
    
    if (cliffordGroup) {
      cliffordGroup.visible = step >= 1;
      // Clear previous Clifford algebras
      while (cliffordGroup.children.length > 0) {
        cliffordGroup.remove(cliffordGroup.children[0]);
      }
    }

    // Add appropriate elements for each step
    switch (step) {
      case 0: // Unified Axioms
        // Basic scene already set up
        break;
      case 1: // Algebraic Structures
        addCliffordAlgebras(scene);
        break;
      case 2: // Coherence Principle
        addCliffordAlgebras(scene);
        addFrameworkConnections(scene);
        break;
      case 3: // Intrinsic Differential Operators
        addCliffordAlgebras(scene);
        addFrameworkConnections(scene);
        addOperatorConnections(scene);
        break;
      case 4: // Symmetry Groups
        addCliffordAlgebras(scene);
        addFrameworkConnections(scene);
        addSymmetryGroup(scene);
        break;
      case 5: // Unified Mathematics
        addCliffordAlgebras(scene);
        addFrameworkConnections(scene);
        addUnifiedMathematics(scene);
        break;
    }
  };

  // Helper functions for fluid dynamics visualization
  const addCoordinateSystem = (scene) => {
    const velocityField = objectsRef.current[3];
    
    // Add coordinate curves to represent the manifold structure
    const curvesMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffff00,
      transparent: true,
      opacity: 0.6
    });
    
    // Longitude lines
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const points = [];
      
      for (let j = 0; j <= 32; j++) {
        const phi = (j / 32) * Math.PI;
        const radius = 2.02; // Slightly above the manifold surface
        
        const x = radius * Math.sin(phi) * Math.cos(angle);
        const y = radius * Math.sin(phi) * Math.sin(angle);
        const z = radius * Math.cos(phi);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const curve = new THREE.Line(geometry, curvesMaterial);
      velocityField.add(curve);
    }
    
    // Latitude lines
    for (let i = 1; i < 8; i++) {
      const phi = (i / 8) * Math.PI;
      const points = [];
      
      for (let j = 0; j <= 32; j++) {
        const theta = (j / 32) * Math.PI * 2;
        const radius = 2.02; // Slightly above the manifold surface
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        points.push(new THREE.Vector3(x, y, z));
      }
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const curve = new THREE.Line(geometry, curvesMaterial);
      velocityField.add(curve);
    }
  };

  const addFiberAlgebras = (scene) => {
    const velocityField = objectsRef.current[3];
    
    // Create fiber algebras at strategic points
    for (let i = 0; i < 16; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 2;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      const point = new THREE.Vector3(x, y, z);
      
      // Create a representation of Clifford algebra (octahedron)
      const fiberGeometry = new THREE.OctahedronGeometry(0.18);
      const fiberMaterial = new THREE.MeshPhongMaterial({
        color: 0xff9900,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        emissive: 0xff4400,
        emissiveIntensity: 0.3
      });
      
      const fiber = new THREE.Mesh(fiberGeometry, fiberMaterial);
      fiber.position.copy(point);
      
      // Add a small basis indicator
      const basisGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      const basisMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      
      const basis = new THREE.Mesh(basisGeometry, basisMaterial);
      fiber.add(basis);
      
      // Store the original position for animations
      fiber.userData = {
        originalPosition: point.clone(),
        phase: Math.random() * Math.PI * 2
      };
      
      velocityField.add(fiber);
    }
  };

  const addCoherenceLinks = (scene) => {
    const velocityField = objectsRef.current[3];
    
    // Find fiber algebras
    const fibers = velocityField.children.filter(
      child => child.geometry && child.geometry.type.includes("Octahedron")
    );
    
    // Add links between nearby fibers to represent coherence
    for (let i = 0; i < fibers.length; i++) {
      for (let j = i + 1; j < fibers.length; j++) {
        const distance = fibers[i].position.distanceTo(fibers[j].position);
        
        if (distance < 1.5) {
          const points = [
            fibers[i].position.clone(),
            fibers[j].position.clone()
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ 
            color: 0x00ffff,
            transparent: true,
            opacity: 0.4
          });
          
          const line = new THREE.Line(geometry, material);
          velocityField.add(line);
        }
      }
    }
  };

  const addVelocityVectors = (scene) => {
    const velocityField = objectsRef.current[3];
    
    // Find fiber algebras
    const fibers = velocityField.children.filter(
      child => child.geometry && child.geometry.type.includes("Octahedron")
    );
    
    // Add velocity vectors to each fiber
    fibers.forEach(fiber => {
      const origin = fiber.position.clone();
      
      // Create tangent vector
      const normal = origin.clone().normalize();
      const tangent1 = new THREE.Vector3(1, 0, 0);
      tangent1.crossVectors(normal, tangent1).normalize();
      
      if (tangent1.length() < 0.1) {
        tangent1.crossVectors(normal, new THREE.Vector3(0, 1, 0)).normalize();
      }
      
      const tangent2 = new THREE.Vector3();
      tangent2.crossVectors(normal, tangent1).normalize();
      
      const angle = Math.random() * Math.PI * 2;
      const direction = new THREE.Vector3()
        .addScaledVector(tangent1, Math.cos(angle))
        .addScaledVector(tangent2, Math.sin(angle))
        .normalize()
        .multiplyScalar(0.4);
      
      // Store original direction for animations
      const originalDirection = direction.clone().normalize();
      
      // Add arrow to represent the velocity vector
      const arrowHelper = new THREE.ArrowHelper(
        direction.clone().normalize(),
        origin,
        direction.length(),
        0x00ff00
      );
      
      arrowHelper.userData = {
        originalDirection: originalDirection,
        originalLength: direction.length()
      };
      
      velocityField.add(arrowHelper);
    });
  };

  const addDivergenceFreeField = (scene) => {
    const velocityField = objectsRef.current[3];
    
    // Create a divergence-free vector field
    for (let i = 0; i < 32; i++) {
      const theta = (i / 16) * Math.PI * 2;
      const phi = Math.acos(2 * (i % 8) / 8 - 1);
      const radius = 2;
      
      const origin = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      // Create tangent vector (divergence-free)
      const normal = origin.clone().normalize();
      const tangent1 = new THREE.Vector3(1, 0, 0);
      tangent1.crossVectors(normal, tangent1).normalize();
      
      if (tangent1.length() < 0.1) {
        tangent1.crossVectors(normal, new THREE.Vector3(0, 1, 0)).normalize();
      }
      
      const tangent2 = new THREE.Vector3();
      tangent2.crossVectors(normal, tangent1).normalize();
      
      // Create curl-based vector field
      const angle = Math.atan2(origin.y, origin.x) * 2;
      const direction = new THREE.Vector3()
        .addScaledVector(tangent1, Math.cos(angle))
        .addScaledVector(tangent2, Math.sin(angle))
        .normalize()
        .multiplyScalar(0.4);
      
      const originalDirection = direction.clone().normalize();
      
      const arrowHelper = new THREE.ArrowHelper(
        direction.clone().normalize(),
        origin,
        direction.length(),
        0x00ff00
      );
      
      arrowHelper.userData = {
        originalDirection: originalDirection,
        originalLength: direction.length()
      };
      
      velocityField.add(arrowHelper);
    }
  };

  const addNavierStokesField = (scene) => {
    const velocityField = objectsRef.current[3];
    
    // Create two counter-rotating vortices
    for (let vortex = 0; vortex < 2; vortex++) {
      const vortexCenterPhi = vortex === 0 ? Math.PI * 0.3 : Math.PI * 0.7;
      const vortexCenterTheta = vortex === 0 ? Math.PI * 0.5 : Math.PI * 1.5;
      
      const vortexCenter = new THREE.Vector3(
        2 * Math.sin(vortexCenterPhi) * Math.cos(vortexCenterTheta),
        2 * Math.sin(vortexCenterPhi) * Math.sin(vortexCenterTheta),
        2 * Math.cos(vortexCenterPhi)
      );
      
      const pointCount = vortex === 0 ? 20 : 16;
      
      for (let i = 0; i < pointCount; i++) {
        // Distribute around vortex center
        const angle = (i / pointCount) * Math.PI * 2;
        const distFromCenter = 0.3 + (i % 2) * 0.3 * vortexStrength;
        
        // Find point on sphere closest to desired vortex point
        const tempPoint = new THREE.Vector3(
          distFromCenter * Math.cos(angle),
          distFromCenter * Math.sin(angle),
          0
        );
        
        // Create local coordinate system at vortex center
        const normal = vortexCenter.clone().normalize();
        const tangent1 = new THREE.Vector3();
        tangent1.crossVectors(normal, new THREE.Vector3(0, 0, 1)).normalize();
        
        if (tangent1.length() < 0.1) {
          tangent1.crossVectors(normal, new THREE.Vector3(1, 0, 0)).normalize();
        }
        
        const tangent2 = new THREE.Vector3();
        tangent2.crossVectors(normal, tangent1).normalize();
        
        // Transform to sphere surface
        const pointOnSphere = vortexCenter.clone();
        pointOnSphere.addScaledVector(tangent1, tempPoint.x);
        pointOnSphere.addScaledVector(tangent2, tempPoint.y);
        pointOnSphere.normalize().multiplyScalar(2);
        
        // Calculate velocity - tangent to the circle around vortex center
        const velDirection = new THREE.Vector3();
        velDirection.crossVectors(
          normal,
          pointOnSphere.clone().sub(vortexCenter).normalize()
        ).normalize();
        
        // Flip direction for second vortex
        if (vortex === 1) velDirection.negate();
        
        // Speed falls off with distance from vortex center
        const speed = 0.4 * (1 - distFromCenter / 0.7);
        velDirection.multiplyScalar(speed);
        
        // Create arrow
        const arrowHelper = new THREE.ArrowHelper(
          velDirection.clone().normalize(),
          pointOnSphere,
          speed,
          0x00ff00
        );
        
        arrowHelper.userData = {
          originalDirection: velDirection.clone().normalize(),
          originalLength: speed,
          vortexCenter: vortexCenter.clone(),
          vortexAngle: angle,
          vortexDist: distFromCenter
        };
        
        velocityField.add(arrowHelper);
      }
    }
    
    // Add pressure and viscosity effects
    const arrows = velocityField.children.filter(obj => obj instanceof THREE.ArrowHelper);
    
    for (let i = 0; i < Math.min(10, arrows.length); i++) {
      const arrow = arrows[i];
      const origin = arrow.position.clone();
      
      // Add pressure gradient (red arrow)
      const normal = origin.clone().normalize();
      const pressureDirection = normal.clone().negate().multiplyScalar(0.15);
      
      const pressureArrow = new THREE.ArrowHelper(
        pressureDirection.clone().normalize(),
        origin.clone().add(new THREE.Vector3(0, 0.1, 0)),
        pressureDirection.length(),
        0xff0000
      );
      
      // Add viscosity effect (blue arrow)
      const viscDirection = arrow.userData.originalDirection.clone().negate().multiplyScalar(viscosity * 0.4);
      
      const viscArrow = new THREE.ArrowHelper(
        viscDirection.clone().normalize(),
        origin.clone().add(new THREE.Vector3(0, -0.1, 0)),
        viscDirection.length(),
        0x0000ff
      );
      
      velocityField.add(pressureArrow);
      velocityField.add(viscArrow);
    }
  };

  // Helper functions for number theory visualization
  const addNumberEmbeddings = (scene) => {
    const numberGroup = objectsRef.current[1];
    
    // Create representations for numbers 1-10
    for (let num = 1; num <= 10; num++) {
      // Position on torus
      const angle = (num / 10) * Math.PI * 2;
      const tubeAngle = (num % 3) * Math.PI * 2 / 3;
      
      const torusRadius = 2;
      const tubeRadius = 0.5;
      
      const x = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.cos(angle);
      const y = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.sin(angle);
      const z = tubeRadius * Math.sin(tubeAngle);
      
      // Create a sphere for each number
      const geometry = new THREE.SphereGeometry(0.15, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        emissive: 0x888888,
        emissiveIntensity: 0.2
      });
      
      const numberSphere = new THREE.Mesh(geometry, material);
      numberSphere.position.set(x, y, z);
      
      // Add a label for the number
      const labelGeometry = new THREE.TextGeometry(num.toString(), {
        size: 0.1,
        height: 0.02
      });
      
      numberSphere.userData = {
        number: num,
        isPrime: isPrime(num),
        baseRepresentations: getBaseRepresentations(num)
      };
      
      numberGroup.add(numberSphere);
    }
  };

  const addPrimeNumbers = (scene) => {
    const numberGroup = objectsRef.current[1];
    
    // Create representations for numbers 1-30
    const limit = primeLimit;
    for (let num = 1; num <= limit; num++) {
      // Position on torus
      const angle = (num / limit) * Math.PI * 2;
      const tubeAngle = (num % 5) * Math.PI * 2 / 5;
      
      const torusRadius = 2;
      const tubeRadius = 0.5;
      
      const x = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.cos(angle);
      const y = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.sin(angle);
      const z = tubeRadius * Math.sin(tubeAngle);
      
      // Create a sphere for each number
      const isPrimeNum = isPrime(num);
      const geometry = new THREE.SphereGeometry(isPrimeNum ? 0.18 : 0.12, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: isPrimeNum ? 0xff5500 : 0xaaaaaa,
        emissive: isPrimeNum ? 0xff2200 : 0x444444,
        emissiveIntensity: isPrimeNum ? 0.5 : 0.2
      });
      
      const numberSphere = new THREE.Mesh(geometry, material);
      numberSphere.position.set(x, y, z);
      
      numberSphere.userData = {
        number: num,
        isPrime: isPrimeNum,
        baseRepresentations: getBaseRepresentations(num)
      };
      
      numberGroup.add(numberSphere);
    }
  };

  const addNumberFactorization = (scene) => {
    const numberGroup = objectsRef.current[1];
    
    // Create representations for numbers 1-30
    const limit = primeLimit;
    for (let num = 1; num <= limit; num++) {
      // Position on torus
      const angle = (num / limit) * Math.PI * 2;
      const tubeAngle = (num % 5) * Math.PI * 2 / 5;
      
      const torusRadius = 2;
      const tubeRadius = 0.5;
      
      const x = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.cos(angle);
      const y = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.sin(angle);
      const z = tubeRadius * Math.sin(tubeAngle);
      
      // Create a sphere for each number
      const isPrimeNum = isPrime(num);
      const factors = primeFactorization(num);
      
      const geometry = new THREE.SphereGeometry(isPrimeNum ? 0.18 : 0.12, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: isPrimeNum ? 0xff5500 : 0xaaaaaa,
        emissive: isPrimeNum ? 0xff2200 : 0x444444,
        emissiveIntensity: isPrimeNum ? 0.5 : 0.2
      });
      
      const numberSphere = new THREE.Mesh(geometry, material);
      numberSphere.position.set(x, y, z);
      
      numberSphere.userData = {
        number: num,
        isPrime: isPrimeNum,
        factors: factors,
        baseRepresentations: getBaseRepresentations(num)
      };
      
      numberGroup.add(numberSphere);
    }
    
    // Add factor connections
    const numbers = numberGroup.children;
    
    for (let i = 0; i < numbers.length; i++) {
      const numberObj = numbers[i];
      const num = numberObj.userData.number;
      
      if (num <= 1 || isPrime(num)) continue;
      
      // Connect to its prime factors
      const factors = primeFactorization(num);
      
      factors.forEach(factor => {
        const factorObj = numbers.find(obj => obj.userData.number === factor);
        
        if (factorObj) {
          const points = [
            numberObj.position.clone(),
            factorObj.position.clone()
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ 
            color: 0xff9900,
            transparent: true,
            opacity: 0.4
          });
          
          const line = new THREE.Line(geometry, material);
          numberGroup.add(line);
        }
      });
    }
  };

  const addPrimeOperator = (scene) => {
    const numberGroup = objectsRef.current[1];
    const operatorGroup = objectsRef.current[2];
    
    // Create representations for numbers 1-30 with divisor connections
    const limit = primeLimit;
    for (let num = 1; num <= limit; num++) {
      // Position on torus
      const angle = (num / limit) * Math.PI * 2;
      const tubeAngle = (num % 5) * Math.PI * 2 / 5;
      
      const torusRadius = 2;
      const tubeRadius = 0.5;
      
      const x = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.cos(angle);
      const y = (torusRadius + tubeRadius * Math.cos(tubeAngle)) * Math.sin(angle);
      const z = tubeRadius * Math.sin(tubeAngle);
      
      // Create a sphere for each number
      const isPrimeNum = isPrime(num);
      
      const geometry = new THREE.SphereGeometry(isPrimeNum ? 0.18 : 0.12, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: isPrimeNum ? 0xff5500 : 0xaaaaaa,
        emissive: isPrimeNum ? 0xff2200 : 0x444444,
        emissiveIntensity: isPrimeNum ? 0.5 : 0.2
      });
      
      const numberSphere = new THREE.Mesh(geometry, material);
      numberSphere.position.set(x, y, z);
      
      numberSphere.userData = {
        number: num,
        isPrime: isPrimeNum,
        divisors: getDivisors(num)
      };
      
      numberGroup.add(numberSphere);
    }
    
    // Add divisor connections (Prime Operator visualization)
    const numbers = numberGroup.children;
    
    for (let i = 0; i < numbers.length; i++) {
      const numberObj = numbers[i];
      const num = numberObj.userData.number;
      
      if (num <= 1) continue;
      
      // Connect to all its divisors
      const divisors = numberObj.userData.divisors;
      
      divisors.forEach(divisor => {
        if (divisor === num) return; // Skip self-connection
        
        const divisorObj = numbers.find(obj => obj.userData.number === divisor);
        
        if (divisorObj) {
          const points = [
            numberObj.position.clone(),
            divisorObj.position.clone()
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ 
            color: 0x00aaff,
            transparent: true,
            opacity: 0.3
          });
          
          const line = new THREE.Line(geometry, material);
          operatorGroup.add(line);
        }
      });
    }
  };

  const addZetaFunction = (scene) => {
    const zetaGroup = objectsRef.current[3];
    
    // Create a representation of the zeta function
    // We'll create a helical path with critical zeros
    
    // Create the main path
    const points = [];
    for (let t = 0; t <= 10; t += 0.1) {
      const x = 0.5 + 0.5 * Math.cos(t);
      const y = t * 0.2 - 1;
      const z = 0.5 * Math.sin(t);
      
      points.push(new THREE.Vector3(x, y, z));
    }
    
    const pathGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const pathMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
    const path = new THREE.Line(pathGeometry, pathMaterial);
    path.scale.set(2, 2, 2);
    
    zetaGroup.add(path);
    
    // Add critical zeros on the line Re(s) = 1/2
    for (let i = 0; i < 8; i++) {
      const y = i * 0.5;
      
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00aaaa,
        emissiveIntensity: 0.5
      });
      
      const zeroPoint = new THREE.Mesh(geometry, material);
      zeroPoint.position.set(1, y, 0);
      zeroPoint.scale.set(2, 2, 2);
      
      zeroPoint.userData = {
        isZero: true,
        height: y
      };
      
      zetaGroup.add(zeroPoint);
    }
    
    // Add critical line
    const linePoints = [
      new THREE.Vector3(1, -1, 0),
      new THREE.Vector3(1, 4, 0)
    ];
    
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5
    });
    
    const criticalLine = new THREE.Line(lineGeometry, lineMaterial);
    criticalLine.scale.set(2, 2, 2);
    
    zetaGroup.add(criticalLine);
  };

  const addRiemannHypothesis = (scene) => {
    // Build on the zeta function visualization
    addZetaFunction(scene);
    
    const zetaGroup = objectsRef.current[3];
    
    // Add a critical strip
    const stripGeometry = new THREE.PlaneGeometry(1, 5, 1, 1);
    const stripMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    
    const strip = new THREE.Mesh(stripGeometry, stripMaterial);
    strip.position.set(1, 1.5, 0);
    strip.scale.set(2, 2, 2);
    
    zetaGroup.add(strip);
    
    // Add functional equation visualization
    const equationPoints = [];
    for (let t = 0; t <= Math.PI * 2; t += 0.1) {
      const x = Math.cos(t);
      const z = Math.sin(t);
      
      equationPoints.push(new THREE.Vector3(x, -1.5, z));
    }
    
    const equationGeometry = new THREE.BufferGeometry().setFromPoints(equationPoints);
    const equationMaterial = new THREE.LineBasicMaterial({ 
      color: 0xff5500,
      transparent: true,
      opacity: 0.8
    });
    
    const equation = new THREE.Line(equationGeometry, equationMaterial);
    equation.scale.set(1.5, 1.5, 1.5);
    
    zetaGroup.add(equation);
  };

  // Helper functions for connection visualization
  const addCliffordAlgebras = (scene) => {
    const cliffordGroup = objectsRef.current[4];
    
    // Create Clifford algebra representations at various points
    for (let i = 0; i < 12; i++) {
      // Distribute points in space
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = 1.5 + Math.random() * 1.5;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      // Create a representation of Clifford algebra (octahedron)
      const fiberGeometry = new THREE.OctahedronGeometry(0.15);
      const fiberMaterial = new THREE.MeshPhongMaterial({
        color: 0xff9900,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        emissive: 0xff4400,
        emissiveIntensity: 0.3
      });
      
      const fiber = new THREE.Mesh(fiberGeometry, fiberMaterial);
      fiber.position.set(x, y, z);
      
      // Add a small basis indicator
      const basisGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05);
      const basisMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
      
      const basis = new THREE.Mesh(basisGeometry, basisMaterial);
      fiber.add(basis);
      
      // Store domain information
      fiber.userData = {
        domain: x < 0 ? 'number-theory' : 'fluid-dynamics',
        phase: Math.random() * Math.PI * 2
      };
      
      cliffordGroup.add(fiber);
    }
  };

  const addFrameworkConnections = (scene) => {
    const connectionsGroup = objectsRef.current[3];
    const cliffordGroup = objectsRef.current[4];
    
    // Create connections between center sphere and domain spheres
    const centerSphere = objectsRef.current[0];
    const torus = objectsRef.current[1];
    const wavePlane = objectsRef.current[2];
    
    // Connect center to domains
    if (centerSphere && torus && wavePlane) {
      // Connect to number theory domain
      const torusPoints = [
        centerSphere.position.clone(),
        torus.position.clone()
      ];
      
      const torusGeometry = new THREE.BufferGeometry().setFromPoints(torusPoints);
      const torusMaterial = new THREE.LineBasicMaterial({ 
        color: 0x9370db,
        transparent: true,
        opacity: 0.7,
        linewidth: 2
      });
      
      const torusLine = new THREE.Line(torusGeometry, torusMaterial);
      connectionsGroup.add(torusLine);
      
      // Connect to fluid dynamics domain
      const wavePlanePoints = [
        centerSphere.position.clone(),
        wavePlane.position.clone()
      ];
      
      const wavePlaneGeometry = new THREE.BufferGeometry().setFromPoints(wavePlanePoints);
      const wavePlaneMaterial = new THREE.LineBasicMaterial({ 
        color: 0x3cb371,
        transparent: true,
        opacity: 0.7,
        linewidth: 2
      });
      
      const wavePlaneLine = new THREE.Line(wavePlaneGeometry, wavePlaneMaterial);
      connectionsGroup.add(wavePlaneLine);
    }
    
    // Connect Clifford algebras to each other
    if (cliffordGroup && cliffordGroup.children.length > 0) {
      const fibers = cliffordGroup.children;
      
      for (let i = 0; i < fibers.length; i++) {
        for (let j = i + 1; j < fibers.length; j++) {
          if (Math.random() < 0.2) { // Only create some connections
            const points = [
              fibers[i].position.clone(),
              fibers[j].position.clone()
            ];
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({ 
              color: 0x00ffff,
              transparent: true,
              opacity: 0.2
            });
            
            const line = new THREE.Line(geometry, material);
            connectionsGroup.add(line);
          }
        }
      }
    }
  };

  const addOperatorConnections = (scene) => {
    const connectionsGroup = objectsRef.current[3];
    const cliffordGroup = objectsRef.current[4];
    
    // Create connections representing differential operators
    if (cliffordGroup && cliffordGroup.children.length > 0) {
      const fibers = cliffordGroup.children;
      
      // Create operator flow lines
      for (let i = 0; i < fibers.length; i++) {
        const fiber = fibers[i];
        const domain = fiber.userData.domain;
        
        // Create an arrow showing operator direction
        const direction = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize().multiplyScalar(0.5);
        
        const arrowHelper = new THREE.ArrowHelper(
          direction.clone().normalize(),
          fiber.position.clone(),
          direction.length(),
          domain === 'number-theory' ? 0x9370db : 0x3cb371
        );
        
        connectionsGroup.add(arrowHelper);
      }
      
      // Create "bridge" connections between domains
      const numberTheoryFibers = fibers.filter(f => f.userData.domain === 'number-theory');
      const fluidDynamicsFibers = fibers.filter(f => f.userData.domain === 'fluid-dynamics');
      
      for (let i = 0; i < 3; i++) {
        if (numberTheoryFibers.length > i && fluidDynamicsFibers.length > i) {
          const points = [
            numberTheoryFibers[i].position.clone(),
            fluidDynamicsFibers[i].position.clone()
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineDashedMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.7,
            dashSize: 0.1,
            gapSize: 0.1
          });
          
          const line = new THREE.Line(geometry, material);
          connectionsGroup.add(line);
        }
      }
    }
  };

  const addSymmetryGroup = (scene) => {
    const connectionsGroup = objectsRef.current[3];
    const cliffordGroup = objectsRef.current[4];
    
    // Visualize symmetry group action
    // Create a circular path to represent group action
    const groupPoints = [];
    for (let t = 0; t <= Math.PI * 2; t += Math.PI / 16) {
      const x = Math.cos(t);
      const y = 0.5;
      const z = Math.sin(t);
      
      groupPoints.push(new THREE.Vector3(x, y, z));
    }
    
    groupPoints.push(groupPoints[0].clone()); // Close the loop
    
    const groupGeometry = new THREE.BufferGeometry().setFromPoints(groupPoints);
    const groupMaterial = new THREE.LineBasicMaterial({ 
      color: 0xffff00,
      transparent: true,
      opacity: 0.7
    });
    
    const groupPath = new THREE.Line(groupGeometry, groupMaterial);
    groupPath.scale.set(2, 2, 2);
    
    connectionsGroup.add(groupPath);
    
    // Add symmetry transformations to Clifford algebras
    if (cliffordGroup && cliffordGroup.children.length > 0) {
      const fibers = cliffordGroup.children;
      
      for (let i = 0; i < Math.min(5, fibers.length); i++) {
        const fiber = fibers[i];
        
        // Create little orbits around selected fibers
        const orbitPoints = [];
        for (let t = 0; t <= Math.PI * 2; t += Math.PI / 8) {
          const radius = 0.2;
          const dx = radius * Math.cos(t);
          const dy = radius * Math.sin(t);
          const dz = 0;
          
          orbitPoints.push(fiber.position.clone().add(new THREE.Vector3(dx, dy, dz)));
        }
        
        orbitPoints.push(orbitPoints[0].clone()); // Close the loop
        
        const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitMaterial = new THREE.LineBasicMaterial({ 
          color: 0xffff00,
          transparent: true,
          opacity: 0.5
        });
        
        const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
        connectionsGroup.add(orbit);
      }
    }
  };

  const addUnifiedMathematics = (scene) => {
    const connectionsGroup = objectsRef.current[3];
    
    // Create a more elaborate connection network
    const centerSphere = objectsRef.current[0];
    const torus = objectsRef.current[1];
    const wavePlane = objectsRef.current[2];
    
    if (centerSphere && torus && wavePlane) {
      // Create double-thick connections between domains and center
      const torusPoints = [
        centerSphere.position.clone(),
        torus.position.clone()
      ];
      
      const torusGeometry = new THREE.BufferGeometry().setFromPoints(torusPoints);
      const torusMaterial = new THREE.LineBasicMaterial({ 
        color: 0x9370db,
        transparent: true,
        opacity: 0.9,
        linewidth: 3
      });
      
      const torusLine = new THREE.Line(torusGeometry, torusMaterial);
      connectionsGroup.add(torusLine);
      
      const wavePlanePoints = [
        centerSphere.position.clone(),
        wavePlane.position.clone()
      ];
      
      const wavePlaneGeometry = new THREE.BufferGeometry().setFromPoints(wavePlanePoints);
      const wavePlaneMaterial = new THREE.LineBasicMaterial({ 
        color: 0x3cb371,
        transparent: true,
        opacity: 0.9,
        linewidth: 3
      });
      
      const wavePlaneLine = new THREE.Line(wavePlaneGeometry, wavePlaneMaterial);
      connectionsGroup.add(wavePlaneLine);
      
      // Create a direct connection between domains
      const domainsPoints = [
        torus.position.clone(),
        wavePlane.position.clone()
      ];
      
      const domainsGeometry = new THREE.BufferGeometry().setFromPoints(domainsPoints);
      const domainsMaterial = new THREE.LineDashedMaterial({ 
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        dashSize: 0.2,
        gapSize: 0.1
      });
      
      const domainsLine = new THREE.Line(domainsGeometry, domainsMaterial);
      connectionsGroup.add(domainsLine);
    }
    
    // Add a "unification sphere" to signify the unified theory
    const unificationGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const unificationMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.9
    });
    
    const unificationSphere = new THREE.Mesh(unificationGeometry, unificationMaterial);
    unificationSphere.position.set(0, 3, 0);
    
    connectionsGroup.add(unificationSphere);
    
    // Connect unification sphere to the three main elements
    const elements = [centerSphere, torus, wavePlane];
    
    elements.forEach(element => {
      if (element) {
        const points = [
          unificationSphere.position.clone(),
          element.position.clone()
        ];
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ 
          color: 0xffffff,
          transparent: true,
          opacity: 0.7
        });
        
        const line = new THREE.Line(geometry, material);
        connectionsGroup.add(line);
      }
    });
  };

  // Utility functions
  const isPrime = (num) => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    let i = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
      i += 6;
    }
    
    return true;
  };

  const primeFactorization = (num) => {
    if (num <= 1) return [];
    
    const factors = [];
    let divisor = 2;
    
    while (num > 1) {
      if (num % divisor === 0) {
        factors.push(divisor);
        num /= divisor;
      } else {
        divisor++;
      }
    }
    
    return [...new Set(factors)]; // Unique factors
  };

  const getDivisors = (num) => {
    const divisors = [];
    
    for (let i = 1; i <= num; i++) {
      if (num % i === 0) {
        divisors.push(i);
      }
    }
    
    return divisors;
  };

  const getBaseRepresentations = (num) => {
    const representations = {};
    
    // Get representations in bases 2-10
    for (let base = 2; base <= 10; base++) {
      representations[base] = num.toString(base);
    }
    
    return representations;
  };

  // Auto-play functionality
  useEffect(() => {
    let timer;
    if (playing) {
      timer = setInterval(() => {
        setStep(prev => (prev + 1) % steps.length);
      }, 5000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [playing, steps.length]);

  // Run simulation with the given parameters
  const runSimulation = () => {
    setIsRunning(true);
    setSimulationTime(0);
    
    // Update visualization based on current tab
    updateVisualizationForStep();
  };

  return (
    <div className="flex flex-col w-full h-full bg-slate-900 text-white rounded-lg overflow-hidden">
      <div className="p-4 bg-slate-800 border-b border-slate-700">
        <h2 className="text-xl font-bold mb-1">Prime Framework: From Number Theory to Fluid Dynamics</h2>
        <p className="text-sm opacity-80">
          A unified mathematical framework connecting discrete and continuous mathematics
        </p>
      </div>
      
      <div className="flex justify-between bg-slate-800 border-b border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 ${activeTab === tab.id ? 
              'bg-slate-700 text-white' : 
              'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-2/3 h-64 md:h-auto relative">
          <canvas 
            ref={canvasRef}
            className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-slate-800 bg-opacity-80 p-3">
            <h3 className="text-lg font-medium">{steps[step]?.title || "Visualization"}</h3>
            <p className="text-sm mt-1">{steps[step]?.description || ""}</p>
          </div>
        </div>
        
        <div className="w-full md:w-1/3 bg-slate-800 p-4 overflow-y-auto">
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-md ${playing ? 
                'bg-blue-700 hover:bg-blue-800' : 
                'bg-blue-600 hover:bg-blue-700'}`}
              onClick={() => setPlaying(!playing)}
            >
              {playing ? "Pause" : "Auto-Play"}
            </button>
            
            <button
              className={`px-3 py-1 text-sm rounded-md ${showDetails ? 
                'bg-slate-600 hover:bg-slate-700' : 
                'bg-slate-700 hover:bg-slate-600'}`}
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            
            {activeTab === 'navier-stokes' && (
              <button
                className="px-3 py-1 text-sm rounded-md bg-green-600 hover:bg-green-700"
                onClick={runSimulation}
              >
                Simulate Fluid
              </button>
            )}
            
            {activeTab === 'number-theory' && (
              <button
                className="px-3 py-1 text-sm rounded-md bg-green-600 hover:bg-green-700"
                onClick={runSimulation}
              >
                Compute Primes
              </button>
            )}
          </div>
          
          {/* Parameters panel */}
          {activeTab === 'navier-stokes' && (
            <div className="mb-4 p-3 bg-slate-700 rounded-md">
              <h4 className="font-medium mb-2">Fluid Parameters</h4>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Viscosity (ν): {viscosity.toFixed(2)}</label>
                <input 
                  type="range" 
                  min="0.01" 
                  max="0.5" 
                  step="0.01" 
                  value={viscosity}
                  onChange={(e) => setViscosity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">External Force: {externalForce.toFixed(2)}</label>
                <input 
                  type="range" 
                  min="0" 
                  max="0.2" 
                  step="0.01" 
                  value={externalForce}
                  onChange={(e) => setExternalForce(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Vortex Strength: {vortexStrength.toFixed(2)}</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.6" 
                  step="0.05" 
                  value={vortexStrength}
                  onChange={(e) => setVortexStrength(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          {activeTab === 'number-theory' && (
            <div className="mb-4 p-3 bg-slate-700 rounded-md">
              <h4 className="font-medium mb-2">Number Theory Parameters</h4>
              
              <div className="mb-3">
                <label className="block text-sm mb-1">Prime Limit: {primeLimit}</label>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  step="5" 
                  value={primeLimit}
                  onChange={(e) => setPrimeLimit(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
          
          {showDetails && steps[step]?.details && (
            <div className="mb-4 p-3 bg-slate-700 rounded-md">
              <p className="text-sm">{steps[step].details}</p>
            </div>
          )}
          
          <div className="flex flex-col space-y-2 mb-6">
            {steps.map((s, idx) => (
              <button
                key={idx}
                className={`p-2 text-left rounded-md transition-colors ${
                  idx === step ? "bg-blue-600" : "bg-slate-700 hover:bg-slate-600"
                }`}
                onClick={() => setStep(idx)}
              >
                {s.title}
              </button>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-lg font-medium mb-2">Prime Framework:</h4>
            
            <div className="bg-slate-700 p-3 rounded-md mb-4">
              <p className="text-sm">
                The Prime Framework is built on four core axioms:
              </p>
              <ul className="text-xs space-y-1 mt-2 pl-4">
                <li><span className="font-medium text-blue-300">Reference Manifold:</span> Smooth manifold M with metric g</li>
                <li><span className="font-medium text-orange-300">Fiber Algebras:</span> Clifford algebras Cx at each point x ∈ M</li>
                <li><span className="font-medium text-yellow-300">Symmetry Group:</span> Group G acting by isometries on M</li>
                <li><span className="font-medium text-green-300">Coherence Inner Product:</span> Selects canonical representations</li>
              </ul>
            </div>
            
            {activeTab === 'navier-stokes' && (
              <p className="text-sm mt-2">
                In fluid dynamics, these axioms lead to a natural embedding of velocity fields in the fiber algebra, with the Navier-Stokes equations emerging from the intrinsic differential operators.
              </p>
            )}
            
            {activeTab === 'number-theory' && (
              <p className="text-sm mt-2">
                In number theory, the same axioms yield an intrinsic embedding of natural numbers, unique factorization into intrinsic primes, and the spectral properties of the Prime Operator.
              </p>
            )}
            
            {activeTab === 'connection' && (
              <p className="text-sm mt-2">
                This unified framework reveals deep connections between seemingly disparate fields, suggesting a fundamental unity in mathematical structures underlying both discrete and continuous systems.
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between p-2 bg-slate-800 border-t border-slate-700">
        <button 
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md"
          onClick={() => setStep(prev => (prev - 1 + steps.length) % steps.length)}
        >
          Previous
        </button>
        
        <div className="flex space-x-1">
          {steps.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === step ? "bg-blue-500" : "bg-slate-600"
              }`}
              onClick={() => setStep(idx)}
            />
          ))}
        </div>
        
        <button 
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded-md"
          onClick={() => setStep(prev => (prev + 1) % steps.length)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PrimeFrameworkVisualization;