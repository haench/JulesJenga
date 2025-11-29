import { getQuestionForTile, isTileUsed, markTileUsed } from '../state/appState.js';

export function renderGrid(container, onSelect) {
  const grid = document.createElement('div');
  grid.className = 'grid';
  const help = document.createElement('p');
  help.className = 'muted';
  help.textContent = 'Tap a tile to reveal its question. Used tiles are dimmed for this session.';
  container.appendChild(help);
  for (let i = 1; i <= 54; i++) {
    const tile = document.createElement('button');
    tile.className = 'tile';
    tile.type = 'button';
    tile.textContent = i.toString();
    tile.dataset.tile = i.toString();
    tile.setAttribute('aria-pressed', 'false');
    tile.addEventListener('click', () => {
      const question = getQuestionForTile(i);
      if (!question) return;
      markTileUsed(i);
      tile.classList.add('used');
      tile.setAttribute('aria-pressed', 'true');
      onSelect(i, question);
    });
    if (isTileUsed(i)) {
      tile.classList.add('used');
      tile.setAttribute('aria-pressed', 'true');
    }
    grid.appendChild(tile);
  }
  container.appendChild(grid);
  return grid;
}
