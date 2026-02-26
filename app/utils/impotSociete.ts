const TAUX_IS_REDUIT = 15 / 100;
const TAUX_IS_NORMAL = 25 / 100;

/**
 *  Calcule l'impôt sur les sociétés en fonction du bénéfice.
 * @param benefice Bénéfice après cout global du salaire Dirigeant
 */
export function getImpotSociete(benefice: number): number {
  const trancheReduite = Math.min(42500, benefice);
  const trancheNormale = Math.max(0, benefice - trancheReduite);

  return trancheReduite * TAUX_IS_REDUIT + trancheNormale * TAUX_IS_NORMAL;
}

/**
 * Calcule le bénéfice avant impôt sur les sociétés en fonction du bénéfice après impôt
 */
export function getBeneficeAvantImpotSociete(
  beneficeApresImpot: number
): number {
  // On résout l'équation : beneficeApresImpot = beneficeAvantImpot - getImpotSociete(beneficeAvantImpot)
  // Par une recherche binaire
  let low = beneficeApresImpot;
  let high = beneficeApresImpot * 2 + 100000; // une marge haute arbitraire
  let mid: number;

  while (high - low > 0.005) {
    mid = (low + high) / 2;
    const impots = getImpotSociete(mid);
    const beneficeCalcule = mid - impots;

    if (beneficeCalcule < beneficeApresImpot) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return high;
}
