export function elementContent(wrapper) {
  return wrapper.element.outerHTML || wrapper.element.textContent;
}
