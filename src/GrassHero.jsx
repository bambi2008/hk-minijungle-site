import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const MAX_GUSTS = 12;

export function GrassHero({ locale }) {
  const hostRef = useRef(null);
  const audioApiRef = useRef(null);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.tabIndex = -1;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x66735f, 0.024);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 140);
    camera.position.set(0, 3.65, 8.6);
    const cameraLook = new THREE.Vector3(0, 1.25, -18);
    camera.lookAt(cameraLook);

    const groundGeometry = new THREE.PlaneGeometry(90, 100, 1, 1);
    const groundMaterial = new THREE.ShaderMaterial({
      vertexShader: `varying vec3 vWorld; void main(){ vec4 w=modelMatrix*vec4(position,1.0); vWorld=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `
        precision highp float;
        varying vec3 vWorld;
        float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
        void main(){
          float n=hash(floor(vWorld.xz*2.2));
          vec3 nearColor=vec3(.075,.145,.085);
          vec3 farColor=vec3(.22,.31,.19);
          float distanceFade=smoothstep(4.0,78.0,-vWorld.z);
          vec3 color=mix(nearColor,farColor,distanceFade)+(n-.5)*.025;
          gl_FragColor=vec4(color,1.0);
        }
      `,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.025, -38);
    scene.add(ground);

    const bladeCount = window.innerWidth < 760 ? 68000 : 132000;
    const bladePositions = [];
    const bladeUvs = [];
    const bladeIndices = [];
    const levels = [0, 0.12, 0.25, 0.38, 0.52, 0.66, 0.79, 0.9, 1];
    const bladeWidths = [1, 1, 0.97, 0.9, 0.8, 0.67, 0.5, 0.3, 0];
    for (let levelIndex = 0; levelIndex < levels.length; levelIndex += 1) {
      const y = levels[levelIndex];
      const taper = bladeWidths[levelIndex];
      bladePositions.push(-0.5 * taper, y, 0, 0.5 * taper, y, 0);
      bladeUvs.push(0, y, 1, y);
      if (levelIndex < levels.length - 1) {
        const base = levelIndex * 2;
        bladeIndices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    }

    const bladeGeometry = new THREE.InstancedBufferGeometry();
    bladeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(bladePositions, 3));
    bladeGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(bladeUvs, 2));
    bladeGeometry.setIndex(bladeIndices);
    bladeGeometry.instanceCount = bladeCount;

    const offsets = new Float32Array(bladeCount * 3);
    const scales = new Float32Array(bladeCount * 2);
    const yaws = new Float32Array(bladeCount);
    const phases = new Float32Array(bladeCount);
    const tones = new Float32Array(bladeCount);
    const flexes = new Float32Array(bladeCount);
    const leans = new Float32Array(bladeCount * 2);
    let randomSeed = 0x9185b6d2;
    const random = () => {
      randomSeed ^= randomSeed << 13;
      randomSeed ^= randomSeed >>> 17;
      randomSeed ^= randomSeed << 5;
      return (randomSeed >>> 0) / 4294967296;
    };
    for (let index = 0; index < bladeCount; index += 1) {
      const zRatio = Math.pow(random(), 0.96);
      const z = 8 - zRatio * 84;
      const spread = 28 + zRatio * 17;
      const x = (random() - 0.5) * spread * 2;
      const y = Math.sin(x * 0.12) * 0.08 + Math.sin(z * 0.09) * 0.1;
      offsets[index * 3] = x;
      offsets[index * 3 + 1] = y;
      offsets[index * 3 + 2] = z;
      scales[index * 2] = 0.026 + random() * 0.046;
      scales[index * 2 + 1] = 0.45 + random() * 0.79;
      yaws[index] = random() * Math.PI * 2;
      phases[index] = random() * Math.PI * 2;
      tones[index] = random();
      flexes[index] = 0.98 + Math.pow(random(), 0.72) * 1.18;
      leans[index * 2] = (random() - 0.5) * 0.22;
      leans[index * 2 + 1] = (random() - 0.5) * 0.18;
    }
    bladeGeometry.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
    bladeGeometry.setAttribute("aScale", new THREE.InstancedBufferAttribute(scales, 2));
    bladeGeometry.setAttribute("aYaw", new THREE.InstancedBufferAttribute(yaws, 1));
    bladeGeometry.setAttribute("aPhase", new THREE.InstancedBufferAttribute(phases, 1));
    bladeGeometry.setAttribute("aTone", new THREE.InstancedBufferAttribute(tones, 1));
    bladeGeometry.setAttribute("aFlex", new THREE.InstancedBufferAttribute(flexes, 1));
    bladeGeometry.setAttribute("aLean", new THREE.InstancedBufferAttribute(leans, 2));

    const gustPositions = Array.from({ length: MAX_GUSTS }, () => new THREE.Vector2(999, 999));
    const gustDirections = Array.from({ length: MAX_GUSTS }, () => new THREE.Vector2(1, 0));
    const gustParams = Array.from({ length: MAX_GUSTS }, () => new THREE.Vector3(0, 1, 0));
    const grassUniforms = {
      uTime: { value: 0 },
      uGustPosition: { value: gustPositions },
      uGustDirection: { value: gustDirections },
      uGustParams: { value: gustParams },
    };

    const grassMaterial = new THREE.ShaderMaterial({
      uniforms: grassUniforms,
      vertexShader: `
        precision highp float;
        #define MAX_GUSTS ${MAX_GUSTS}
        attribute vec3 aOffset;
        attribute vec2 aScale;
        attribute float aYaw;
        attribute float aPhase;
        attribute float aTone;
        attribute float aFlex;
        attribute vec2 aLean;
        uniform float uTime;
        uniform vec2 uGustPosition[MAX_GUSTS];
        uniform vec2 uGustDirection[MAX_GUSTS];
        uniform vec3 uGustParams[MAX_GUSTS];
        varying float vHeight;
        varying float vTone;
        varying float vLight;
        varying float vDistance;

        void main(){
          vec3 local=position;
          local.x*=aScale.x;
          local.y*=aScale.y;
          vec2 worldXZ=aOffset.xz;
          float h=uv.y;
          float waveA=sin(worldXZ.x*.17+worldXZ.y*.10+uTime*.58+aPhase);
          float waveB=sin(worldXZ.x*-.08+worldXZ.y*.24-uTime*.38+aPhase*.63);
          float slowSway=sin(worldXZ.x*.055-worldXZ.y*.035+uTime*.29+aPhase*.28);
          vec2 prevailing=normalize(vec2(.9,.32));
          vec2 bend=aLean+prevailing*(.065+.052*waveA+.038*slowSway)+vec2(waveB,-waveA)*.022;
          vec2 gustBend=vec2(0.0);
          float gustCurl=0.0;
          for(int i=0;i<MAX_GUSTS;i++){
            float gustEnabled=uGustParams[i].z;
            vec2 direction=normalize(uGustDirection[i]+vec2(.0001));
            vec2 side=vec2(-direction.y,direction.x);
            vec2 delta=worldXZ-uGustPosition[i];
            float along=dot(delta,direction);
            float lateral=dot(delta,side);
            float radius=max(uGustParams[i].y,.05);
            float ribbon=exp(-pow(lateral/radius,2.0))*exp(-pow((along+radius*.58)/(radius*1.72),2.0));
            float breakup=.82+.18*sin(worldXZ.x*3.7+worldXZ.y*2.9+aPhase*1.4);
            float elastic=1.0+.03*sin(along*5.0-uTime*4.8+aPhase);
            float amount=uGustParams[i].x*ribbon*breakup*elastic*gustEnabled;
            gustBend+=direction*amount;
            gustCurl+=sin(along*6.4+aPhase*1.7)*amount;
          }
          bend+=gustBend;
          float tipWeight=pow(h,2.15);
          float gustAmount=length(gustBend);
          vec2 bendDirection=normalize(bend+vec2(.00001));
          float bendAngle=clamp(length(bend)*aFlex*1.34,0.0,1.42);
          float arcX=0.0;
          float arcY=h*aScale.y;
          if(bendAngle>.001){
            arcX=(1.0-cos(bendAngle*h))*aScale.y/bendAngle;
            arcY=sin(bendAngle*h)*aScale.y/bendAngle;
          }
          float twist=aYaw+h*(.08*sin(uTime*1.15+aPhase)+gustCurl*.22);
          float c=cos(twist), s=sin(twist);
          vec2 rotated=vec2(local.x*c-local.z*s,local.x*s+local.z*c);
          vec3 transformed=vec3(rotated.x,arcY,rotated.y);
          transformed.xz+=bendDirection*arcX;
          vec2 bendSide=vec2(-bendDirection.y,bendDirection.x);
          transformed.xz+=bendSide*tipWeight*aScale.y*(.03*sin(uTime*1.25+aPhase+h*2.8)+gustCurl*.075)*aFlex;
          transformed.xz+=prevailing*tipWeight*aScale.y*.028*sin(uTime*2.55+aPhase*1.3+h*3.6)*(1.0+gustAmount*.75);
          transformed+=aOffset;
          vHeight=h;
          vTone=aTone;
          vDistance=distance(cameraPosition,transformed);
          float tangentAngle=bendAngle*h;
          vec3 tangent=normalize(vec3(bendDirection.x*sin(tangentAngle),cos(tangentAngle),bendDirection.y*sin(tangentAngle)));
          vLight=.58+max(dot(tangent,normalize(vec3(-.42,.78,.36))),0.0)*.42;
          gl_Position=projectionMatrix*viewMatrix*vec4(transformed,1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying float vHeight;
        varying float vTone;
        varying float vLight;
        varying float vDistance;
        void main(){
          vec3 base=mix(vec3(.075,.19,.095),vec3(.16,.31,.12),vTone);
          vec3 tip=mix(vec3(.28,.42,.16),vec3(.48,.53,.23),vTone);
          vec3 color=mix(base,tip,smoothstep(.0,1.0,vHeight))*vLight;
          color+=vec3(.12,.10,.035)*pow(vHeight,4.0);
          color=mix(color,vec3(.34,.39,.29),smoothstep(22.0,76.0,vDistance)*.72);
          gl_FragColor=vec4(color,1.0);
        }
      `,
      side: THREE.DoubleSide,
    });
    const grass = new THREE.Mesh(bladeGeometry, grassMaterial);
    grass.frustumCulled = false;
    scene.add(grass);

    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const currentHit = new THREE.Vector3();
    const lastHit = new THREE.Vector3();
    const gusts = [];
    let hasHit = false;
    let lastPointerTime = performance.now();
    let pointerDown = false;
    let pointerX = 0;
    let pointerY = 0;
    let windEnergy = 0;
    let windEnergyTarget = 0;
    let frameId = 0;
    let audioContext = null;
    let windFilter = null;
    let windGain = null;
    let windSource = null;
    let audioEnabled = false;

    function setupAudio() {
      if (audioContext) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioContext = new AudioContextClass();
      const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
      windSource = audioContext.createBufferSource();
      windSource.buffer = buffer;
      windSource.loop = true;
      windFilter = audioContext.createBiquadFilter();
      windFilter.type = "bandpass";
      windFilter.frequency.value = 520;
      windFilter.Q.value = 0.72;
      windGain = audioContext.createGain();
      windGain.gain.value = 0;
      windSource.connect(windFilter).connect(windGain).connect(audioContext.destination);
      windSource.start();
    }

    audioApiRef.current = {
      async setEnabled(enabled) {
        setupAudio();
        if (audioContext?.state === "suspended") await audioContext.resume();
        audioEnabled = Boolean(enabled && audioContext);
      },
    };

    function hostPoint(clientX, clientY) {
      const rect = host.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return null;
      return { rect, x: clientX - rect.left, y: clientY - rect.top };
    }

    function hitGround(clientX, clientY, target) {
      const point = hostPoint(clientX, clientY);
      if (!point) return false;
      pointerNdc.set((point.x / point.rect.width) * 2 - 1, -(point.y / point.rect.height) * 2 + 1);
      raycaster.setFromCamera(pointerNdc, camera);
      return raycaster.ray.intersectPlane(interactionPlane, target);
    }

    function addGust(position, direction, strength) {
      gusts.push({
        position: position.clone(),
        direction: direction.clone().normalize(),
        strength,
        age: 0,
        lifetime: 1.45 + strength * 0.75,
        radius: 0.34 + strength * 0.19,
      });
      if (gusts.length > MAX_GUSTS) gusts.shift();
    }

    function setPointer(clientX, clientY) {
      const point = hostPoint(clientX, clientY);
      if (!point || !hitGround(clientX, clientY, currentHit)) {
        hasHit = false;
        return;
      }
      pointerX = point.x;
      pointerY = point.y;
      const now = performance.now();
      if (hasHit) {
        const dt = THREE.MathUtils.clamp((now - lastPointerTime) / 1000, 1 / 240, 0.08);
        const delta = currentHit.clone().sub(lastHit);
        const distance = delta.length();
        if (distance > 0.012) {
          const speed = distance / dt;
          const strength = THREE.MathUtils.clamp(0.18 + speed * 0.075, 0.18, 1.28) * (pointerDown ? 1.2 : 1);
          const count = THREE.MathUtils.clamp(Math.ceil(distance / 0.34), 1, 4);
          for (let index = 1; index <= count; index += 1) {
            addGust(lastHit.clone().lerp(currentHit, index / count), new THREE.Vector2(delta.x, delta.z), strength / Math.sqrt(count));
          }
          windEnergyTarget = Math.max(windEnergyTarget, strength / 1.28);
        }
      }
      lastHit.copy(currentHit);
      lastPointerTime = now;
      hasHit = true;
    }

    function onPointerMove(event) { setPointer(event.clientX, event.clientY); }
    function onPointerDown(event) {
      if (!hostPoint(event.clientX, event.clientY)) return;
      pointerDown = true;
      setPointer(event.clientX, event.clientY);
    }
    function onPointerUp() { pointerDown = false; }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("pointercancel", onPointerUp, { passive: true });

    function resize() {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (!pointerX) {
        pointerX = width * 0.5;
        pointerY = height * 0.55;
      }
    }
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    const clock = new THREE.Clock();
    function render() {
      const delta = Math.min(clock.getDelta(), 0.05);
      const time = clock.elapsedTime;
      windEnergyTarget *= Math.pow(0.055, delta);
      windEnergy += (windEnergyTarget - windEnergy) * (1 - Math.pow(0.002, delta));
      for (let index = gusts.length - 1; index >= 0; index -= 1) {
        const gust = gusts[index];
        gust.age += delta;
        gust.position.x += gust.direction.x * delta * (0.22 + gust.strength * 0.34);
        gust.position.z += gust.direction.y * delta * (0.22 + gust.strength * 0.34);
        gust.radius += delta * (0.38 + gust.strength * 0.34);
        if (gust.age >= gust.lifetime) gusts.splice(index, 1);
      }
      for (let index = 0; index < MAX_GUSTS; index += 1) {
        const gust = gusts[gusts.length - 1 - index];
        if (gust) {
          const progress = gust.age / gust.lifetime;
          const life = 1 - progress;
          const rebound = 1 - THREE.MathUtils.smoothstep(progress, 0.48, 0.94) * 1.14;
          gustPositions[index].set(gust.position.x, gust.position.z);
          gustDirections[index].copy(gust.direction);
          gustParams[index].set(gust.strength * Math.pow(life, 0.66) * rebound, gust.radius, 1);
        } else {
          gustPositions[index].set(999, 999);
          gustParams[index].set(0, 1, 0);
        }
      }
      grassUniforms.uTime.value = time;
      const width = Math.max(host.clientWidth, 1);
      camera.position.x += (((pointerX / width) - 0.5) * 0.9 - camera.position.x) * 0.012;
      camera.lookAt(cameraLook);
      if (audioContext && windGain) {
        const now = audioContext.currentTime;
        windFilter.frequency.setTargetAtTime(480 + windEnergy * 1450, now, 0.08);
        windFilter.Q.setTargetAtTime(0.7 + windEnergy * 1.2, now, 0.1);
        windGain.gain.setTargetAtTime(audioEnabled ? 0.012 + windEnergy * 0.075 : 0, now, 0.12);
      }
      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(render);
    }
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      resizeObserver.disconnect();
      audioApiRef.current = null;
      if (windSource) windSource.stop();
      if (audioContext) audioContext.close();
      bladeGeometry.dispose();
      grassMaterial.dispose();
      groundGeometry.dispose();
      groundMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  async function toggleSound() {
    const next = !soundOn;
    await audioApiRef.current?.setEnabled(next);
    setSoundOn(next);
  }

  return (
    <div className="grass-hero" ref={hostRef}>
      <button
        className="grass-hero__sound"
        type="button"
        aria-pressed={soundOn}
        onClick={toggleSound}
      >
        <span aria-hidden="true">≋</span>
        {locale === "en" ? `Wind sound ${soundOn ? "off" : "on"}` : `${soundOn ? "關閉" : "開啟"}風聲`}
      </button>
    </div>
  );
}
