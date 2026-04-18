import { Action, ActionPanel, environment, getPreferenceValues, List } from "@vicinae/api";
import { exec } from "child_process";
import { TimerPreferences } from "./backend/types";
import { soundData } from "./backend/soundData";
import { buildPlaybackCommand, buildTextToSpeechCommand } from "./backend/audio";

export default function Command() {
  const prefs = getPreferenceValues<TimerPreferences>();

  const playSound = (fileName: string) => {
    if (fileName === "speak_timer_name") {
      exec(buildTextToSpeechCommand("Untitled Timer"));
    } else {
      const selectedSoundPath = `${environment.assetsPath}/${fileName}`;
      exec(buildPlaybackCommand(selectedSoundPath, prefs.volumeSetting));
    }
  };

  return (
    <List>
      {soundData.map((item, index) => (
        <List.Item
          key={index}
          icon={item.icon}
          title={item.value === prefs.selectedSound ? `${item.title} (currently selected)` : item.title}
          actions={
            <ActionPanel>
              <Action title="Play Sound" onAction={() => playSound(item.value)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
