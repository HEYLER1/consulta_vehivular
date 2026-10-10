import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { buildPlateFillScript } from '../utils/plate-autofill.ts';
function run(fields) {
  let events = [];
  class Input {
    constructor(props) { Object.assign(this, { id: '', name: '', placeholder: '', type: 'text', labels: [], disabled: false, readOnly: false, stored: '' }, props); }
    get value() { return this.stored; }
    set value(v) { this.stored = v; }
    getAttribute() { return ''; }
    dispatchEvent(e) { events.push(e.type); }
  }
  const inputs = fields.map(f => new Input(f));
  vm.runInNewContext(buildPlateFillScript('abc-123'), {
    document: { querySelectorAll: () => inputs, documentElement: {} },
    HTMLInputElement: Input, Event: class { constructor(type) { this.type = type; } },
    MutationObserver: class { observe() {} disconnect() {} }, setTimeout: () => {},
  });
  return { inputs, events };
}
test('fills only the plate field and emits input events', () => {
  const { inputs, events } = run([{ id: 'buscar' }, { id: 'txtPlaca' }]);
  assert.equal(inputs[0].value, ''); assert.equal(inputs[1].value, 'ABC123');
  assert.deepEqual(events, ['input', 'change']);
});
test('does not guess arbitrary fields or ambiguous plate fields', () => {
  assert.equal(run([{ id: 'dni' }]).inputs[0].value, '');
  assert.deepEqual(run([{ id: 'placa1' }, { id: 'placa2' }]).inputs.map(i => i.value), ['', '']);
});
test('preserves existing values and ignores hidden, disabled and readonly fields', () => {
  assert.equal(run([{ id: 'placa', stored: 'XYZ999' }]).inputs[0].value, 'XYZ999');
  for (const props of [{ type: 'hidden' }, { disabled: true }, { readOnly: true }]) assert.equal(run([{ id: 'placa', ...props }]).inputs[0].value, '');
});
test('identifies plate labels and strips unsafe input', () => {
  assert.equal(run([{ labels: [{ textContent: 'Número de placa' }] }]).inputs[0].value, 'ABC123');
  assert.equal(buildPlateFillScript(''), '');
  assert.ok(!buildPlateFillScript('";alert(1)//').includes('";alert'));
});
