import React from "react";
// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { Button } from "../src/components/forms/Button";
import { Input } from "../src/components/forms/Input";
import { Checkbox } from "../src/components/forms/Checkbox";
import { Switch } from "../src/components/forms/Switch";
import { Alert } from "../src/components/feedback/Alert";
import { Tabs } from "../src/components/navigation/Tabs";
import { AppShell } from "../src/components/layout/AppShell";

describe("UI Components Accessibility and Behavior Tests", () => {
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

  it("renders Button correctly with variant classes", () => {
    act(() => {
      const root = createRoot(container!);
      root.render(<Button variant="primary">Илгээх</Button>);
    });
    const button = container!.querySelector("button");
    expect(button).toBeTruthy();
    expect(button!.textContent).toBe("Илгээх");
    expect(button!.className).toContain("bg-primary");
  });

  it("renders Input with ref forwarding", () => {
    const ref = React.createRef<HTMLInputElement>();
    act(() => {
      const root = createRoot(container!);
      root.render(
        <Input ref={ref} id="username-input" defaultValue="Test User" />,
      );
    });
    const input = container!.querySelector("input");
    expect(input).toBeTruthy();
    expect(ref.current).toBe(input);
    expect(input!.value).toBe("Test User");
  });

  it("renders Checkbox and supports default checked", () => {
    act(() => {
      const root = createRoot(container!);
      root.render(<Checkbox label="Зөвшөөрөх" defaultChecked />);
    });
    const checkbox = container!.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
  });

  it("renders Switch with peer selectors toggle styles", () => {
    act(() => {
      const root = createRoot(container!);
      root.render(<Switch label="Идэвхжүүлэх" />);
    });
    const switchInput = container!.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(switchInput).toBeTruthy();
    expect(container!.textContent).toContain("Идэвхжүүлэх");
  });

  it("renders Alert with correct role and alert classes", () => {
    act(() => {
      const root = createRoot(container!);
      root.render(
        <Alert type="danger" title="Алдаа">
          Үйлдэл амжилтгүй
        </Alert>,
      );
    });
    const alert = container!.querySelector("[role='alert']");
    expect(alert).toBeTruthy();
    expect(alert!.className).toContain("bg-danger-background");
    expect(alert!.textContent).toContain("Алдаа");
    expect(alert!.textContent).toContain("Үйлдэл амжилтгүй");
  });

  it("renders Tabs and handles aria role mapping", () => {
    const tabs = [
      { id: "tab1", label: "Tab 1", content: "Content 1" },
      { id: "tab2", label: "Tab 2", content: "Content 2" },
    ];
    act(() => {
      const root = createRoot(container!);
      root.render(<Tabs tabs={tabs} defaultTabId="tab1" />);
    });
    const tablist = container!.querySelector("[role='tablist']");
    expect(tablist).toBeTruthy();

    const firstTab = container!.querySelector("#tab-tab1");
    expect(firstTab).toBeTruthy();
    expect(firstTab!.getAttribute("aria-selected")).toBe("true");
  });

  it("renders AppShell layout pieces correctly", () => {
    act(() => {
      const root = createRoot(container!);
      root.render(
        <AppShell
          headerLogo={<div>Logo</div>}
          sidebarContent={<div>Sidebar Link</div>}
        >
          <div>Main Content</div>
        </AppShell>,
      );
    });
    expect(container!.textContent).toContain("Logo");
    expect(container!.textContent).toContain("Sidebar Link");
    expect(container!.textContent).toContain("Main Content");
  });
});
