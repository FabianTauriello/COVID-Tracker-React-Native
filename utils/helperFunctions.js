export function formatYTickLabel(tick) {
  if (tick > 999 && tick < 1000000) {
    return tick / 1000 + "k"; // convert to K for number from > 1000 < 1 million
  } else if (tick >= 1000000) {
    return tick / 1000000 + "M"; // convert to M for number from > 1 million
  } else if (tick < 900) {
    return tick; // if value < 1000, nothing to do
  }
}
