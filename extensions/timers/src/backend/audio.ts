const escapeDoubleQuotes = (value: string) => value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const buildPlaybackCommand = (filePath: string, volume: string) => {
  const escapedPath = escapeDoubleQuotes(filePath);
  const numericVolume = Number.parseFloat(volume.replace(",", "."));
  const paplayVolume = Number.isFinite(numericVolume) ? Math.max(0, Math.min(65536, Math.round(numericVolume * 65536))) : 65536;

  return `paplay --volume=${paplayVolume} "${escapedPath}"`;
};

const buildTextToSpeechCommand = (text: string) => {
  const escapedText = escapeDoubleQuotes(text);
  return [
    `if command -v spd-say >/dev/null 2>&1; then spd-say "${escapedText}"`,
    `elif command -v espeak-ng >/dev/null 2>&1; then espeak-ng "${escapedText}"`,
    `elif command -v espeak >/dev/null 2>&1; then espeak "${escapedText}"`,
    `else echo "No supported speech synthesizer found" >&2; exit 1; fi`,
  ].join(" ; ");
};

export { buildPlaybackCommand, buildTextToSpeechCommand };
