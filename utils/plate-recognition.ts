/** Common six-character plates only; other formats remain editable manually. */
export type PlateCandidate = { plate: string; corrected: boolean };
export type OcrLine = { text: string; cx: number; cy: number; width: number; height: number };
export const SCAN_REGION = { left: 0.08, top: 0.39, width: 0.84, height: 0.22 };

export function extractPlateCandidates(text: string): PlateCandidate[] {
  const candidates = new Map<string, PlateCandidate>();
  // Never concatenate different lines, strip arbitrary punctuation, or guess the prefix.
  const pattern = /(?:^|[^A-Z0-9])([A-Z][A-Z0-9]{2})[ \t\-–]?([0-9OQDISBZ]{3})(?=$|[^A-Z0-9])/g;
  const substitutions: Record<string, string> = { O: '0', Q: '0', D: '0', I: '1', S: '5', B: '8', Z: '2' };
  for (const line of text.toUpperCase().split(/[\r\n]+/)) {
    for (const match of line.matchAll(pattern)) {
      const suffix = match[2];
      const mistakes = [...suffix].filter(c => !/[0-9]/.test(c)).length;
      if (mistakes > 1) continue;
      const plate = `${match[1]}-${[...suffix].map(c => substitutions[c] ?? c).join('')}`;
      const previous = candidates.get(plate);
      candidates.set(plate, { plate, corrected: mistakes > 0 && previous?.corrected !== false });
    }
  }
  return [...candidates.values()];
}

export function candidatesInRegion(lines: OcrLine[], width: number, height: number): PlateCandidate[] {
  if (!(width > 0 && height > 0)) return [];
  const found = new Map<string, PlateCandidate>();
  for (const line of lines) {
    const x = line.cx / width, y = line.cy / height;
    const w = line.width / width, h = line.height / height;
    const r = SCAN_REGION;
    // Require the whole line inside the visible guide, with a small optical margin.
    if (!Number.isFinite(x + y + w + h) || w <= 0 || h <= 0 ||
        x - w / 2 < r.left - 0.02 || x + w / 2 > r.left + r.width + 0.02 ||
        y - h / 2 < r.top - 0.02 || y + h / 2 > r.top + r.height + 0.02 ||
        line.height < 12) continue;
    for (const c of extractPlateCandidates(line.text)) {
      const previous = found.get(c.plate);
      found.set(c.plate, { ...c, corrected: c.corrected && previous?.corrected !== false });
    }
  }
  return [...found.values()];
}

type Observation = { at: number; candidate: PlateCandidate | null };
export type PlateProgress = { plate: string; matches: number; required: number; ready: boolean; corrected: boolean };
export class PlateConsensus {
  private observations: Observation[] = [];
  private lastAt = -Infinity;
  reset() { this.observations = []; this.lastAt = -Infinity; }
  observe(candidates: PlateCandidate[], at: number): PlateProgress | null {
    // Cached/duplicate/out-of-order callbacks must never count as fresh evidence.
    if (!Number.isFinite(at) || at - this.lastAt < 180) return null;
    this.lastAt = at;
    const unique = [...new Map(candidates.map(c => [c.plate, c])).values()];
    const candidate = unique.length === 1 ? unique[0] : null;
    this.observations = this.observations.filter(o => at - o.at <= 2200).slice(-5);
    this.observations.push({ at, candidate });
    if (!candidate) return null;
    const matching = this.observations.filter(o => o.candidate?.plate === candidate.plate);
    const corrected = matching.some(o => o.candidate?.corrected);
    const required = corrected ? 5 : 3;
    const ready = matching.length >= required && matching.length / this.observations.length >= 0.8 &&
      at - matching[0].at >= 450;
    return { plate: candidate.plate, matches: matching.length, required, ready, corrected };
  }
}
