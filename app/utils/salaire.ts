const TAUX_CHARGES_SOCIALES = 22 / 100;
const TAUX_CHARGES_PATRONALES = 45 / 100;
/**
 * Calcule le coût global d'un salaire pour l'entreprise (salaire brut + charges patronales)
 * @param salaireBrut Salaire brut du dirigeant
 */
export function getCoutGlobalSalaire(salaireBrut: number): number {
  const chargesPatronales = salaireBrut * TAUX_CHARGES_PATRONALES;
  return salaireBrut + chargesPatronales;
}

/**
 * Calcule le salaire net après charges sociales.
 * @param salaireBrut Salaire brut
 * @returns
 */
export function getSalaireNet(salaireBrut: number): number {
  return salaireBrut * (1 - TAUX_CHARGES_SOCIALES);
}
