import { describe, expect, it } from "vitest";
import {
  getBeneficeAvantImpotSociete,
  getImpotSociete,
} from "../../app/utils/impotSociete";

describe("impotSociete", () => {
  it("Impôt sur les sociétés - Bénéfice dans la tranche réduite uniquement", () => {
    const benefice = 30000;
    const impot = getImpotSociete(benefice);
    expect(impot).toBeCloseTo(4500, 0); // 30000 * 15%
  });

  it("Impôt sur les sociétés - Bénéfice exactement à la limite de la tranche réduite", () => {
    const benefice = 42500;
    const impot = getImpotSociete(benefice);
    expect(impot).toBeCloseTo(6375, 0); // 42500 * 15%
  });

  it("Impôt sur les sociétés - Bénéfice dépassant la tranche réduite", () => {
    const benefice = 100000;
    const impot = getImpotSociete(benefice);
    // 42500 * 15% + (100000 - 42500) * 25%
    // 6375 + 14375 = 20750
    expect(impot).toBeCloseTo(20750, 0);
  });

  it("Impôt sur les sociétés - Bénéfice nul", () => {
    const benefice = 0;
    const impot = getImpotSociete(benefice);
    expect(impot).toBe(0);
  });

  it("Impôt sur les sociétés - Petit bénéfice", () => {
    const benefice = 1000;
    const impot = getImpotSociete(benefice);
    expect(impot).toBeCloseTo(150, 0); // 1000 * 15%
  });

  it("Impôt sur les sociétés - Grand bénéfice", () => {
    const benefice = 200000;
    const impot = getImpotSociete(benefice);
    // 42500 * 15% + (200000 - 42500) * 25%
    // 6375 + 39375 = 45750
    expect(impot).toBeCloseTo(45750, 0);
  });

  it("Impôt sur les sociétés - Bénéfice avant impôt calculé à partir du bénéfice après impôt", () => {
    const beneficeApresImpot = 10000;
    const beneficeAvantImpot = getBeneficeAvantImpotSociete(beneficeApresImpot);
    const impotCalcule = getImpotSociete(beneficeAvantImpot);
    const beneficeCalculeApresImpot = beneficeAvantImpot - impotCalcule;

    expect(beneficeCalculeApresImpot).toBeCloseTo(beneficeApresImpot, 0);
  });
});
