'use strict';
async function buildBirthdayCake() {
  const stage = document.querySelector('#cake-stage');
  const fallback = document.querySelector('#cake-fallback');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let THREE;
  try {
    // Les modules locaux nécessitent HTTP ; l’ouverture directe utilise le CDN.
    THREE = await import(location.protocol === 'file:'
      ? 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js'
      : './vendor/three.module.js');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 50);
    camera.position.set(3.4, 3.6, 6.8); camera.lookAt(0, 1.1, 0);
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.25;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', 'Gâteau en forme de pilon de poulet frit avec deux bougies formant le nombre 22');
    stage.append(renderer.domElement);
    scene.add(new THREE.HemisphereLight(0xfff8e9, 0x7c614b, 2.5));
    const key = new THREE.DirectionalLight(0xffedd5, 4); key.position.set(-3, 7, 5); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 4; key.shadow.camera.bottom = -4; key.shadow.normalBias = .025;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xde8ff2, 2); fill.position.set(3, 4, -3); scene.add(fill);
    const cake = new THREE.Group(); cake.rotation.y = -.25; scene.add(cake);
    function material(color, roughness = .7) { return new THREE.MeshStandardMaterial({color, roughness}); }
    const ivory = material('#E2E0D1', .35), lilac = material('#DE8FF2', .4), golden = material('#ba682b', .95), boneMaterial = material('#fff0d5', .55);
    function mesh(geometry, mat, position, scale, parent = cake) {
      const object = new THREE.Mesh(geometry, mat); object.position.set(...position); if (scale) object.scale.set(...scale); object.castShadow = true; object.receiveShadow = true; parent.add(object); return object;
    }
    mesh(new THREE.CylinderGeometry(2.35, 2.25, .12, 80), ivory, [0,.05,0]);
    const rim = mesh(new THREE.TorusGeometry(2.18,.065,12,90), lilac, [0,.12,0]); rim.rotation.x = Math.PI / 2;
    mesh(new THREE.CylinderGeometry(1.55,1.55,.07,64), lilac, [0,.14,0]);
    const sphere = new THREE.SphereGeometry(1,48,32);
    const meat = mesh(sphere, golden, [-.5,.86,0], [1.2,.7,.87]); meat.rotation.z = -.12;
    const taper = mesh(sphere, golden, [.5,.7,0], [.75,.43,.48]); taper.rotation.z = -.15;
    const bone = mesh(new THREE.CylinderGeometry(.15,.19,1.15,24), boneMaterial, [1.25,.63,0]); bone.rotation.z = Math.PI/2;
    mesh(sphere, boneMaterial, [1.88,.64,.13], [.26,.22,.19]);
    mesh(sphere, boneMaterial, [1.88,.64,-.13], [.26,.22,.19]);
    // Panure instanciée pour limiter le nombre d’appels de rendu.
    let seed = 23;
    function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    const count = 1200, crumbGeo = new THREE.IcosahedronGeometry(1,0);
    const crumbs = new THREE.InstancedMesh(crumbGeo, material('#d28a3a', 1), count);
    const dummy = new THREE.Object3D(), color = new THREE.Color();
    for (let i=0; i<count; i++) {
      const phi = Math.acos(2*random()-1), theta = random()*Math.PI*2;
      const small = i > 940;
      const rx = small ? .74 : 1.2, ry = small ? .43 : .7, rz = small ? .48 : .87;
      const centerX = small ? .5 : -.5, centerY = small ? .7 : .86;
      dummy.position.set(centerX + rx*Math.sin(phi)*Math.cos(theta), centerY + ry*Math.cos(phi), rz*Math.sin(phi)*Math.sin(theta));
      const size = .026 + random()*.045; dummy.scale.set(size*1.6,size,size*1.3);
      dummy.rotation.set(random()*3,random()*3,random()*3); dummy.updateMatrix(); crumbs.setMatrixAt(i,dummy.matrix);
      color.setHSL(.075 + random()*.035, .62 + random()*.15, .26 + random()*.23); crumbs.setColorAt(i,color);
    }
    crumbs.castShadow = true; crumbs.receiveShadow = true; cake.add(crumbs);
    const pipingPoints = Array.from({length:65}, (_,i) => { const a=i/64*Math.PI*2; return new THREE.Vector3(-.5+1.1*Math.cos(a),.32,.76*Math.sin(a)); });
    mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pipingPoints),96,.04,8,false), lilac, [0,0,0]);
    const candleGroup = new THREE.Group(); cake.add(candleGroup);
    function numberCandle(points, x) {
      const path = new THREE.CatmullRomCurve3(points.map(([px,py]) => new THREE.Vector3(px+x,py+1.48,.08)));
      mesh(new THREE.TubeGeometry(path,70,.085,12,false), lilac, [0,0,0], null, candleGroup);
      mesh(new THREE.CylinderGeometry(.035,.035,.3,12), ivory, [x,1.38,.08], null, candleGroup);
    }
    numberCandle([[-.22,.56],[-.2,.75],[0,.86],[.22,.77],[.22,.59],[0,.39],[-.22,.15],[-.2,0],[.22,0]],-.68);
    numberCandle([[-.22,.56],[-.2,.75],[0,.86],[.22,.77],[.22,.59],[0,.39],[-.22,.15],[-.2,0],[.22,0]],.02);
    const flames = new THREE.Group(); candleGroup.add(flames);
    [-.68,.02].forEach(x => {
      mesh(new THREE.CylinderGeometry(.012,.012,.12,8), material('#4d3221'), [x,2.4,.08], null, candleGroup);
      mesh(new THREE.SphereGeometry(1,16,16), new THREE.MeshBasicMaterial({color:'#ffb345'}), [x,2.56,.08], [.055,.14,.055], flames);
      mesh(new THREE.SphereGeometry(1,12,12), new THREE.MeshBasicMaterial({color:'#fff1be'}), [x,2.51,.1], [.027,.065,.027], flames);
    });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200,200), new THREE.ShadowMaterial({opacity:.12}));
    ground.rotation.x = -Math.PI/2; ground.position.y = -.035; ground.receiveShadow = true; scene.add(ground);
    function sizeScene() { const {width,height} = stage.getBoundingClientRect(); renderer.setSize(width,height); camera.aspect = width/height; camera.position.set(width<500 ? 4.2 : 3.4, width<500 ? 4.2 : 3.6, width<500 ? 8.6 : 6.8); camera.lookAt(0,1.15,0); camera.updateProjectionMatrix(); }
    new ResizeObserver(sizeScene).observe(stage); sizeScene();
    fallback.hidden = true;
    let inView = false, dragging = false, lastX = 0, rotationTarget = cake.rotation.y;
    new IntersectionObserver(entries => { inView=entries[0].isIntersecting; }, {rootMargin:'100px'}).observe(stage);
    renderer.domElement.addEventListener('pointerdown', event => { dragging=true; lastX=event.clientX; renderer.domElement.setPointerCapture(event.pointerId); });
    renderer.domElement.addEventListener('pointermove', event => { if (!dragging) return; rotationTarget += (event.clientX-lastX)*.012; lastX=event.clientX; });
    const endDrag = () => { dragging=false; };
    renderer.domElement.addEventListener('pointerup',endDrag); renderer.domElement.addEventListener('pointercancel',endDrag);
    document.querySelector('#rotate-left').addEventListener('click', () => { rotationTarget -= Math.PI/6; });
    document.querySelector('#rotate-right').addEventListener('click', () => { rotationTarget += Math.PI/6; });
    let blownOut = document.querySelector('#celebrate').dataset.blown === 'true';
    function updateFlames() { flames.visible=!blownOut; document.querySelector('#relight').hidden=!blownOut; renderer.render(scene,camera); }
    updateFlames();
    document.querySelector('#celebrate').addEventListener('click', () => { blownOut=true; updateFlames(); });
    document.querySelector('#relight').addEventListener('click', () => { blownOut=false; document.querySelector('#celebrate').dataset.blown='false'; document.querySelector('#celebration-message').textContent='Un autre vœu ? Les bougies sont rallumées ♡'; updateFlames(); });
    renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); fallback.hidden=false; document.querySelector('#cake-status').textContent='Le gâteau 3D a été interrompu. Recharge la page pour le retrouver.'; });
    let lastFrame = 0;
    renderer.setAnimationLoop(time => {
      if (!inView || document.hidden) return;
      const delta = Math.min((time-lastFrame)/1000,.04); lastFrame=time;
      if (!reducedMotion && !dragging) rotationTarget += delta*.075;
      cake.rotation.y = reducedMotion ? rotationTarget : cake.rotation.y+(rotationTarget-cake.rotation.y)*.12;
      if (!reducedMotion) flames.scale.y=1+Math.sin(time*.006)*.07;
      renderer.render(scene,camera);
    });
    renderer.render(scene,camera);
  } catch (error) {
    document.querySelector('#cake-status').textContent = 'Le gâteau 3D est indisponible dans ce navigateur. Essaie un navigateur récent avec la 3D activée.';
    document.querySelector('.cake-controls').hidden = true;
    console.warn('Gâteau 3D indisponible :', error);
  }
}
// La bibliothèque et le modèle ne chargent qu’à l’approche de la dernière section.
const cakeLoader = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) { cakeLoader.disconnect(); buildBirthdayCake(); }
}, {rootMargin: '500px'});
cakeLoader.observe(document.querySelector('#cake-stage'));
