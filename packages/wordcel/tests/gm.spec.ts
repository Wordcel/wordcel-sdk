import { gm } from "../src";
import { expect } from "chai";

describe("gm", async () => {
  it("should say gm", async () => {
    const value = gm();
    expect(value).to.equal("gm");
  });
});
