export function insertSplit(splits, split, idx, oldIdx = -1) {
  const newSplits = [];

  splits = formatSplits(
    oldIdx > -1 ? splits.filter((_, i) => i !== oldIdx) : splits
  );

  splits.forEach((s, i) => {
    if (idx < i) {
      if (s.position < split.position) newSplits.push(s);
      else newSplits.push({ ...s, position: s.position + 1 });
      return;
    }

    if (idx === i) {
      newSplits.push(split);
    }

    if (s.position < split.position) newSplits.push(s);
    else newSplits.push({ ...s, position: s.position + 1 });
  });

  if (idx >= splits.length) newSplits.push(split);

  return newSplits;
}

export function formatSplits(splits) {
  const positions = splits.map(s => s.position).sort((a, b) => a - b);

  if (positions.every((s, i) => s === i)) return splits;

  const newSplits = splits.map(s => ({ ...s }));

  let lastPosition = -1;
  for (let pos of positions) {
    const s = newSplits.find(s => s.position === pos);
    if (!s) continue;

    s.position = lastPosition + 1;

    lastPosition++;
  }

  return newSplits;
}
