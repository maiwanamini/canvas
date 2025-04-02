export const tileSize = 72;

export const tilemap = [
  "1111111111111111",
  "1000000000000001",
  "1011111011111101",
  "1000000000000001",
  "1111011111011111",
  "1000001000000001",
  "1011101110111011",
  "1000000000000001",
  "1111111111111111"
];

export function drawMap(ctx) {
  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;

  const mapWidth = tilemap[0].length * tileSize;
  const mapHeight = tilemap.length * tileSize;

  // Bereken de offset om de map in het midden te plaatsen
  const offsetX = (canvasWidth - mapWidth) / 2;
  const offsetY = (canvasHeight - mapHeight) / 2;

  // Teken de tiles, met de juiste offset om de map te centreren
  for (let y = 0; y < tilemap.length; y++) {
    for (let x = 0; x < tilemap[y].length; x++) {
      const tile = tilemap[y][x];
      if (tile === "1") {
        ctx.fillStyle = "#444";
        ctx.fillRect(x * tileSize + offsetX, y * tileSize + offsetY, tileSize, tileSize);
      }
    }
  }
}

export function isBlocked(x, y) {
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  // Bereken de offsets voor het controleren van collision
  const mapWidth = tilemap[0].length * tileSize;
  const mapHeight = tilemap.length * tileSize;

  const offsetX = (canvasWidth - mapWidth) / 2;
  const offsetY = (canvasHeight - mapHeight) / 2;

  const col = Math.floor((x - offsetX) / tileSize);
  const row = Math.floor((y - offsetY) / tileSize);

  if (
    row < 0 ||
    row >= tilemap.length ||
    col < 0 ||
    col >= tilemap[0].length
  ) {
    return true;
  }
  return tilemap[row][col] === "1";
}
