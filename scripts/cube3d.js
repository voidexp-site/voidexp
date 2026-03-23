//Script creato su Three.js

/**
 * cube3d.js
 * Cubo 3D interattivo caricato da GLB (Blockbench) — sidebar per ogni faccia
 *
 * DIPENDENZE (nel tuo HTML, prima di questo script):
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
 *   <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js"></script>
 *
 * UTILIZZO:
 *   <div id="cube-container"></div>
 *   <script src="cube3d.js"></script>
 *
 * STRUTTURA MODELLO ATTESA:
 *   Group "sky1"        → mesh della faccia 1
 *   Group "sky2"        → mesh della faccia 2
 *   Group "sky3"        → mesh della faccia 3
 *   Group "sky4"        → mesh della faccia 4
 *   Group "sky5"        → mesh della faccia 5
 *   Group "MiniSkybase0"→ mesh della faccia 6
 */

(function () {

  // ─── CONFIGURAZIONE ────────────────────────────────────────────────────────

  const CONTAINER_ID      = 'cube-container';
  const MODEL_PATH        = '3DskyboxModel.glb';
  const AUTO_ROTATE_SPEED = 0;
  const DRAG_THRESHOLD    = 6;

  // Mappa: nome gruppo Blockbench → dati sidebar
  const FACES = {
    'sky1': {
      label:   'SKY 1',
      
      content: `
        <h2>Skybase 1</h2>
        <p>Status: Operational</p>
        <p>----------------------------</p>
        <p>REACTORS-STATUS</p>
        <ul>
          <li>R1 = <i class="green">online</i> ❲Powering: Sky1❳</li>
          <li>R2 = <i class="green">online</i> ❲Powering: Sky2❳</li>
          <li>R3 = <i class="green">online</i> ❲Powering: Sky4❳</li>
          <li>R4 = <i class="green">online</i> ❲Powering: Sky4❳</li>
          <li>R5 = <i class="green">online</i> ❲Powering: Sky5❳</li>
          <li>R6 = <i class="green">online</i> ❲Powering: Sky0❳</li>
          <li>R7 = <i class="green">online</i> ❲Powering: Sky3❳</li>
        </ul>
        <p>SKYBASE-ID: <i class="purple">1143167351636551</i></p>
      `
    },
    'sky2': {
      label:   'SKY 2',
      
      content: `
        <h2>Skybase 2</h2>
        <p>Status: Operational</p>
        <p>----------------------------</p>
        <p>A-Sync Research Facility Status: All Right</p>
        <p>SKYBASE-ID: <i class="purple">1456363613616636</i></p>
      `
    },
    'sky3': {
      label:   'SKY 3',
      
      content: `
        <h2>Skybase 3</h2>
        <p>Status: Operational</p>
        <p>----------------------------</p>
        <p>Reactor Status: <i class="green">online</i></p>
        <p>VOID-CONTAMINATE</p>
        <p>Status: Online, Contained</p>
        <p>SKYBASE-ID: <i class="purple">1316316371787336</i></p>
      `
    },
    'sky4': {
      label:   'SKY 4',
      
      content: `
        <h2>Skybase 4</h2>
        <p>Status: Operational</p>
        <p>----------------------------</p>
        <p>SKYBASE-ID: <i class="purple">0910931931092917</i></p>
      `
    },
    'sky5': {
      label:   'SKY 5',
      
      content: `
        <h2>Skybase 5</h2>
        <p>Status: Operational</p>
        <p>----------------------------</p>
        <p>Admins Online 3/3</p>
        <p>SKYBASE-ID: <i class="purple">1617891330189839</i></p>
      `
    },
    'MiniSkybase0': {
      label:   'Sky 0',
      
      content: `
        <h2>Skybase 0</h2>
        <p>Status: Operational</p>
        <p>----------------------------</p>
        <p>SKYBASE-ID: <i class="purple">1289193881939881</i></p>
        
        <h2>The Void Bridge</h2>
        <p>Status: [ <i class="gray">-NRML</i> <i class="green">5-VOID</i> ]</p>
        <p>----------------------------</p>

      `
    },
  };

  // ─── CSS ──────────────────────────────────────────────────────────────────

  const css = `
    #cube-container {
      position: relative;
      width: 100%;
      height: 520px;
      background: url('images/skybox-background.png') center/cover no-repeat;
      border-radius: 12px;
      overflow: hidden;
      cursor: grab;
      user-select: none;
    }
    #cube-container.grabbing { cursor: grabbing; }
    #cube-container canvas   { display: block; }

    #cube-loading {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      color: rgba(255,255,255,0.4);
      font-family: 'Courier New', monospace;
      font-size: 13px; letter-spacing: 2px;
      gap: 16px; pointer-events: none;
    }
    #cube-loading-bar {
      width: 120px; height: 2px;
      background: rgba(255,255,255,0.1);
      border-radius: 2px; overflow: hidden;
    }
    #cube-loading-fill {
      height: 100%; background: rgba(255,255,255,0.4);
      width: 0%; transition: width 0.2s;
    }

    #cube-face-tooltip {
      position: absolute; bottom: 18px; left: 50%;
      transform: translateX(-50%);
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.15);
      color: #fff; padding: 6px 16px;
      border-radius: 20px;
      font-family: 'Courier New', monospace;
      font-size: 12px; letter-spacing: 2px;
      pointer-events: none; opacity: 0;
      transition: opacity 0.25s; white-space: nowrap;
    }
    #cube-face-tooltip.visible { opacity: 1; }

    #cube-click-hint {
      position: absolute; top: 14px; left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.75);
      font-family: 'Courier New', monospace;
      font-size: 11px; letter-spacing: 1px;
      pointer-events: none; white-space: nowrap;
    }

    #cube-sidebar {
      position: fixed; top: 0; right: -420px;
      width: 380px; max-width: 90vw; height: 100%;
      background: #131313;
      border-left: 5px solid #720cff;
      z-index: 9999; display: flex; flex-direction: column;
      transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
    }
    #cube-sidebar.open { right: 0; }

    #cube-sidebar-header {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 24px 28px;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    
    #cube-sidebar-title {
      font-family: 'Courier New', monospace;
      font-size: 13px; letter-spacing: 3px;
      color: #fff; text-transform: uppercase; flex: 1;
    }
    #cube-sidebar-close {
      background: none;
      border: 1px solid rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.5);
      border-radius: 6px; width: 32px; height: 32px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; font-size: 16px; transition: all 0.2s;
    }
    #cube-sidebar-close:hover {
      border-color: rgba(255,255,255,0.3); color: #fff;
    }
    #cube-sidebar-body {
      flex: 1; overflow-y: auto; padding: 28px;
      color: rgba(255,255,255,0.7);
      font-family: sans-serif; font-size: 15px; line-height: 1.7;
    }
    #cube-sidebar-body h2 {
      color: #fff; margin-top: 0;
      font-size: 22px; font-weight: 600;
    }
    #cube-sidebar-body::-webkit-scrollbar { width: 4px; }
    #cube-sidebar-body::-webkit-scrollbar-track { background: transparent; }
    #cube-sidebar-body::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1); border-radius: 2px;
    }
#cube-sidebar-accent {
  margin-right: 14px;
  font-size: 18px;
  flex-shrink: 0;
}
    #cube-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9998; opacity: 0; pointer-events: none;
      transition: opacity 0.35s;
    }
    #cube-overlay.visible { opacity: 1; pointer-events: all; }
  `;

  // ─── INIT DOM ─────────────────────────────────────────────────────────────

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  const container = document.getElementById(CONTAINER_ID);
  if (!container) {
    console.error(`cube3d.js: #${CONTAINER_ID} non trovato.`);
    return;
  }

  container.innerHTML += `
    <div id="cube-loading">
      <span>CARICAMENTO MODELLO</span>
      <div id="cube-loading-bar"><div id="cube-loading-fill"></div></div>
    </div>
    <div id="cube-click-hint">trascina per ruotare · clicca una faccia per aprirla</div>
    <div id="cube-face-tooltip"></div>
  `;

  document.body.insertAdjacentHTML('beforeend', `
    <div id="cube-overlay"></div>
    <div id="cube-sidebar">
      <div id="cube-sidebar-header">
        <div id="cube-sidebar-accent">❒</div>
        <div id="cube-sidebar-title">—</div>
        <button id="cube-sidebar-close">✕</button>
      </div>
      <div id="cube-sidebar-body"></div>
    </div>
  `);

  // ─── THREE.JS ─────────────────────────────────────────────────────────────

  const W = container.clientWidth;
  const H = container.clientHeight;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild(renderer.domElement);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 6);

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);
  const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
  fillLight.position.set(-5, -3, -5);
  scene.add(fillLight);

  // ─── CARICAMENTO GLB ──────────────────────────────────────────────────────

  let modelRoot = null;

  // meshMap: mesh Object3D → nome gruppo (es. "sky1", "MiniSkybase0")
  const meshMap = new Map();

  const loadingEl = document.getElementById('cube-loading');
  const fillEl    = document.getElementById('cube-loading-fill');

  const loader = new THREE.GLTFLoader();
  loader.load(
    MODEL_PATH,

    function (gltf) {
      modelRoot = gltf.scene;
      scene.add(modelRoot);
      
      
modelRoot.rotation.y = 20 * (Math.PI / 180);  // 45°
modelRoot.rotation.x = Math.PI / 4;  // 45°

      // Centra e scala automaticamente
      const box    = new THREE.Box3().setFromObject(modelRoot);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      const scale  = 3.5 / Math.max(size.x, size.y, size.z);
      modelRoot.scale.setScalar(scale);
      modelRoot.position.sub(center.multiplyScalar(scale));

      // Per ogni mesh, risale i parent finché trova un gruppo in FACES
      modelRoot.traverse(function (obj) {
        if (!obj.isMesh) return;
        let p = obj.parent;
        while (p) {
          if (FACES[p.name]) {
            meshMap.set(obj, p.name);
            return;
          }
          p = p.parent;
        }
      });

      loadingEl.style.display = 'none';

      // Debug
      console.log('cube3d.js — modello caricato');
      const found = {};
      meshMap.forEach((groupName) => {
        found[groupName] = (found[groupName] || 0) + 1;
      });
      Object.keys(FACES).forEach(name => {
        console.log(' ', name + ':', found[name] ? found[name] + ' mesh trovati' : 'NESSUNO — controlla il nome del gruppo');
      });
    },

    function (xhr) {
      if (xhr.lengthComputable)
        fillEl.style.width = ((xhr.loaded / xhr.total) * 100) + '%';
    },

    function (err) {
      loadingEl.innerHTML = `<span style="color:#ff4444">ERRORE — controlla che "${MODEL_PATH}" esista</span>`;
      console.error('cube3d.js: errore caricamento GLB:', err);
    }
  );

  // ─── RAYCASTING ───────────────────────────────────────────────────────────

  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2();
  const tooltip   = document.getElementById('cube-face-tooltip');

  function getNDC(clientX, clientY) {
    const r = container.getBoundingClientRect();
    return {
      x:  ((clientX - r.left) / r.width)  * 2 - 1,
      y: -((clientY - r.top)  / r.height) * 2 + 1,
    };
  }

  function detectHit(clientX, clientY) {
    if (!modelRoot) return null;

    const ndc = getNDC(clientX, clientY);
    mouse.set(ndc.x, ndc.y);
    raycaster.setFromCamera(mouse, camera);

    const allMeshes = [];
    modelRoot.traverse(o => { if (o.isMesh) allMeshes.push(o); });

    const hits = raycaster.intersectObjects(allMeshes, false);
    if (!hits.length) return null;

    const groupName = meshMap.get(hits[0].object);
    return groupName ? FACES[groupName] : null;
  }

  // ─── DRAG + CLICK ─────────────────────────────────────────────────────────

  let isDragging = false;
  let didDrag    = false;
  let prevX = 0, prevY = 0;
  const ROT  = 0.008;
  let lastLabel = '';

  container.addEventListener('mousedown', e => {
    isDragging = true;
    didDrag    = false;
    prevX = e.clientX; prevY = e.clientY;
    container.classList.add('grabbing');
  });

  window.addEventListener('mousemove', e => {
    if (isDragging) {
      const dx = e.clientX - prevX, dy = e.clientY - prevY;
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) didDrag = true;
      if (modelRoot) {
        modelRoot.rotation.y += dx * ROT;
        modelRoot.rotation.x += dy * ROT;
      }
      prevX = e.clientX; prevY = e.clientY;
      tooltip.classList.remove('visible');
      lastLabel = '';
    } else {
      const fd    = detectHit(e.clientX, e.clientY);
      const label = fd ? fd.label : '';
      if (label !== lastLabel) {
        lastLabel = label;
        tooltip.textContent = label;
        tooltip.classList.toggle('visible', !!label);
      }
    }
  });

  window.addEventListener('mouseup', e => {
    if (isDragging) {
      if (!didDrag) {
        const fd = detectHit(e.clientX, e.clientY);
        if (fd) openSidebar(fd);
      }
      isDragging = false;
      container.classList.remove('grabbing');
    }
  });

  window.addEventListener('mouseleave', () => {
    isDragging = false;
    container.classList.remove('grabbing');
  });

  // Touch
  container.addEventListener('touchstart', e => {
  const t = e.touches[0];
  prevX = t.clientX; prevY = t.clientY;
  isDragging = true; touchMoved = false;
}, { passive: true });

