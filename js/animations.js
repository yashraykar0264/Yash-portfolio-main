const laserCursor = document.getElementById("laserCursor");
const particleField = document.getElementById("particleField");
const typingLine = document.getElementById("typingLine");

if (window.matchMedia("(pointer: fine)").matches && window.innerWidth > 680) {
  document.body.classList.add("enhanced-cursor");
}

const typingText = window.portfolioData.hero.typingText;
let typingIndex = 0;
function typeRole() {
  typingLine.textContent = typingText.slice(0, typingIndex);
  typingIndex = typingIndex >= typingText.length ? 0 : typingIndex + 1;
  setTimeout(typeRole, typingIndex === 0 ? 900 : 70);
}
typeRole();

let lastTrail = 0;
document.addEventListener("mousemove", (event) => {
  if (laserCursor) {
    laserCursor.style.left = event.clientX + "px";
    laserCursor.style.top = event.clientY + "px";
  }
  const now = performance.now();
  if (now - lastTrail > 38 && window.innerWidth > 680) {
    const dot = document.createElement("span");
    dot.className = "cursor-dot";
    dot.style.left = event.clientX + "px";
    dot.style.top = event.clientY + "px";
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 680);
    lastTrail = now;
  }
});

const particleCount = window.innerWidth <= 680 ? 44 : 68;
for (let i = 0; i < particleCount; i += 1) {
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.setProperty("--duration", 9 + Math.random() * 18 + "s");
  particle.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
  particle.style.animationDelay = -Math.random() * 20 + "s";
  particleField.appendChild(particle);
}

if (window.THREE) {
  const canvas = document.getElementById("spaceCanvas");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.05, 0.28, 140, 18),
    new THREE.MeshBasicMaterial({ color: 0x41ead4, wireframe: true, transparent: true, opacity: 0.42 })
  );
  scene.add(knot);

  const starGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(3000 * 3);
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] = (Math.random() - 0.5) * 34;
    positions[i + 1] = (Math.random() - 0.5) * 34;
    positions[i + 2] = (Math.random() - 0.5) * 34;
  }
  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({ color: 0xff5d8f, size: 0.018, transparent: true, opacity: 0.78 })
  );
  scene.add(stars);

  function layoutSpaceScene() {
    const isMobile = window.innerWidth <= 680;
    const isTablet = window.innerWidth <= 1060;
    knot.visible = !isMobile;
    knot.position.x = isTablet ? 1.6 : 2.05;
    knot.position.y = isTablet ? -0.15 : 0.05;
    knot.scale.setScalar(isTablet ? 0.82 : 1);
  }
  layoutSpaceScene();

  function animateSpace() {
    knot.rotation.x += 0.004;
    knot.rotation.y += 0.007;
    stars.rotation.y += 0.0009;
    renderer.render(scene, camera);
    requestAnimationFrame(animateSpace);
  }
  animateSpace();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    layoutSpaceScene();
  });
}


