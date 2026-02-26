const TAUX_CSG = 17.2 / 100;

/**
 * Calcule la CSG sur les dividendes distribués.
 * @param dividendesBrut Dividende brut distribué
 */
export function getCSGDividendes(dividendesBrut: number): number {
  return dividendesBrut * TAUX_CSG;
}
