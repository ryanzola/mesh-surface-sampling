import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler'

import Experience from './Experience'
import FlowField from './Flowfield'

import vertex from './shaders/canvas/vertex.glsl'
import fragment from './shaders/canvas/fragment.glsl'

export default class Canvas
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.config = this.experience.config
        this.time = this.experience.time
        this.resources = this.experience.resources
        this.model = this.resources.items.bridge.scene.children[0]
        this.positions = this.model.geometry.attributes.position.array
        this.count = this.model.geometry.attributes.position.count

        this.setFlowField()
        this.setAttributes()
        this.setGeometry()
        this.setMaterial()
        this.setMesh()
        // this.setDebugCube()
    }

    setFlowField() {

      // for(let i = 0; i < this.count; i++) {
      //   const angle = Math.random() * Math.PI * 2
  
      //   this.positions[i * 3 + 0] = Math.sin(angle)
      //   this.positions[i * 3 + 1] = Math.cos(angle)
      //   this.positions[i * 3 + 2] = 0
      // }

      this.flowField = new FlowField({ positions: this.positions })
    }

    setAttributes() {
      this.attributes = {}

      this.attributes.sizes = {}
      this.attributes.sizes.data = new Float32Array(this.count)

      this.attributes.alpha = {}
      this.attributes.alpha.data = new Float32Array(this.count)

      for(let i = 0; i < this.count; i++) {
        this.attributes.sizes.data[i] = 0.2 + Math.random() * 0.8
        this.attributes.alpha.data[i] = Math.random() + 0.1
      }

      this.attributes.sizes.attribute = new THREE.Float32BufferAttribute(this.attributes.sizes.data, 1)
      this.attributes.alpha.attribute = new THREE.Float32BufferAttribute(this.attributes.alpha.data, 1)
    }

    setGeometry() {
      this.model.geometry.setAttribute('aSize', this.attributes.sizes.attribute)
      this.model.geometry.setAttribute('aAlpha', this.attributes.alpha.attribute)
      this.model.geometry.setAttribute('aFboUv', this.flowField.fboUv.attribute)
      this.model.geometry.computeVertexNormals()
    }

    setDebugCube() {
      const geo = new THREE.BoxGeometry(1, 1, 1)
      const mat = new THREE.MeshBasicMaterial({
        color: 0xff0000
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(0, 1, -3)

      this.scene.add(mesh)
    }

    setMaterial() {
      // store the texture from the original material
      this.texture = this.model.material.map

      // create a new shader material
      this.model.material = new THREE.ShaderMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
          uFBOTexture: { value: this.flowField.texture },
          uMaskTexture: { value: this.resources.items.particleMaskTexture },
          uSize: { value: 1.0 },
          uTexture: { value: this.texture },
          uTime: { value: 0.0 },
        }
      })
    }

    setMesh() {
      this.points = new THREE.Points(this.model.geometry, this.model.material)
      this.scene.add(this.points)
    }

    update() {
      if(this.model) {
        this.flowField.update()
        this.model.material.uniforms.uFBOTexture.value = this.flowField.texture
        this.model.material.uniforms.uTime.value = this.time.elapsed * 0.001
      }
    }
}