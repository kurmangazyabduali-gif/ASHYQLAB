/**
 * AshyqLab — Interactive 3D Human Anatomy Engine
 * Powered by Three.js & GLTFLoader
 * Renders 'assets/human_anatomy.glb' with 360° rotation, anatomical hotspot pins,
 * medical X-Ray holographic mode, smooth camera transitions, and bilingual organ inspection.
 */

(function () {
    let scene, camera, renderer, controls;
    let modelGroup = null;
    let bodyMesh = null;
    let origMaterial = null;
    let pinsGroup = null;
    let scannerPlatform = null;
    let isInitialized = false;

    // State flags
    let autoRotate = true;
    let isXrayMode = false;
    let showPins = true;
    let isUserInteracting = false;
    let currentSelectedPin = null;

    // Camera animation targets (LERP)
    let targetCamPos = null;
    let targetLookAt = null;

    // Raycaster & interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredPin = null;

    // Hotspot coordinates mapped to centered human model (bounds: Y -0.5 to +0.5, Z -0.1 to +0.1)
    const ANATOMY_PINS = [
        {
            id: 'brain',
            icon: '🧠',
            name_kk: 'Бас миы',
            name_ru: 'Головной мозг',
            pos: [0, 0.42, 0.05],
            labelOffset: [0.14, 0.04, 0.03],
            focusCam: [0, 0.42, 0.52],
            focusTarget: [0, 0.42, 0]
        },
        {
            id: 'skull',
            icon: '💀',
            name_kk: 'Бас сүйек',
            name_ru: 'Череп',
            pos: [0, 0.46, 0.02],
            labelOffset: [-0.14, 0.04, 0.03],
            focusCam: [0, 0.46, 0.52],
            focusTarget: [0, 0.46, 0]
        },
        {
            id: 'lungs',
            icon: '🫁',
            name_kk: 'Өкпе',
            name_ru: 'Лёгкие',
            pos: [0.06, 0.23, 0.05],
            labelOffset: [0.15, 0.02, 0.03],
            focusCam: [0.04, 0.23, 0.62],
            focusTarget: [0.04, 0.23, 0]
        },
        {
            id: 'heart',
            icon: '❤️',
            name_kk: 'Жүрек',
            name_ru: 'Сердце',
            pos: [-0.03, 0.21, 0.06],
            labelOffset: [-0.15, 0.02, 0.04],
            focusCam: [-0.03, 0.21, 0.58],
            focusTarget: [-0.03, 0.21, 0]
        },
        {
            id: 'ribs',
            icon: '🩻',
            name_kk: 'Қабырғалар',
            name_ru: 'Грудная клетка',
            pos: [0, 0.19, 0.06],
            labelOffset: [0.15, -0.02, 0.03],
            focusCam: [0, 0.19, 0.65],
            focusTarget: [0, 0.19, 0]
        },
        {
            id: 'liver',
            icon: '🫀',
            name_kk: 'Бауыр',
            name_ru: 'Печень',
            pos: [0.05, 0.11, 0.06],
            labelOffset: [0.14, 0.01, 0.03],
            focusCam: [0.05, 0.11, 0.62],
            focusTarget: [0.05, 0.11, 0]
        },
        {
            id: 'stomach',
            icon: '🥣',
            name_kk: 'Асқазан',
            name_ru: 'Желудок',
            pos: [-0.04, 0.09, 0.06],
            labelOffset: [-0.14, 0.01, 0.03],
            focusCam: [-0.04, 0.09, 0.62],
            focusTarget: [-0.04, 0.09, 0]
        },
        {
            id: 'kidneys',
            icon: '🫘',
            name_kk: 'Бүйректер',
            name_ru: 'Почки',
            pos: [0.05, 0.05, -0.05],
            labelOffset: [0.14, 0.01, -0.03],
            focusCam: [0.05, 0.05, -0.62],
            focusTarget: [0.05, 0.05, 0]
        },
        {
            id: 'spine',
            icon: '🦴',
            name_kk: 'Омыртқа',
            name_ru: 'Позвоночник',
            pos: [0, 0.15, -0.06],
            labelOffset: [-0.14, 0.02, -0.03],
            focusCam: [0, 0.15, -0.65],
            focusTarget: [0, 0.15, 0]
        },
        {
            id: 'intestine',
            icon: '🧬',
            name_kk: 'Ішектер',
            name_ru: 'Кишечник',
            pos: [0, 0.00, 0.06],
            labelOffset: [0.14, 0.0, 0.03],
            focusCam: [0, 0.00, 0.62],
            focusTarget: [0, 0.00, 0]
        },
        {
            id: 'pelvis',
            icon: '🦴',
            name_kk: 'Жамбас',
            name_ru: 'Кости таза',
            pos: [0, -0.08, 0.03],
            labelOffset: [-0.14, 0.0, 0.02],
            focusCam: [0, -0.08, 0.68],
            focusTarget: [0, -0.08, 0]
        },
        {
            id: 'femur',
            icon: '🦵',
            name_kk: 'Ортан жілік',
            name_ru: 'Бедренная кость',
            pos: [0.07, -0.22, 0.03],
            labelOffset: [0.13, 0.0, 0.02],
            focusCam: [0.07, -0.22, 0.78],
            focusTarget: [0.07, -0.22, 0]
        }
    ];

    function getLang() {
        return localStorage.getItem('vsh-lang') || 'kk';
    }

    /**
     * Initializes the Three.js 3D viewport
     */
    function initAnatomy3D() {
        if (isInitialized) return;
        const container = document.getElementById('view3dContainer');
        const canvas = document.getElementById('anatomy3dCanvas');
        if (!container || !canvas) return;

        // 1. Scene
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x020617, 0.08);

        // 2. Camera
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || (window.innerHeight - 60);
        camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
        camera.position.set(0, 0, 1.8);
        camera.lookAt(0, 0, 0);

        // 3. WebGL Renderer
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (THREE.sRGBEncoding) renderer.outputEncoding = THREE.sRGBEncoding;
        if (THREE.ACESFilmicToneMapping) {
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.15;
        }

        // 4. OrbitControls
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.minDistance = 0.45;
            controls.maxDistance = 3.5;
            controls.maxPolarAngle = Math.PI - 0.05;
            controls.minPolarAngle = 0.05;
            controls.target.set(0, 0, 0);

            controls.addEventListener('start', () => { isUserInteracting = true; });
            controls.addEventListener('end', () => {
                setTimeout(() => { isUserInteracting = false; }, 800);
            });
        }

        // 5. Lighting
        setupLighting();

        // 6. Holographic Platform / Pedestal
        createPedestal();

        // 7. Load GLB Model
        modelGroup = new THREE.Group();
        scene.add(modelGroup);

        pinsGroup = new THREE.Group();
        modelGroup.add(pinsGroup);

        loadModel();

        // 8. Event Listeners
        window.addEventListener('resize', onWindowResize);
        canvas.addEventListener('mousemove', onCanvasMouseMove);
        canvas.addEventListener('click', onCanvasClick);
        canvas.addEventListener('touchstart', onCanvasTouchStart, { passive: true });

        // Bind HUD buttons
        bindHudControls();

        isInitialized = true;
        animate();
    }

    function setupLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        scene.add(ambientLight);

        // Key light
        const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.35);
        keyLight.position.set(3.5, 4.5, 3.5);
        scene.add(keyLight);

        // Fill light (medical cyan tint)
        const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.85);
        fillLight.position.set(-3.5, 2.5, -2.5);
        scene.add(fillLight);

        // Rim light (sharp back highlight)
        const rimLight = new THREE.DirectionalLight(0x00f3ff, 0.95);
        rimLight.position.set(0, 4.5, -4.0);
        scene.add(rimLight);

        // Subtle bottom up-light
        const bottomLight = new THREE.DirectionalLight(0x0284c7, 0.35);
        bottomLight.position.set(0, -3.5, 2.0);
        scene.add(bottomLight);
    }

    function createPedestal() {
        scannerPlatform = new THREE.Group();
        scannerPlatform.position.set(0, -0.52, 0);

        // Outer glowing ring
        const ringGeo = new THREE.RingGeometry(0.32, 0.35, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00f3ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2;
        scannerPlatform.add(ringMesh);

        // Inner dashed ring
        const innerRingGeo = new THREE.RingGeometry(0.20, 0.22, 32);
        const innerRingMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
        });
        const innerRingMesh = new THREE.Mesh(innerRingGeo, innerRingMat);
        innerRingMesh.rotation.x = Math.PI / 2;
        scannerPlatform.add(innerRingMesh);

        // Subtle ground grid
        const gridHelper = new THREE.GridHelper(1.2, 12, 0x00f3ff, 0x034a6e);
        gridHelper.position.y = -0.01;
        scannerPlatform.add(gridHelper);

        scene.add(scannerPlatform);
    }

    /**
     * Loads human_anatomy.glb (fallback: anatomy.glb)
     */
    function loadModel() {
        const loader = new THREE.GLTFLoader();
        const primaryUrl = 'assets/human_anatomy.glb';
        const fallbackUrl = 'assets/anatomy.glb';

        const updateProgress = (e) => {
            const bar = document.getElementById('view3dBarFill');
            const txt = document.getElementById('view3dLoadingText');
            if (e.lengthComputable && e.total > 0) {
                const pct = Math.min(100, Math.round((e.loaded / e.total) * 100));
                if (bar) bar.style.width = pct + '%';
                if (txt) {
                    const isKk = getLang() === 'kk';
                    txt.textContent = isKk ? `3D Модель жүктелуде... ${pct}%` : `Загрузка 3D модели... ${pct}%`;
                }
            }
        };

        const onModelLoaded = (gltf) => {
            const root = gltf.scene;

            // Traverse meshes and enhance materials
            root.traverse((child) => {
                if (child.isMesh) {
                    bodyMesh = child;
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        origMaterial = child.material.clone();
                        child.material.roughness = Math.max(0.25, child.material.roughness || 0.4);
                        child.material.metalness = Math.min(0.7, child.material.metalness || 0.1);
                        child.material.needsUpdate = true;
                    }
                }
            });

            // Center model: raw bounding box is [0, 1.0] in Y. Offset by -0.5 so center is at (0, 0, 0)
            root.position.set(0, -0.5, 0);
            modelGroup.add(root);

            // Create 3D Hotspot Pins
            buildAnatomyPins();

            // Fade out loader
            const loaderEl = document.getElementById('view3dLoader');
            if (loaderEl) {
                loaderEl.style.opacity = '0';
                setTimeout(() => { loaderEl.style.display = 'none'; }, 500);
            }

            console.log('✅ Human Anatomy 3D Model Loaded Successfully');
            if (typeof updateCounter === 'function') updateCounter();
        };

        const onModelError = (err) => {
            console.warn('Primary 3D GLB load failed, trying fallback...', err);
            loader.load(fallbackUrl, onModelLoaded, updateProgress, (fallbackErr) => {
                console.error('Failed to load 3D GLB model:', fallbackErr);
                const txt = document.getElementById('view3dLoadingText');
                if (txt) txt.textContent = 'Қате: 3D модель табылмады / Ошибка загрузки 3D';
            });
        };

        loader.load(primaryUrl, onModelLoaded, updateProgress, onModelError);
    }

    /**
     * Builds interactive 3D pins and billboard sprites
     */
    function buildAnatomyPins() {
        pinsGroup.clear();
        const lang = getLang();
        const isKk = lang === 'kk';

        ANATOMY_PINS.forEach((pin, index) => {
            const pinRoot = new THREE.Group();
            pinRoot.position.set(pin.pos[0], pin.pos[1], pin.pos[2]);

            // 1. Core Sphere
            const coreGeo = new THREE.SphereGeometry(0.012, 16, 16);
            const coreMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
            const coreMesh = new THREE.Mesh(coreGeo, coreMat);
            pinRoot.add(coreMesh);

            // 2. Pulsing Ring
            const ringGeo = new THREE.RingGeometry(0.018, 0.028, 24);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0x00f3ff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending
            });
            const ringMesh = new THREE.Mesh(ringGeo, ringMat);
            pinRoot.add(ringMesh);

            // 3. Connecting Leader Line
            const lineMat = new THREE.LineBasicMaterial({
                color: 0x00f3ff,
                transparent: true,
                opacity: 0.65,
                linewidth: 1.5
            });
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(pin.labelOffset[0], pin.labelOffset[1], pin.labelOffset[2])
            ]);
            const line = new THREE.Line(lineGeo, lineMat);
            pinRoot.add(line);

            // 4. Billboard Sprite Label
            const spriteCanvas = document.createElement('canvas');
            spriteCanvas.width = 380;
            spriteCanvas.height = 84;
            const ctx = spriteCanvas.getContext('2d');

            // Draw rounded pill container
            ctx.fillStyle = 'rgba(10, 25, 45, 0.88)';
            ctx.strokeStyle = '#00f3ff';
            ctx.lineWidth = 4;
            ctx.beginPath();
            const r = 24, w = 370, h = 76, x = 5, y = 4;
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Glow accent
            ctx.fillStyle = '#00f3ff';
            ctx.beginPath();
            ctx.arc(36, 42, 10, 0, Math.PI * 2);
            ctx.fill();

            // Text
            const pinName = isKk ? pin.name_kk : pin.name_ru;
            ctx.font = 'bold 30px "Roboto", Arial, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(`${pin.icon}  ${pinName}`, 56, 52);

            const spriteTex = new THREE.CanvasTexture(spriteCanvas);
            const spriteMat = new THREE.SpriteMaterial({
                map: spriteTex,
                transparent: true,
                depthTest: false
            });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.scale.set(0.18, 0.040, 1);
            sprite.position.set(pin.labelOffset[0], pin.labelOffset[1], pin.labelOffset[2]);
            pinRoot.add(sprite);

            // Hit Sphere for Raycaster
            const hitGeo = new THREE.SphereGeometry(0.035, 12, 12);
            const hitMat = new THREE.MeshBasicMaterial({ visible: false });
            const hitMesh = new THREE.Mesh(hitGeo, hitMat);
            hitMesh.position.set(pin.labelOffset[0], pin.labelOffset[1], pin.labelOffset[2]);
            pinRoot.add(hitMesh);

            // Store metadata on group
            pinRoot.userData = {
                id: pin.id,
                pinData: pin,
                coreMesh,
                ringMesh,
                sprite,
                hitMesh,
                index
            };

            pinsGroup.add(pinRoot);
        });
    }

    /**
     * Mouse Move / Hover Handler
     */
    function onCanvasMouseMove(e) {
        if (!camera || !renderer) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Raycast against pin hit targets & sprites
        const hitObjects = [];
        if (showPins && pinsGroup) {
            pinsGroup.children.forEach((pGroup) => {
                if (pGroup.userData.hitMesh) hitObjects.push(pGroup.userData.hitMesh);
                if (pGroup.userData.sprite) hitObjects.push(pGroup.userData.sprite);
                if (pGroup.userData.coreMesh) hitObjects.push(pGroup.userData.coreMesh);
            });
        }

        const intersects = raycaster.intersectObjects(hitObjects, false);
        const canvas = renderer.domElement;

        if (intersects.length > 0) {
            canvas.style.cursor = 'pointer';
            const hitGroup = intersects[0].object.parent;
            if (hitGroup && hitGroup.userData) {
                hoveredPin = hitGroup.userData;
            }
        } else {
            canvas.style.cursor = 'grab';
            hoveredPin = null;
        }
    }

    /**
     * Click on 3D canvas (Pins or Body Mesh)
     */
    function onCanvasClick(e) {
        if (!camera || !renderer) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // 1. Check Pins first
        if (showPins && pinsGroup) {
            const pinTargets = [];
            pinsGroup.children.forEach((pGroup) => {
                if (pGroup.userData.hitMesh) pinTargets.push(pGroup.userData.hitMesh);
                if (pGroup.userData.sprite) pinTargets.push(pGroup.userData.sprite);
                if (pGroup.userData.coreMesh) pinTargets.push(pGroup.userData.coreMesh);
            });

            const pinIntersects = raycaster.intersectObjects(pinTargets, false);
            if (pinIntersects.length > 0) {
                const hitGroup = pinIntersects[0].object.parent;
                if (hitGroup && hitGroup.userData) {
                    select3DOrgan(hitGroup.userData.id);
                    return;
                }
            }
        }

        // 2. Check direct click on human body mesh
        if (bodyMesh) {
            const bodyIntersects = raycaster.intersectObject(bodyMesh, false);
            if (bodyIntersects.length > 0) {
                const hitPoint = bodyIntersects[0].point;
                // Find closest anatomical organ pin
                let closestPin = null;
                let minDist = Infinity;
                ANATOMY_PINS.forEach((pin) => {
                    const pinWorldPos = new THREE.Vector3(...pin.pos);
                    pinWorldPos.applyMatrix4(modelGroup.matrixWorld);
                    const dist = pinWorldPos.distanceTo(hitPoint);
                    if (dist < minDist) {
                        minDist = dist;
                        closestPin = pin;
                    }
                });

                if (closestPin && minDist < 0.28) {
                    select3DOrgan(closestPin.id);
                }
            }
        }
    }

    function onCanvasTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            onCanvasMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
            onCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
        }
    }

    /**
     * Selects an organ in 3D: flies camera, updates left dashboard, plays sound
     */
    function select3DOrgan(id) {
        const pin = ANATOMY_PINS.find(p => p.id === id);
        if (!pin) return;

        currentSelectedPin = id;

        // Smooth camera glide
        targetCamPos = new THREE.Vector3(...pin.focusCam);
        targetLookAt = new THREE.Vector3(...pin.focusTarget);

        // Highlight selected pin
        if (pinsGroup) {
            pinsGroup.children.forEach((pGroup) => {
                const isSel = pGroup.userData.id === id;
                if (pGroup.userData.coreMesh) {
                    pGroup.userData.coreMesh.material.color.setHex(isSel ? 0xfacc15 : 0x00f3ff);
                }
            });
        }

        // Add to scanned set
        if (typeof scannedItems !== 'undefined') {
            scannedItems.add(id);
        }

        // Sound effect
        if (typeof playSnd === 'function') {
            playSnd('success');
        }

        // Show data on dashboard
        if (typeof showData === 'function') {
            showData(id);
        }

        // Update counter
        if (typeof updateCounter === 'function') {
            updateCounter();
        }
    }

    /**
     * Focus camera on a designated anatomical region
     */
    window.focus3DRegion = function (region) {
        // UI button active toggle
        document.querySelectorAll('.focus-btn').forEach(b => b.classList.remove('active'));
        if (event && event.target) event.target.classList.add('active');

        if (typeof playSnd === 'function') playSnd('tick');

        switch (region) {
            case 'head':
                targetCamPos = new THREE.Vector3(0, 0.42, 0.55);
                targetLookAt = new THREE.Vector3(0, 0.42, 0);
                if (typeof showData === 'function') showData('brain');
                break;
            case 'chest':
                targetCamPos = new THREE.Vector3(0, 0.21, 0.65);
                targetLookAt = new THREE.Vector3(0, 0.21, 0);
                if (typeof showData === 'function') showData('heart');
                break;
            case 'abdomen':
                targetCamPos = new THREE.Vector3(0, 0.06, 0.65);
                targetLookAt = new THREE.Vector3(0, 0.06, 0);
                if (typeof showData === 'function') showData('stomach');
                break;
            case 'legs':
                targetCamPos = new THREE.Vector3(0, -0.22, 0.82);
                targetLookAt = new THREE.Vector3(0, -0.22, 0);
                if (typeof showData === 'function') showData('femur');
                break;
            case 'full':
            default:
                targetCamPos = new THREE.Vector3(0, 0, 1.8);
                targetLookAt = new THREE.Vector3(0, 0, 0);
                break;
        }
    };

    /**
     * HUD Controls Binding
     */
    function bindHudControls() {
        const btnRotate = document.getElementById('btnToggleRotate');
        if (btnRotate) {
            btnRotate.onclick = () => {
                autoRotate = !autoRotate;
                btnRotate.classList.toggle('active', autoRotate);
                if (typeof playSnd === 'function') playSnd('tick');
            };
            btnRotate.classList.toggle('active', autoRotate);
        }

        const btnXray = document.getElementById('btnToggleXray');
        if (btnXray) {
            btnXray.onclick = () => {
                toggleXrayMode();
                if (typeof playSnd === 'function') playSnd('switch');
            };
        }

        const btnPins = document.getElementById('btnTogglePins');
        if (btnPins) {
            btnPins.onclick = () => {
                showPins = !showPins;
                if (pinsGroup) pinsGroup.visible = showPins;
                btnPins.classList.toggle('active', showPins);
                if (typeof playSnd === 'function') playSnd('tick');
            };
            btnPins.classList.toggle('active', showPins);
        }

        const btnReset = document.getElementById('btnResetCam');
        if (btnReset) {
            btnReset.onclick = () => {
                targetCamPos = new THREE.Vector3(0, 0, 1.8);
                targetLookAt = new THREE.Vector3(0, 0, 0);
                if (modelGroup) modelGroup.rotation.y = 0;
                document.querySelectorAll('.focus-btn').forEach(b => b.classList.remove('active'));
                const btnFull = document.querySelector('.focus-btn:last-child');
                if (btnFull) btnFull.classList.add('active');
                if (typeof playSnd === 'function') playSnd('tick');
            };
        }
    }

    /**
     * Toggles futuristic glowing holographic X-Ray mode
     */
    function toggleXrayMode() {
        if (!bodyMesh) return;
        isXrayMode = !isXrayMode;

        const btnXray = document.getElementById('btnToggleXray');
        if (btnXray) btnXray.classList.toggle('active', isXrayMode);

        if (isXrayMode) {
            bodyMesh.material = new THREE.MeshStandardMaterial({
                color: 0x00f3ff,
                wireframe: true,
                emissive: 0x005577,
                emissiveIntensity: 0.85,
                transparent: true,
                opacity: 0.75,
                roughness: 0.2
            });
        } else if (origMaterial) {
            bodyMesh.material = origMaterial;
        }
    }

    function onWindowResize() {
        const container = document.getElementById('view3dContainer');
        if (!container || !camera || !renderer) return;

        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || (window.innerHeight - 60);

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    }

    /**
     * Main Animation Loop (60 FPS)
     */
    function animate() {
        requestAnimationFrame(animate);

        const time = performance.now() * 0.001;

        // Auto-rotation when user is not dragging
        if (autoRotate && !isUserInteracting && modelGroup && !targetCamPos) {
            modelGroup.rotation.y += 0.004;
        }

        // Platform subtle spin
        if (scannerPlatform) {
            scannerPlatform.rotation.y -= 0.002;
        }

        // Camera Smooth LERP interpolation
        if (targetCamPos && camera) {
            camera.position.lerp(targetCamPos, 0.08);
            if (camera.position.distanceTo(targetCamPos) < 0.005) {
                camera.position.copy(targetCamPos);
                targetCamPos = null;
            }
        }

        if (targetLookAt && controls) {
            controls.target.lerp(targetLookAt, 0.08);
            if (controls.target.distanceTo(targetLookAt) < 0.005) {
                controls.target.copy(targetLookAt);
                targetLookAt = null;
            }
        }

        // Animate Pin outer rings (pulsing scale & opacity)
        if (pinsGroup && showPins) {
            pinsGroup.children.forEach((pGroup) => {
                if (pGroup.userData.ringMesh) {
                    const idx = pGroup.userData.index || 0;
                    const pulse = 1.0 + Math.sin(time * 3 + idx) * 0.18;
                    pGroup.userData.ringMesh.scale.set(pulse, pulse, 1);
                    pGroup.userData.ringMesh.rotation.z += 0.01;

                    // If scanned, ring glows green
                    const isScanned = typeof scannedItems !== 'undefined' && scannedItems.has(pGroup.userData.id);
                    if (isScanned && pGroup.userData.id !== currentSelectedPin) {
                        pGroup.userData.ringMesh.material.color.setHex(0x10b981);
                        pGroup.userData.coreMesh.material.color.setHex(0x10b981);
                    }
                }
            });
        }

        if (controls) controls.update();
        if (renderer && scene && camera) renderer.render(scene, camera);
    }

    // Expose Global API for anatomy.html
    window.initAnatomy3D = initAnatomy3D;
    window.select3DOrgan = select3DOrgan;
    window.onWindowResize3D = onWindowResize;
    window.refresh3DPinLabels = buildAnatomyPins;
    window.ANATOMY_3D_COUNT = ANATOMY_PINS.length;
})();
