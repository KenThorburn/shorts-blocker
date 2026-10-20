// Hiding CSS only applies while <html data-sb-hide> is set, so a disabled platform can switch it off live.
const platform = ['youtube', 'instagram', 'facebook', 'reddit'].find((id) =>
  location.hostname.includes(id),
);
const root = document.documentElement;
root.dataset.sbHide = '';

function apply(disabled = []) {
  if (disabled.includes(platform)) delete root.dataset.sbHide;
  else root.dataset.sbHide = '';
}

chrome.storage.local.get('disabled').then(({ disabled }) => apply(disabled));
chrome.storage.onChanged.addListener((changes) => {
  if (changes.disabled) apply(changes.disabled.newValue);
});
