import { describe, expect, it } from 'vitest'
import * as T from 'three'
import { CharacterRig } from './rig'
import { buildLew } from './lew'
import type { CharacterData } from '../scene/model'
const data: CharacterData = { id: 'lew', name: 'Lew', kind: 'lew', position: [0,0,0], rotation: [0,0,0], scale: 1, color: '#6b6f7b', expression: 'neutral', gaze: { kind: 'camera' } }
describe('Lew reference silhouette', () => {
  it('has a substantial continuous striped curved tail behind a slender pale torso', () => {
    const rig = new CharacterRig(data)
    buildLew(rig)
    const tail = rig.body.getObjectByName('lew-tail') as T.Mesh
    expect(tail, 'tail should be one connected mesh, not six beads').toBeDefined()
    expect(tail.geometry.type).toBe('TubeGeometry')
    expect(tail.geometry.groups).toHaveLength(8)
    expect(tail.geometry.groups.map(g => g.materialIndex)).toEqual([0, 1, 0, 1, 0, 1, 0, 1])
    const bounds = new T.Box3().setFromObject(tail)
    expect(bounds.max.x - bounds.min.x).toBeGreaterThan(0.65)
    expect(bounds.max.y - bounds.min.y).toBeGreaterThan(0.65)
    expect(bounds.max.z).toBeLessThan(0.05)
    const torso = rig.body.getObjectByName('lew-torso') as T.Mesh
    expect((torso.material as T.MeshToonMaterial).color.getHexString()).toBe('ebe8ea')
    const size = new T.Box3().setFromObject(torso).getSize(new T.Vector3())
    expect(size.y / size.x).toBeGreaterThan(1.7)
    rig.dispose()
  })
  it('has a broad angular head, a continuous pale jaw and dark inset triangular ears', () => {
    const rig = new CharacterRig(data)
    buildLew(rig)
    const head = rig.head.getObjectByName('lew-head') as T.Mesh
    expect(head, 'reference head must replace the round ellipsoid').toBeDefined()
    const bounds = new T.Box3().setFromObject(head)
    const size = bounds.getSize(new T.Vector3())
    expect(size.x / size.y).toBeGreaterThan(1.55)
    expect(head.geometry.type).toBe('BufferGeometry')
    expect(head.geometry.groups.some(g => g.materialIndex === 1)).toBe(true)
    expect((head.material as T.MeshToonMaterial[])[1]!.color.getHexString()).toBe('ebe8ea')
    for (const ear of [rig.leftEar, rig.rightEar]) {
      const inset = ear.getObjectByName('lew-ear-inset') as T.Mesh
      expect(inset).toBeDefined()
      expect((inset.material as T.MeshToonMaterial).color.getHexString()).toBe('0f0f14')
      expect(inset.geometry.getAttribute('position').count).toBe(3)
    }
    rig.dispose()
  })
})
describe('Lew facial mask', () => {
  it('keeps the forehead clear of detached dark markings', () => {
    const rig = new CharacterRig(data)
    buildLew(rig)
    const marks = rig.head.children.filter(child => child instanceof T.Mesh && !Array.isArray(child.material) && 'color' in child.material && (child.material as T.MeshToonMaterial).color.getHexString() === '0f0f14' && child.position.y > 0.65)
    expect(marks).toHaveLength(0)
    rig.dispose()
  })
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
      expect(eye.lid.geometry.type).toBe('CircleGeometry')
      expect(eye.lid.children).toHaveLength(0)
      expect(eye.lid.material).toBeInstanceOf(T.MeshBasicMaterial)
      expect(eye.lid.position.z).toBeGreaterThan(0.145 * 0.55)
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