container.addEventListener('touchmove', e => {
  const t  = e.touches[0];
  const dx = t.clientX - prevX, dy = t.clientY - prevY;
  if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) touchMoved = true;
  if (modelRoot) {
    modelRoot.rotation.y += dx * ROT;
    modelRoot.rotation.x += dy * ROT;
  }
  prevX = t.clientX; prevY = t.clientY;
}, { passive: true });

container.addEventListener('touchend', e => {
  e.preventDefault();
  const t  = e.changedTouches[0];
  if (!touchMoved) {
    const fd = detectHit(t.clientX, t.clientY);
    if (fd) openSidebar(fd);
  }
  isDragging = false;
  container.classList.remove('grabbing');
});

  // ─── SIDEBAR ──────────────────────────────────────────────────────────────

  const sidebar = document.getElementById('cube-sidebar');
  const overlay = document.getElementById('cube-overlay');
  const sTitle  = document.getElementById('cube-sidebar-title');
  const sAccent = document.getElementById('cube-sidebar-accent');
  const sBody   = document.getElementById('cube-sidebar-body');
  const sClose  = document.getElementById('cube-sidebar-close');

  function openSidebar(fd) {
    sTitle.textContent       = fd.label;
    sAccent.style.background = fd.color;
    sBody.innerHTML          = fd.content;
    sidebar.classList.add('open');
    overlay.classList.add('visible');
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  }

  sClose.addEventListener('click',  closeSidebar);
  overlay.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

  // ─── RESIZE ───────────────────────────────────────────────────────────────

  window.addEventListener('resize', () => {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  // ─── LOOP ─────────────────────────────────────────────────────────────────

  function animate() {
    requestAnimationFrame(animate);
    if (!isDragging && AUTO_ROTATE_SPEED > 0 && modelRoot)
      modelRoot.rotation.y += AUTO_ROTATE_SPEED;
    renderer.render(scene, camera);
  }

  animate();

})();
