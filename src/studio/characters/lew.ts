import * as T from 'three'
import { CharacterRig } from './rig'
import { outline, toonGradient } from '../engine/toon'
import { raccoonMaskGeometry } from './raccoonMask'
/**
 * Lew: the brand character, a low-poly raccoon. What must read at reel scale and
 * as a flat icon: the black eye mask with half-lidded eyes, the pointed ears, the
 * striped tail, the elongated body. Everything is a faceted ball or a cone; the
 * mask carries the expression (the lids are mask-coloured, so they read as mask).
 */
export const LEW_MASK = '#0f0f14'
export const LEW_PALE = '#ebe8ea'
export const LEW_DARK = '#3b4252'
let ballGeometry: T.IcosahedronGeometry | undefined
function ball() {
  ballGeometry ??= new T.IcosahedronGeometry(1, 1)
  return ballGeometry
}
/** Polyhedron geometry is non-indexed, so its normals are per face: the facets come free. */
function lowpoly(color: string) {
  return new T.MeshToonMaterial({ color, gradientMap: toonGradient() })
}
/** Horizontal face planes, not a stretched sphere: wide temples, narrow crown and chin.
 * Pale lower planes wrap around the jaw in profile, with no pasted-on cheek balls. */
function angularHead() {
  const rows = [
    [-0.9, 0.28, 0.22, 0.65], [-0.5, 0.73, 0.38, 0.91],
    [0.05, 1, 0.38, 0.96], [0.65, 0.73, 0.28, 0.68], [1, 0.42, 0, 0.12]
  ]
  const vertices: number[] = []
  const geometry = new T.BufferGeometry()
  const triangle = (a: number[], b: number[], c: number[], material: number) => {
    const start = vertices.length / 3
    vertices.push(...a, ...b, ...c)
    geometry.addGroup(start, 3, material)
  }
  for (let i = 0; i < rows.length - 1; i++) {
    const [y, w, edge, center] = rows[i]!
    const [ny, nw, ne, nc] = rows[i + 1]!
    for (const side of [-1, 1]) {
      const a = [0, y!, center!], b = [side * w!, y!, edge!]
      const c = [side * nw!, ny!, ne!], d = [0, ny!, nc!]
      const material = i < 2 ? 1 : 0
      if (side > 0) { triangle(a, b, c, material); triangle(a, c, d, material) }
      else { triangle(a, c, b, material); triangle(a, d, c, material) }
      const backA = [side * w! * 0.82, y!, -0.65]
      const backB = [side * nw! * 0.82, ny!, -0.65]
      if (side > 0) { triangle(b, backA, backB, material); triangle(b, backB, c, material) }
      else { triangle(b, backB, backA, material); triangle(b, c, backB, material) }
      const ba = [0, y!, -0.84], bd = [0, ny!, -0.84]
      if (side > 0) { triangle(backA, ba, bd, 0); triangle(backA, bd, backB, 0) }
      else { triangle(backA, bd, ba, 0); triangle(backA, backB, bd, 0) }
    }
  }
  for (const index of [0, rows.length - 1]) {
    const [y, w, edge, center] = rows[index]!
    const cap = [[-w!, y!, edge!], [0, y!, center!], [w!, y!, edge!], [w! * 0.82, y!, -0.65], [0, y!, -0.84], [-w! * 0.82, y!, -0.65]]
    for (let i = 1; i < cap.length - 1; i++) {
      if (index === 0) triangle(cap[0]!, cap[i]!, cap[i + 1]!, 1)
      else triangle(cap[0]!, cap[i + 1]!, cap[i]!, 0)
    }
  }
  geometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  return geometry
}
function poly(parent: T.Object3D, position: [number, number, number], scale: [number, number, number], material: T.Material, outlined = true, shadow = true) {
  const mesh = new T.Mesh(ball(), material)
  mesh.position.set(...position)
  mesh.scale.set(...scale)
  mesh.castShadow = shadow
  parent.add(mesh)
  if (outlined) outline(mesh)
  return mesh
}
export function buildLew(rig: CharacterRig) {
  const coat = rig.coat
  const pale = lowpoly(LEW_PALE)
  const dark = lowpoly(LEW_DARK)
  const mask = lowpoly(LEW_MASK)
  // Compact pale body, with dark sleeves and feet framing the narrow silhouette.
  const torso = poly(rig.body, [0, 0.54, 0], [0.245, 0.46, 0.24], pale)
  torso.name = 'lew-torso'
  poly(rig.body, [-0.13, 0.07, 0.1], [0.105, 0.08, 0.16], mask)
  poly(rig.body, [0.13, 0.07, 0.1], [0.105, 0.08, 0.16], mask)
  // One continuous eight-sided sweep. Material groups follow the bend, so the
  // stripes are perpendicular to the tail rather than overlapping spherical beads.
  const curve = new T.CatmullRomCurve3([
    new T.Vector3(0.12, 0.23, -0.29), new T.Vector3(0.45, 0.3, -0.52),
    new T.Vector3(0.77, 0.48, -0.59), new T.Vector3(0.86, 0.8, -0.48),
    new T.Vector3(0.73, 1.0, -0.36)
  ])
  const tailGeometry = new T.TubeGeometry(curve, 24, 0.185, 8, false)
  // A gently tapered tip makes the profile feel like fur, not a pipe elbow.
  const positions = tailGeometry.getAttribute('position')
  for (let i = 0; i <= 24; i++) {
    const center = curve.getPointAt(i / 24)
    const taper = i < 18 ? 1 : 1 - (i - 18) / 6 * 0.72
    for (let j = 0; j <= 8; j++) {
      const index = i * 9 + j
      const point = new T.Vector3().fromBufferAttribute(positions, index).sub(center).multiplyScalar(taper).add(center)
      positions.setXYZ(index, point.x, point.y, point.z)
    }
  }
  tailGeometry.clearGroups()
  for (let stripe = 0; stripe < 8; stripe++) tailGeometry.addGroup(stripe * 3 * 8 * 6, 3 * 8 * 6, stripe % 2)
  tailGeometry.computeVertexNormals()
  const tail = new T.Mesh(tailGeometry, [pale, dark])
  tail.name = 'lew-tail'
  tail.castShadow = true
  rig.body.add(tail)
  outline(tail, 0.018)
  for (const [arm, side] of [
    [rig.leftArm, -1],
    [rig.rightArm, 1]
  ] as const) {
    arm.position.set(side * 0.32, 0.68, 0.04)
    poly(arm, [side * 0.02, -0.2, 0], [0.09, 0.22, 0.09], coat)
    poly(arm, [side * 0.02, -0.4, 0.02], [0.08, 0.07, 0.08], dark)
  }
  rig.metrics = {
    headHeight: 1.0,
    earRest: [0.25, -0.25],
    earLift: 0.8,
    armRest: [0.3, -0.3],
    mouthWidth: 0.07,
    restingLid: 0.22
  }
  // The mask follows the same facets as the head, including its side curvature.
  const head = new T.Mesh(angularHead(), [coat, pale])
  head.name = 'lew-head'
  head.position.set(0, 0.42, 0)
  head.scale.set(0.76, 0.46, 0.47)
  head.castShadow = true
  rig.head.add(head)
  outline(head, 0.018)
  const band = new T.Mesh(raccoonMaskGeometry(head.geometry), mask)
  band.name = 'lew-mask'
  band.position.copy(head.position)
  band.scale.copy(head.scale)
  band.castShadow = false
  rig.head.add(band)
  // The continuous facet mask needs no detached forehead bridge.
  // Muzzle: pale, tiny, with a black nose.
  poly(rig.head, [0, 0.27, 0.49], [0.17, 0.12, 0.14], pale, false)
  poly(rig.head, [0, 0.31, 0.62], [0.06, 0.045, 0.05], mask, false, false)
  // Ears: four-sided cones, outward, with a pale inner face.
  for (const [ear, side] of [
    [rig.leftEar, -1],
    [rig.rightEar, 1]
  ] as const) {
    ear.position.set(side * 0.43, 0.78, -0.08)
    const shape = new T.Shape()
    shape.moveTo(-0.17, -0.03)
    shape.lineTo(0.17, -0.03)
    shape.lineTo(side * 0.07, 0.39)
    shape.closePath()
    const rim = new T.Mesh(new T.ExtrudeGeometry(shape, { depth: 0.13, bevelEnabled: false }), pale)
    rim.position.z = -0.08
    rim.castShadow = true
    ear.add(rim)
    outline(rim, 0.015)
    const insetGeometry = new T.BufferGeometry()
    insetGeometry.setAttribute('position', new T.Float32BufferAttribute([
      -0.105, 0.025, 0.056, 0.105, 0.025, 0.056, side * 0.048, 0.29, 0.056
    ], 3))
    insetGeometry.computeVertexNormals()
    const inset = new T.Mesh(insetGeometry, mask)
    inset.name = 'lew-ear-inset'
    ear.add(inset)
  }
  // Eyes sit on the mask; their lids are mask-coloured so a half-lid reads as the mask's edge.
  for (const side of [-1, 1]) {
    const eye = rig.addEye([side * 0.24, 0.5, 0.535], 0.098, 0.85, mask, LEW_PALE)
    // Attach the entire eye to the actual head facet, facing its surface normal.
    // The shallow depth applies to whites, pupils, lids and outline shells together.
    head.updateWorldMatrix(true, false)
    const ray = new T.Raycaster(new T.Vector3(side * 0.22, 0.5, 2), new T.Vector3(0, 0, -1))
    const hit = ray.intersectObject(head, false)[0]
    if (!hit?.face) throw new Error('Raccoon eye attachment missed the head')
    const normal = hit.face.normal.clone().applyNormalMatrix(new T.Matrix3().getNormalMatrix(head.matrixWorld))
    eye.group.position.copy(hit.point).addScaledVector(normal, 0.012)
    eye.group.quaternion.setFromUnitVectors(new T.Vector3(0, 0, 1), normal)
    eye.group.scale.z = 0.12
    eye.lid.scale.y *= 0.45
    eye.lid.position.z = 0.088
    // A flat, unoutlined lid gives a single clean edge. The inverted sphere hull
    // previously showed through the white as a second dotted contour.
    eye.lid.clear()
    eye.lid.geometry = new T.CircleGeometry(1, 64)
    eye.lid.material = new T.MeshBasicMaterial({ color: LEW_MASK, side: T.DoubleSide })
  }
  rig.mouth.position.set(0, 0.18, 0.6)
}
