import { describe, it, expect } from 'vitest';
import { loadSets, setActiveSet, getQuestionForTile, markTileUsed, isTileUsed, resetOpenedTiles } from '../../src/state/appState.js';

describe('appState', () => {
  const sample = [
    { id: 'a', title: 'Set A', questions: Array.from({ length: 54 }, (_, i) => `A${i + 1}`) },
    { id: 'b', title: 'Set B', questions: Array.from({ length: 54 }, (_, i) => `B${i + 1}`) },
  ];

  it('loads sets and selects first', () => {
    loadSets(sample);
    expect(getQuestionForTile(1)).toBe('A1');
  });

  it('switches active set and resets tiles', () => {
    markTileUsed(1);
    expect(isTileUsed(1)).toBe(true);
    setActiveSet('b');
    expect(isTileUsed(1)).toBe(false);
    expect(getQuestionForTile(1)).toBe('B1');
  });

  it('marks tiles used within bounds only', () => {
    resetOpenedTiles();
    markTileUsed(55);
    expect(isTileUsed(55)).toBe(false);
    markTileUsed(10);
    expect(isTileUsed(10)).toBe(true);
  });
});
