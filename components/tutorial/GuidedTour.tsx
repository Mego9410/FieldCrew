"use client";

import { useEffect, useMemo, useState } from "react";
import { Joyride, STATUS, type Step, type EventData } from "react-joyride";

function stepTargetOrBody(selector: string): string {
  if (typeof document === "undefined") return selector;
  return document.querySelector(selector) ? selector : "body";
}

export function GuidedTour({
  enabled,
  onFinish,
}: {
  enabled: boolean;
  onFinish: () => void;
}) {
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const handler = () => setRun(true);
    window.addEventListener("fc:tutorial:start", handler as EventListener);
    return () => window.removeEventListener("fc:tutorial:start", handler as EventListener);
  }, [enabled]);

  const steps: Step[] = useMemo(() => {
    const pick = (selector: string) => stepTargetOrBody(selector);
    return [
      {
        target: pick("[data-tour='app-home']"),
        title: "Welcome to FieldCrew",
        content: "This is a quick tour of the key areas you’ll use to set up your account.",
        placement: "bottom",
        disableBeacon: true,
      },
      {
        target: pick("[data-tour='nav-workers']"),
        title: "Add your workers",
        content: "Start here to invite your crew and manage hourly rates.",
        placement: "right",
      },
      {
        target: pick("[data-tour='nav-reporting']"),
        title: "See profitability & overtime",
        content: "Reporting turns your job and time data into insights—and you can export CSV.",
        placement: "right",
      },
      {
        target: pick("[data-tour='nav-settings']"),
        title: "Company & profile settings",
        content: "Set your company info, overtime defaults, and your profile details.",
        placement: "right",
      },
    ];
  }, []);

  const handleEvent = (data: EventData) => {
    const finished = data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED;
    if (finished) {
      setRun(false);
      onFinish();
    }
  };

  if (!enabled) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
    />
  );
}

