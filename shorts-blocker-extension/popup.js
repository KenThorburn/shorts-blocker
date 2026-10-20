import { PLATFORMS } from './rules.js';

const { disabled = [], stats = {} } = await chrome.storage.local.get(['disabled', 'stats']);
const off = new Set(disabled);

const today = new Date().toLocaleDateString('en-CA');
document.getElementById('today').textContent = stats.date === today ? stats.today ?? 0 : 0;
document.getElementById('total').textContent = stats.total ?? 0;

const list = document.getElementById('platforms');
for (const p of PLATFORMS) {
  const li = document.createElement('li');
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = !off.has(p.id);
  input.addEventListener('change', () => {
    if (input.checked) off.delete(p.id);
    else off.add(p.id);
    chrome.storage.local.set({ disabled: [...off] });
  });
  const name = document.createElement('span');
  name.textContent = p.label;
  label.append(name, input);
  li.append(label);
  list.append(li);
}
