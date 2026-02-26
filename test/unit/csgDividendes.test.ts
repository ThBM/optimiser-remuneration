import { describe, expect, it } from "vitest";
import { getCSGDividendes } from "../../app/utils/csgDividendes";

describe("csgDividendes", () => {
  it("Taux à 17.2%", () => {
    const res1 = getCSGDividendes(1000);
    expect(res1).toBeCloseTo(172, 0);
  });
});
