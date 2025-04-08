<template>
  <div class="scene-container" ref="sceneContainer"></div>
</template>

<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, onBeforeUnmount, ref } from 'vue';

export default {
  name: 'ProtossNexus',
  setup() {
    const sceneContainer = ref(null);
    let scene, camera, renderer, controls;
    let nexusGroup, energyEffect;
    let animationFrameId = null;
    
    const initThree = () => {
      // 기본 설정
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      
      // 카메라
      camera = new THREE.PerspectiveCamera(
        60,
        sceneContainer.value.clientWidth / sceneContainer.value.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 10, 20);
      
      // 렌더러
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(sceneContainer.value.clientWidth, sceneContainer.value.clientHeight);
      renderer.shadowMap.enabled = true;
      sceneContainer.value.appendChild(renderer.domElement);
      
      // 컨트롤
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      
      // 조명
      addLights();
      
      // 넥서스 생성
      createNexus();
      
      // 애니메이션 시작
      animate();
      
      // 리사이즈 이벤트
      window.addEventListener('resize', handleResize);
    };
    
    const addLights = () => {
      // 환경광
      const ambientLight = new THREE.AmbientLight(0x333333);
      scene.add(ambientLight);
      
      // 방향광 (파란색 - 프로토스 테마)
      const mainLight = new THREE.DirectionalLight(0x6699ff, 1);
      mainLight.position.set(5, 10, 7);
      mainLight.castShadow = true;
      scene.add(mainLight);
      
      // 포인트 라이트 (골드 - 프로토스 강조색)
      const accentLight = new THREE.PointLight(0xffcc66, 1, 20);
      accentLight.position.set(0, 5, 0);
      scene.add(accentLight);
    };
    
    const createNexus = () => {
      nexusGroup = new THREE.Group();
      
      // 1. 육각형 기반 (넥서스의 기초 부분)
      const baseGeometry = createHexagonGeometry(6, 1);
      const baseMaterial = new THREE.MeshPhongMaterial({
        color: 0x8899aa,
        specular: 0x6688cc,
        shininess: 30,
        flatShading: true
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.receiveShadow = true;
      nexusGroup.add(base);
      
      // 2. 중앙 기둥
      const pillarGeometry = new THREE.CylinderGeometry(3, 4, 4, 6);
      const pillarMaterial = new THREE.MeshPhongMaterial({
        color: 0x596c85,
        specular: 0x6688cc,
        shininess: 30
      });
      const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
      pillar.position.y = 2;
      pillar.castShadow = true;
      nexusGroup.add(pillar);
      
      // 3. 상부 구조 (부유하는 부분)
      const upperGeometry = createHexagonGeometry(5, 1.5);
      const upperMaterial = new THREE.MeshPhongMaterial({
        color: 0x4466aa,
        specular: 0x88aaff,
        shininess: 50,
        emissive: 0x224488,
        emissiveIntensity: 0.5
      });
      const upperPart = new THREE.Mesh(upperGeometry, upperMaterial);
      upperPart.position.y = 6;
      upperPart.rotation.z = Math.PI / 6;
      upperPart.castShadow = true;
      nexusGroup.add(upperPart);
      
      // 4. 중앙 에너지 코어
      const coreGeometry = new THREE.SphereGeometry(1.5, 16, 16);
      const coreMaterial = new THREE.MeshPhongMaterial({
        color: 0x88aaff,
        emissive: 0x4477ff,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.9
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.y = 6;
      nexusGroup.add(core);
      
      // 5. 에너지 효과 (발광 파티클)
      createEnergyEffect();
      
      // 6. 장식 세부사항 추가 (골드 트림)
      addGoldTrim();
      
      scene.add(nexusGroup);
    };
    
    // 육각형 지오메트리 생성 헬퍼 함수
    const createHexagonGeometry = (radius, height) => {
      const shape = new THREE.Shape();
      const sides = 6;
      
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        
        if (i === 0) {
          shape.moveTo(x, z);
        } else {
          shape.lineTo(x, z);
        }
      }
      
      shape.closePath();
      
      const extrudeSettings = {
        steps: 1,
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelSegments: 3
      };
      
      return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    };
    
    // 에너지 효과 생성
    const createEnergyEffect = () => {
      energyEffect = new THREE.Group();
      const particleCount = 50;
      
      // 파티클 시스템 생성
      const particles = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        // 구 형태로 파티클 분산
        const radius = 2 + Math.random() * 0.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = 6 + radius * Math.cos(phi); // y축 위치 조정
        positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
        
        sizes[i] = 0.1 + Math.random() * 0.2;
      }
      
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleMaterial = new THREE.PointsMaterial({
        color: 0x88aaff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
      });
      
      const particleSystem = new THREE.Points(particles, particleMaterial);
      energyEffect.add(particleSystem);
      
      nexusGroup.add(energyEffect);
    };
    
    // 골드 트림 장식 추가
    const addGoldTrim = () => {
      // 상부 골드 트림
      const upperTrimGeometry = new THREE.TorusGeometry(5, 0.2, 8, 6);
      const goldMaterial = new THREE.MeshPhongMaterial({
        color: 0xffcc66,
        specular: 0xffffaa,
        shininess: 100,
        emissive: 0xaa7722,
        emissiveIntensity: 0.3
      });
      
      const upperTrim = new THREE.Mesh(upperTrimGeometry, goldMaterial);
      upperTrim.position.y = 6.5;
      upperTrim.rotation.x = Math.PI / 2;
      nexusGroup.add(upperTrim);
      
      // 하부 골드 트림
      const lowerTrimGeometry = new THREE.TorusGeometry(4, 0.2, 8, 6);
      const lowerTrim = new THREE.Mesh(lowerTrimGeometry, goldMaterial);
      lowerTrim.position.y = 3;
      lowerTrim.rotation.x = Math.PI / 2;
      nexusGroup.add(lowerTrim);
    };
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // 부유 효과 애니메이션
      if (nexusGroup) {
        // 상부 부유 애니메이션
        const time = Date.now() * 0.001;
        nexusGroup.children[2].position.y = 6 + Math.sin(time) * 0.2;
        
        // 코어 펄스 애니메이션
        nexusGroup.children[3].material.emissiveIntensity = 0.7 + Math.sin(time * 2) * 0.3;
        
        // 에너지 효과 회전
        if (energyEffect) {
          energyEffect.rotation.y += 0.01;
        }
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    const handleResize = () => {
      const width = sceneContainer.value.clientWidth;
      const height = sceneContainer.value.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    onMounted(() => {
      initThree();
    });
    
    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (renderer) {
        renderer.dispose();
      }
    });
    
    return {
      sceneContainer
    };
  }
}
</script>

<style scoped>
.scene-container {
  width: 100%;
  height: 600px;
  background-color: #000;
}
</style>