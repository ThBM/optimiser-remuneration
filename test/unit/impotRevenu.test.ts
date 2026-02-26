import { describe, expect, it } from "vitest";
import { getImpotRevenu } from "../../app/utils/impotRevenu";

describe("impotRevenu", () => {
  it("Seulement revenus", () => {
    const res1 = getImpotRevenu(50_000, 2, 0);
    expect(res1.montant).toBeCloseTo(2420.66, 0);
  });

  it("Revenus + dividendes => Barème", () => {
    const res2 = getImpotRevenu(50_000, 2, 10_000);
    expect(res2.montant).toBeCloseTo(3080.66, 0);
    expect(res2.optionDividendes).toBe("Barème");
  });

  it("Revenus + dividendes => PFU", () => {
    const res3 = getImpotRevenu(75_000, 2, 10_000);
    expect(res3.montant).toBeCloseTo(7860.96, 0);
    expect(res3.optionDividendes).toBe("PFU");
  });
});
