export function normalizeChildren(context, slotProps) {
  if (context.$scopedSlots.default) {
    return context.$scopedSlots.default(slotProps);
  }

  return context.$slots.default || [];
}
