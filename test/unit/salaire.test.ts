import { describe, expect, it } from "vitest";
import { getCoutGlobalSalaire, getSalaireNet } from "../../app/utils/salaire";

describe("salaire", () => {
  it("getCoutGlobalSalaire - calcule le coût global avec charges patronales", () => {
    const salaireBrut = 1000;
    const coutGlobal = getCoutGlobalSalaire(salaireBrut);
    // Coût = salaire brut + 45% de charges patronales
    expect(coutGlobal).toBe(1450);
  });

  it("getSalaireNet - calcule le salaire net après charges sociales", () => {
    const salaireBrut = 1000;
    const salaireNet = getSalaireNet(salaireBrut);
    // Salaire net = salaire brut - 22% de charges sociales
    expect(salaireNet).toBe(780);
  });
});
