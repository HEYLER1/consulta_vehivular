// Se rellena un único campo identificado como placa. Nunca se envía el formulario.
export function buildPlateFillScript(value: string): string {
  const plate = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!plate) return '';
  return `(function () {
    const plate = ${JSON.stringify(plate)};
    const fill = () => {
      const fields = Array.from(document.querySelectorAll('input')).filter(el => {
        if (el.disabled || el.readOnly || el.type === 'hidden' || el.type === 'password') return false;
        const labels = Array.from(el.labels || []).map(label => label.textContent || '').join(' ');
        return /placa/i.test([el.id, el.name, el.placeholder, el.getAttribute('aria-label'), labels].join(' '));
      });
      if (fields.length !== 1) return false;
      const el = fields[0];
      if (el.value) return true;
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
      setter.call(el, plate);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };
    if (!fill()) {
      const observer = new MutationObserver(() => { if (fill()) observer.disconnect(); });
      observer.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 10000);
    }
  })(); true;`;
}
