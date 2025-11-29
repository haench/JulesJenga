const state = {
  activeSetId: null,
  activeSet: null,
  sets: [],
  openedTileIds: new Set(),
};

export function loadSets(sets) {
  state.sets = sets;
  if (!state.activeSetId && sets.length) {
    setActiveSet(sets[0].id);
  }
  return state.sets;
}

export function setActiveSet(setId) {
  state.activeSetId = setId;
  state.activeSet = state.sets.find((s) => s.id === setId) || null;
  resetOpenedTiles();
  return state.activeSet;
}

export function getActiveSet() {
  return state.activeSet;
}

export function markTileUsed(tileNumber) {
  if (tileNumber < 1 || tileNumber > 54) return;
  state.openedTileIds.add(tileNumber);
}

export function isTileUsed(tileNumber) {
  return state.openedTileIds.has(tileNumber);
}

export function resetOpenedTiles() {
  state.openedTileIds.clear();
}

export function getQuestionForTile(tileNumber) {
  if (!state.activeSet || !state.activeSet.questions) return null;
  return state.activeSet.questions[tileNumber - 1] || null;
}

export function getStateSnapshot() {
  return {
    activeSetId: state.activeSetId,
    openedTileIds: Array.from(state.openedTileIds),
  };
}
