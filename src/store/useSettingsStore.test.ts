import { act } from "@testing-library/react";
import { useSettingsStore } from "./useSettingsStore";

describe("useSettingsStore", () => {
  beforeEach(() => {
    // Reset Zustand store before each test
    act(() => {
      useSettingsStore.setState({ pollingInterval: 10000 });
    });
  });

  it("should return the default polling interval", () => {
    const interval = useSettingsStore.getState().pollingInterval;
    expect(interval).toBe(10000); // Default is 10 seconds
  });

  it("should update the polling interval", () => {
    act(() => {
      useSettingsStore.getState().setPollingInterval(30000); // set settings to 30s
    });

    const updatedInterval = useSettingsStore.getState().pollingInterval;
    expect(updatedInterval).toBe(30000);
  });
});
