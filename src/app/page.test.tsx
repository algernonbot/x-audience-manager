import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Page from "./page";

describe("X Audience Manager landing dashboard", () => {
  it("renders mocked preview, candidate review, and pricing access states", async () => {
    const element = await Page();
    const html = renderToStaticMarkup(element);

    expect(html).toContain("ManageX");
    expect(html).toContain("Login with X");
    expect(html).toContain("100 sampled accounts");
    expect(html).toContain("18 of 25 free removals left");
    expect(html).toContain("Safe-list protected");
    expect(html).toContain("48-hour Purge Pass");
    expect(html).toContain("Subscription");
  });
});
