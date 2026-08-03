import React from "react";
// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import { act } from "react";
import { createRoot } from "react-dom/client";
import { ToastProvider } from "@seek/ui";
import CandidateOnboardingPage from "./page";

jest.mock("next/navigation", () => ({
  useRouter() {
    return { push: jest.fn() };
  },
  useSearchParams() {
    return new URLSearchParams("");
  },
}));

jest.mock(
  "@/features/profile/api",
  () => ({
    getCandidateProfile: jest.fn().mockResolvedValue({
      userId: "user-1",
      displayName: "",
      phoneNumber: "",
      organisation: "",
      country: "Монгол",
      preferredLanguage: "mn",
      isComplete: false,
      missingFields: ["displayName", "phoneNumber"],
    }),
    updateCandidateProfile: jest.fn(),
  }),
  { virtual: true },
);

describe("CandidateOnboardingPage", () => {
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

  it("renders profile completion form", async () => {
    await act(async () => {
      const root = createRoot(container!);
      root.render(
        <ToastProvider>
          <CandidateOnboardingPage />
        </ToastProvider>,
      );
    });

    expect(container!.textContent).toContain("Профайл мэдээлэл");
    expect(container!.textContent).toContain("Овог нэр");
    expect(container!.textContent).toContain("Утасны дугаар");
    expect(container!.textContent).toContain("Хадгалах");
  });
});
