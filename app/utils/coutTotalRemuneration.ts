import { getCoutGlobalSalaire, getSalaireNet } from "./salaire";
import { getBeneficeAvantImpotSociete } from "./impotSociete";
import { getCSGDividendes } from "./csgDividendes";
import { getImpotRevenu } from "./impotRevenu";

export function getCoutTotalRemuneration(
  salaireBrut: number,
  dividendesBrut: number,
  autreRevenus: number,
  partsFiscales: number,
): {
  remunerationNette: number;
  chargesSocialesPatronales: number;
  impotSociete: number;
  csgDividendes: number;
  impotRevenu: number;
  optionDividendes: "PFU" | "Barème";
  coutTotal: number;
  budgetTotal: number;
  tauxPrelevementGlobal: number;
} {
  // Chages sociales patronales sur le salaire
  const chargesPatronales = getCoutGlobalSalaire(salaireBrut) - salaireBrut;
  const salaireNet = getSalaireNet(salaireBrut);
  const chargesSocialesPatronales =
    chargesPatronales + salaireBrut - salaireNet;

  // Impôt sur les sociétés
  const beneficeNet = dividendesBrut;
  const beneficeAvantIS = getBeneficeAvantImpotSociete(beneficeNet);
  const impotSociete = beneficeAvantIS - beneficeNet;

  // CSG sur les dividendes
  const csgDividendes = getCSGDividendes(dividendesBrut);

  // Impôt sur le revenu (on calcule la différence sans remuneration et avec remuneration)
  // Avant remuneration
  const irAvant = getImpotRevenu(autreRevenus, partsFiscales, 0);
  // Après remuneration
  const irApres = getImpotRevenu(
    salaireNet + autreRevenus,
    partsFiscales,
    dividendesBrut,
  );

  const impotRevenu = irApres.montant - irAvant.montant;

  const remunerationNette =
    salaireNet + dividendesBrut - csgDividendes - impotRevenu;

  const coutTotal =
    chargesSocialesPatronales + impotSociete + csgDividendes + impotRevenu;

  const budgetTotal = coutTotal + remunerationNette;

  const tauxPrelevementGlobal = 1 - remunerationNette / budgetTotal;

  return {
    remunerationNette,
    chargesSocialesPatronales,
    impotSociete,
    csgDividendes,
    impotRevenu,
    optionDividendes: irApres.optionDividendes,
    coutTotal,
    budgetTotal,
    tauxPrelevementGlobal,
  };
}
