import { HexCoord } from './RoomTypes';

/**
 * Hexagon math utilities
 * Using flat-top hexagons with axial coordinates
 */

export class HexUtils {
  /**
   * Convert hex coordinates to pixel position
   * Flat-top hexagons
   */
  static hexToPixel(coord: HexCoord, size: number): { x: number; y: number } {
    const x = size * (3/2 * coord.q);
    const y = size * (Math.sqrt(3)/2 * coord.q + Math.sqrt(3) * coord.r);
    return { x, y };
  }

  /**
   * Convert pixel position to hex coordinates (approximate)
   */
  static pixelToHex(x: number, y: number, size: number): HexCoord {
    const q = (2/3 * x) / size;
    const r = (-1/3 * x + Math.sqrt(3)/3 * y) / size;
    return this.roundHex(q, r);
  }

  /**
   * Round fractional hex coordinates to nearest hex
   */
  private static roundHex(q: number, r: number): HexCoord {
    const s = -q - r;

    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);

    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }

  /**
   * Get hex neighbors
   */
  static getNeighbors(coord: HexCoord): HexCoord[] {
    const directions = [
      { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
      { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 },
    ];

    return directions.map(dir => ({
      q: coord.q + dir.q,
      r: coord.r + dir.r,
    }));
  }

  /**
   * Get distance between two hexes
   */
  static distance(a: HexCoord, b: HexCoord): number {
    return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
  }

  /**
   * Check if two hex coords are equal
   */
  static equals(a: HexCoord, b: HexCoord): boolean {
    return a.q === b.q && a.r === b.r;
  }

  /**
   * Get hexagon corner points (for drawing)
   * Returns array of 6 points
   */
  static getHexagonCorners(size: number): { x: number; y: number }[] {
    const corners: { x: number; y: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i;
      const angleRad = (Math.PI / 180) * angleDeg;
      corners.push({
        x: size * Math.cos(angleRad),
        y: size * Math.sin(angleRad),
      });
    }
    return corners;
  }

  /**
   * Generate a hex grid in a rectangular pattern
   */
  static generateRectGrid(width: number, height: number): HexCoord[] {
    const hexes: HexCoord[] = [];
    for (let r = 0; r < height; r++) {
      const rOffset = Math.floor(r / 2);
      for (let q = -rOffset; q < width - rOffset; q++) {
        hexes.push({ q, r });
      }
    }
    return hexes;
  }
}
