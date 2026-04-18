import {
  Icon,
  Toast,
  confirmAlert,
  environment,
  getPreferenceValues,
  popToRoot,
  showHUD,
  showToast,
} from "@vicinae/api";
import { TimerPreferences } from "./types";
import { existsSync, writeFileSync } from "fs";

const shortCircuitMenuBar = <T>(state: T[] | undefined, prefs: TimerPreferences): boolean => {
  return (
    (state == undefined || state.length == 0 || state.length == undefined) &&
    !["always", "onlyWhenNotRunning"].includes(prefs.showMenuBarIconWhen)
  );
};

const showHudOrToast = (args: { msg: string; launchedFromMenuBar: boolean; isErr: boolean }) => {
  const prefs: TimerPreferences = getPreferenceValues();
  if (args.launchedFromMenuBar || prefs.closeWindowOnTimerStart) {
    const msgEmoji = args.isErr ? "⚠️" : "🎉";
    showHUD(`${msgEmoji} ${args.msg}`);
    return popToRoot();
  } else {
    showToast({ style: args.isErr ? Toast.Style.Failure : Toast.Style.Success, title: args.msg });
  }
};

const showInitialRingContinuouslyWarning = async (): Promise<boolean> => {
  const RINGCONTINUOUSLY_SHOWN_PATH = environment.supportPath + "/ringContinuouslyWarningShown";
  const prefs = getPreferenceValues<TimerPreferences>();
  if (!prefs.ringContinuously) return true;
  if (existsSync(RINGCONTINUOUSLY_SHOWN_PATH)) return true;

  const result = await confirmAlert({
    title: "Ring Continuously is enabled!",
    icon: Icon.Bell,
    message:
      'When the timer rings, you will need to use the "Stop Running Timer" command or stop the timer in the "Manage Timers" command to dismiss the sound. You can configure this in your Vicinae settings.',
  });
  if (result) writeFileSync(RINGCONTINUOUSLY_SHOWN_PATH, "");
  return result;
};

export { shortCircuitMenuBar, showHudOrToast, showInitialRingContinuouslyWarning };
