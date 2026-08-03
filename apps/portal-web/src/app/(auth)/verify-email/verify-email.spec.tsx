import React from "react";
// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import { act } from "react";
import { createRoot } from "react-dom/client";
import VerifyEmailPage from "./page";
import { I18nProvider } from "@/i18n/provider";

jest.mock("next/navigation", () => ({
  useSearchParams() {
    return new URLSearchParams("");
  },
}));

describe("VerifyEmailPage", () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      document.body.removeChild(container);
      container = null;
    }
  });

  it("renders missing-token error state", async () => {
    await act(async () => {
      const root = createRoot(container!);
      root.render(
        <I18nProvider>
          <VerifyEmailPage />
        </I18nProvider>,
      );
    });

    expect(container!.textContent).toContain("Баталгаажуулах токен олдсонгүй");
    expect(container!.textContent).toContain("Нэвтрэх рүү буцах");
  });
});
