import * as THREE from 'three'

import Experience from './Experience'

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

        this.setGeometry()
        this.setMaterial()
        this.setMesh()
    }

    setGeometry() {
      this.geometry = new THREE.SphereBufferGeometry(1, 32, 32);
    }

    setMaterial() {
      this.material = new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        // wireframe: true,
        uniforms: {
          iResolution: { value: new THREE.Vector3(this.config.width, this.config.height, 1) },
          uTime: { value: 0.0 }
        }
      })
    }

    setMesh() {
      this.mesh = new THREE.Mesh(this.geometry, this.material)
      this.mesh.position.x = 2

      
      this.scene.add(this.mesh)
    }

    update() {
      if(this.material)
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001
    }
}