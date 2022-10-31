// Run test cases in a sequence
describe("Wordcel SDK Testcases", async () => {
  require("./gm.spec");
  require("./profile.spec");
  require("./post.spec");
  require("./connections.spec");
});