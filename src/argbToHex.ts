function redFromArgb(argb: number): number {
  return (argb >> 16) & 255;
}

function greenFromArgb(argb: number): number {
  return (argb >> 8) & 255;
}

function blueFromArgb(argb: number): number {
  return argb & 255;
}

export function argbToHex(argb: number): string {
  const r = redFromArgb(argb);
  const g = greenFromArgb(argb);
  const b = blueFromArgb(argb);
  const outParts = [r.toString(16), g.toString(16), b.toString(16)];
  for (const [i, part] of outParts.entries()) {
    if (part.length === 1) {
      outParts[i] = "0" + part;
    }
  }
  return "#" + outParts.join("");
}
