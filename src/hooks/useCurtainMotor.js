// FILE: src/hooks/useCurtainMotor.js
// Drives curtain position via interval when moving=true
// ─────────────────────────────────────────────
import { useEffect } from "react";
import { useDeviceStore } from "../state/useDeviceStore";

export function useCurtainMotor(deviceId) {
  const device = useDeviceStore((s) => s.devices.find((d) => d.id === deviceId));
  const tickCurtain = useDeviceStore((s) => s.tickCurtain);

  useEffect(() => {
    if (!device?.moving) return;
    const id = setInterval(() => tickCurtain(deviceId), 70);
    return () => clearInterval(id);
  }, [device?.moving, deviceId, tickCurtain]);
}