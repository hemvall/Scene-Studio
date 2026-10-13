import { describe, expect, it } from 'vitest'
import * as T from 'three'
import { CharacterRig } from './rig'
import { buildLew } from './lew'
import type { CharacterData } from '../scene/model'
const data: CharacterData = { id: 'lew', name: 'Lew', kind: 'lew', position: [0,0,0], rotation: [0,0,0], scale: 1, color: '#6b6f7b', expression: 'neutral', gaze: { kind: 'camera' } }
describe('Lew facial mask', () => {
  it('keeps both pupils in front of the head and mask from frontal and oblique views', () => {
    const rig = new CharacterRig(data)
    buildLew(rig)
    rig.root.updateMatrixWorld(true)
    for (const eye of rig.eyes) {
      const center = eye.pupil.getWorldPosition(new T.Vector3())
      for (const yaw of [-0.45, 0, 0.45]) {
        const direction = new T.Vector3(Math.sin(yaw), 0, Math.cos(yaw))
        const ray = new T.Raycaster(center.clone().addScaledVector(direction, 2), direction.clone().negate())
        // Mouth primitives are unposed here; animation scales them before rendering.
        const hits = ray.intersectObjects(rig.head.children.filter(child => child !== rig.mouth), true)
        expect(hits.length).toBeGreaterThan(0)
        expect(hits[0]!.object === eye.pupil || hits[0]!.object.parent === eye.pupil).toBe(true)
      }
    }
    rig.dispose()
  })
  it('seats shallow eyes against the head rather than floating goggles', () => {
    const rig = new CharacterRig(data)
    buildLew(rig)
    for (const eye of rig.eyes) {
      expect(eye.group.scale.z).toBe(0.12)
      const normal = new T.Vector3(0, 0, 1).applyQuaternion(eye.group.quaternion)
      expect(Math.abs(normal.x)).toBeGreaterThan(0.1)
      expect(normal.z).toBeGreaterThan(0.5)
      expect(eye.group.position.z).toBeLessThan(0.535)
      const bounds = new T.Box3().setFromObject(eye.group)
      expect(bounds.max.z - bounds.min.z).toBeLessThan(0.18)
    }
    rig.dispose()
  })
  it('builds a finite, thin surface mask on the front head facets', () => {
    const rig = new CharacterRig(data)
    buildLew(rig)
    const mask = rig.head.getObjectByName('lew-mask') as T.Mesh
    expect(mask).toBeDefined()
    const positions = mask.geometry.getAttribute('position')
    expect(positions.count).toBeGreaterThan(0)
    for (let i = 0; i < positions.count; i++) {
      expect(Number.isFinite(positions.getX(i) + positions.getY(i) + positions.getZ(i))).toBe(true)
      expect(positions.getZ(i)).toBeGreaterThanOrEqual(0.18)
      expect(positions.getY(i)).toBeGreaterThanOrEqual(-0.253)
      expect(positions.getY(i)).toBeLessThanOrEqual(0.524)
    }
    expect(mask.castShadow).toBe(false)
    rig.dispose()
  })
})
