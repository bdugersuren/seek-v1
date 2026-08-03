import React from "react";
// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import { act } from "react";
import { createRoot } from "react-dom/client";
import RegisterPage from "./page";
import { I18nProvider } from "@/i18n/provider";

jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

describe("RegisterPage", () => {
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

  it("renders registration form", () => {
    act(() => {
      const root = createRoot(container!);
      root.render(
        <I18nProvider>
          <RegisterPage />
        </I18nProvider>,
      );
    });

    expect(container!.querySelector("input[type='email']")).toBeTruthy();
    expect(container!.querySelector("input[type='tel']")).toBeTruthy();
    expect(container!.querySelector("button[type='submit']")).toBeTruthy();
    expect(container!.textContent).toContain("Бүртгүүлэх");
  });
});
