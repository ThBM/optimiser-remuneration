import { getCoutTotalRemuneration } from "./coutTotalRemuneration";

/**
 * Optimise la rémunération d'un dirigeant entre salaire et dividendes pour minimiser les prélèvements fiscaux et sociaux.
 */
export function optimiserRemuneration(
  remunerationCible: number,
  autreRevenus: number,
  partsFiscales: number,
  salaireBrutMinimal: number,
) {
  let meilleurResultat: {
    salaireBrut: number;
    dividendesBrut: number;
    tauxPrelevementGlobal: number;
    remunerationNette: number;
    budgetTotal: number;
    chargesSocialesPatronales: number;
    impotSociete: number;
    csgDividendes: number;
    impotRevenu: number;
    optionDividendes: "PFU" | "Barème";
    coutTotal: number;
  } | null = null;

  // On teste différentes répartitions entre salaire et dividendes
  // On commence au salaire brut minimal et on augmente progressivement
  for (
    let salaireBrut = salaireBrutMinimal;
    salaireBrut <= 1_000_000;
    salaireBrut += 100
  ) {
    console.log(`Optimisation en cours... Salaire brut : ${salaireBrut} €`);
    // Pour chaque salaire, on calcule les dividendes nécessaires pour atteindre la rémunération cible
    // On fait une recherche dichotomique pour trouver le montant de dividendes optimal
    let dividendesMin = 0;
    let dividendesMax = 1_000_000;
    let tentatives = 0;
    const maxTentatives = 5_000;

    while (tentatives < maxTentatives && dividendesMax - dividendesMin > 10) {
      const dividendesBrut = (dividendesMin + dividendesMax) / 2;

      const resultat = getCoutTotalRemuneration(
        salaireBrut,
        dividendesBrut,
        autreRevenus,
        partsFiscales,
      );

      const ecart = resultat.remunerationNette - remunerationCible;

      if (Math.abs(ecart) < 1) {
        // On a trouvé une combinaison qui donne la rémunération cible
        if (
          !meilleurResultat ||
          resultat.tauxPrelevementGlobal <
            meilleurResultat.tauxPrelevementGlobal
        ) {
          meilleurResultat = {
            salaireBrut,
            dividendesBrut,
            tauxPrelevementGlobal: resultat.tauxPrelevementGlobal,
            remunerationNette: resultat.remunerationNette,
            budgetTotal: resultat.budgetTotal,
            chargesSocialesPatronales: resultat.chargesSocialesPatronales,
            impotSociete: resultat.impotSociete,
            csgDividendes: resultat.csgDividendes,
            impotRevenu: resultat.impotRevenu,
            optionDividendes: resultat.optionDividendes,
            coutTotal: resultat.coutTotal,
          };
        }
        break;
      }

      if (ecart < 0) {
        // Pas assez de rémunération nette, il faut augmenter les dividendes
        dividendesMin = dividendesBrut;
      } else {
        // Trop de rémunération nette, il faut réduire les dividendes
        dividendesMax = dividendesBrut;
      }

      tentatives++;
    }
  }

  return meilleurResultat;
}
