import test from 'node:test';
import assert from 'node:assert/strict';
import { extractPlateCandidates as parse, candidatesInRegion, PlateConsensus } from '../utils/plate-recognition.ts';

test('normalizes common plates without inventing a prefix', () => {
  assert.deepEqual(parse('abc 123'), [{ plate: 'ABC-123', corrected: false }]);
  assert.equal(parse('A0C-123')[0].plate, 'A0C-123');
  assert.equal(parse('PERÚ\nA1B-234')[0].plate, 'A1B-234');
});
test('rejects words, fragments, long IDs and cross-line concatenation', () => {
  for (const text of ['PERU', 'ABCDEF', 'ABC\n123', 'ABC/123', 'ABC1234', 'XABC123', '123456', 'ABC-OO1']) assert.deepEqual(parse(text), [], text);
});
test('allows only one conservative numeric-suffix correction', () => {
  assert.deepEqual(parse('ABC-12O'), [{ plate: 'ABC-120', corrected: true }]);
  assert.equal(parse('ABC-120 ABC-12O')[0].corrected, false);
});
test('only sufficiently large text fully in the guide is eligible', () => {
  const line = { text: 'ABC123', cx: 360, cy: 640, width: 260, height: 50 };
  assert.equal(candidatesInRegion([line], 720, 1280).length, 1);
  assert.deepEqual(candidatesInRegion([{ ...line, cy: 100 }], 720, 1280), []);
  assert.deepEqual(candidatesInRegion([{ ...line, height: 5 }], 720, 1280), []);
  assert.deepEqual(candidatesInRegion([{ ...line, cx: NaN }], 720, 1280), []);
});
test('three independent readings confirm; duplicates do not', () => {
  const gate = new PlateConsensus(), plate = parse('ABC123');
  assert.equal(gate.observe(plate, 1000).ready, false);
  assert.equal(gate.observe(plate, 1000), null);
  assert.equal(gate.observe(plate, 1100), null);
  assert.equal(gate.observe(plate, 1300).ready, false);
  assert.equal(gate.observe(plate, 1600).ready, true);
});
test('corrected characters require five readings', () => {
  const gate = new PlateConsensus();
  for (let i = 0; i < 4; i++) assert.equal(gate.observe(parse('ABC12O'), 1000 + i * 300).ready, false);
  assert.equal(gate.observe(parse('ABC12O'), 2200).ready, true);
});
test('conflicting, empty and multiple-plate frames cannot confirm', () => {
  const gate = new PlateConsensus();
  gate.observe(parse('ABC123'), 1000);
  gate.observe(parse('ABC123'), 1300);
  assert.equal(gate.observe(parse('DEF456 ABC123'), 1600), null);
  assert.equal(gate.observe([], 1900), null);
  assert.equal(gate.observe(parse('ABC123'), 2200).ready, false);
});
test('stale readings and previous sessions never confirm', () => {
  const gate = new PlateConsensus(), plate = parse('ABC123');
  gate.observe(plate, 1000); gate.observe(plate, 1300);
  assert.equal(gate.observe(plate, 5000).matches, 1);
  gate.reset();
  assert.equal(gate.observe(plate, 5500).matches, 1);
});
