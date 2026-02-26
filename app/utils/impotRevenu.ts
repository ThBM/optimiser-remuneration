const BAREME = [
  { plafond: 11497, taux: 0 },
  { plafond: 29315, taux: 11 / 100 },
  { plafond: 83823, taux: 30 / 100 },
  { plafond: 180294, taux: 41 / 100 },
  { plafond: Infinity, taux: 45 / 100 },
];

/**
 * Calcule l'impôt sur le revenu
 * @param revenus Revenu imposable du foyer fiscal (Salaire + autres revenus) avant frais professionnels
 * @param partsFiscales Nombre de parts fiscales dans le foyer fiscal
 * @param dividendeBrut Dividende brut distribué
 */
export function getImpotRevenu(
  revenus: number,
  partsFiscales: number,
  dividendeBrut: number
): {
  montant: number;
  optionDividendes: "PFU" | "Barème";
} {
  const revenuImposable = revenus * (1 - 10 / 100);

  const montantImpotPFU =
    getImpotBareme(revenuImposable, partsFiscales) +
    (dividendeBrut * 12.8) / 100;
  const montantImpotBareme = getImpotBareme(
    revenuImposable + dividendeBrut * (1 - 0.4), // abattement de 40% sur les dividendes
    partsFiscales
  );

  if (montantImpotPFU < montantImpotBareme) {
    return { montant: montantImpotPFU, optionDividendes: "PFU" };
  }

  return { montant: montantImpotBareme, optionDividendes: "Barème" };
}

function getImpotBareme(
  revenuImposable: number,
  partsFiscales: number
): number {
  const assietteFiscale = revenuImposable / partsFiscales;

  let montantImpot = 0;

  let reste = assietteFiscale;
  let tranchePrecedente = 0;

  for (const tranche of BAREME) {
    if (reste <= 0) break;
    const montantTranche = Math.min(reste, tranche.plafond - tranchePrecedente);
    montantImpot += montantTranche * tranche.taux;
    reste -= montantTranche;
    tranchePrecedente = tranche.plafond;
  }

  return montantImpot * partsFiscales;
}
