import * as T from 'three'

/** Two connected eye patches painted on the actual head facets. Intersecting each
 * mask triangle with each head facet keeps the markings flush even in profile. */
export function raccoonMaskGeometry(head: T.BufferGeometry): T.BufferGeometry {
  const source = head.index ? head.toNonIndexed() : head
  const positions = source.getAttribute('position')
  // Head-local coordinates, before the raccoon's ellipsoid scale and offset.
  const contour = [
    [-0.98, 0.12], [-0.87, 0.32], [-0.6, 0.5], [-0.36, 0.52], [-0.17, 0.38],
    [0, 0.29], [0.17, 0.38], [0.36, 0.52], [0.6, 0.5], [0.87, 0.32],
    [0.98, 0.12], [0.87, -0.12], [0.6, -0.25], [0.36, -0.25], [0.17, -0.13],
    [0, 0.06], [-0.17, -0.13], [-0.36, -0.25], [-0.6, -0.25], [-0.87, -0.12]
  ].map(([x, y]) => new T.Vector2(x!, y!))
  const patches = T.ShapeUtils.triangulateShape(contour, [])
  const vertices: number[] = []
  function clip(polygon: T.Vector3[], distance: (point: T.Vector3) => number) {
    const result: T.Vector3[] = []
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i]!, b = polygon[(i + 1) % polygon.length]!
      const da = distance(a), db = distance(b)
      if (da >= 0) result.push(a)
      if ((da >= 0) !== (db >= 0)) result.push(a.clone().lerp(b, da / (da - db)))
    }
    return result
  }
  for (let i = 0; i < positions.count; i += 3) {
    const facet = clip([0, 1, 2].map(offset => new T.Vector3().fromBufferAttribute(positions, i + offset)), p => p.z - 0.18)
    if (facet.length < 3) continue
    for (const indices of patches) {
      const triangle = indices.map(index => contour[index]!)
      const [a, b, c] = triangle as [T.Vector2, T.Vector2, T.Vector2]
      const sign = Math.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x))
      let polygon = facet
      for (let edge = 0; edge < 3; edge++) {
        const from = triangle[edge]!, to = triangle[(edge + 1) % 3]!
        polygon = clip(polygon, p => sign * ((to.x - from.x) * (p.y - from.y) - (to.y - from.y) * (p.x - from.x)))
      }
      for (let j = 1; j + 1 < polygon.length; j++) {
        const points = [polygon[0]!, polygon[j]!, polygon[j + 1]!]
        const area = new T.Vector3().subVectors(points[1]!, points[0]!).cross(new T.Vector3().subVectors(points[2]!, points[0]!)).lengthSq()
        if (area < 1e-14) continue
        // A tiny radial lift avoids coplanar depth fighting without a floating visor.
        for (const point of points) vertices.push(point.x * 1.006, point.y * 1.006, point.z * 1.006)
      }
    }
  }
  if (source !== head) source.dispose()
  const geometry = new T.BufferGeometry()
  geometry.setAttribute('position', new T.Float32BufferAttribute(vertices, 3))
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
  return geometry
}
