import { describe, it, expect } from 'vitest';
import { createModal } from '../../src/ui/modal.js';
import { renderGrid } from '../../src/ui/grid.js';
import { loadSets, setActiveSet, isTileUsed } from '../../src/state/appState.js';

describe('modal UI and grid interactions', () => {
  it('marks tile used and opens modal', () => {
    document.body.innerHTML = '<div id="root"></div>';
    loadSets([{ id: 's1', title: 'Set', questions: Array.from({ length: 54 }, (_, i) => `Q${i + 1}`) }]);
    setActiveSet('s1');
    const modal = createModal();
    const root = document.getElementById('root');
    renderGrid(root, (_tile, question) => modal.open(question));
    const firstTile = root.querySelector('.tile');
    firstTile.click();
    expect(isTileUsed(1)).toBe(true);
    expect(document.body.contains(modal.overlay)).toBe(true);
    modal.close();
  });
});
