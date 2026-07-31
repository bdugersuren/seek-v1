import React from "react";
// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import { act } from "react";
import { createRoot } from "react-dom/client";
import LoginPage from "./page";
import { I18nProvider } from "@/i18n/provider";

// Next/Navigation-ийг Mock хийх
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
    };
  },
}));

// React Redux-ийг Mock хийх
jest.mock("react-redux", () => ({
  useDispatch() {
    return jest.fn();
  },
}));

describe("LoginPage Unit Tests", () => {
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

  it("renders login form labels and inputs successfully", () => {
    act(() => {
      const root = createRoot(container!);
      root.render(
        <I18nProvider>
          <LoginPage />
        </I18nProvider>,
      );
    });

    const emailInput = container!.querySelector("input[type='email']");
    const passwordInput = container!.querySelector("input[type='password']");
    const submitButton = container!.querySelector("button[type='submit']");

    expect(emailInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(submitButton).toBeTruthy();
    expect(container!.textContent).toContain("seek.mn Нэвтрэх");
  });
});
