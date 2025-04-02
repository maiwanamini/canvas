// Perlin Noise by Stefan Gustavson
// https://github.com/josephg/noisejs

const noise = (() => {
  let module = {};

  let perm = new Uint8Array(512);
  let grad3 = [
    [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
    [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
    [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
  ];

  function seed(seed) {
    if(seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if(seed < 256) seed |= seed << 8;
    for(let i = 0; i < 256; i++) {
      let v;
      if(i & 1) {
        v = perm[i] ^ (seed & 255);
      } else {
        v = perm[i] ^ ((seed>>8) & 255);
      }
      perm[i] = perm[i + 256] = v;
    }
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(a, b, t) {
    return (1 - t) * a + t * b;
  }

  function grad(hash, x, y) {
    let h = hash & 15;
    let u = h<8 ? x : y;
    let v = h<4 ? y : h===12||h===14 ? x : 0;
    return ((h&1) ? -u : u) + ((h&2) ? -v : v);
  }

  function perlin2(x, y) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    let u = fade(x);
    let v = fade(y);
    let aa = perm[X+perm[Y]];
    let ab = perm[X+perm[Y+1]];
    let ba = perm[X+1+perm[Y]];
    let bb = perm[X+1+perm[Y+1]];

    return lerp(
      lerp(grad(aa, x, y), grad(ba, x-1, y), u),
      lerp(grad(ab, x, y-1), grad(bb, x-1, y-1), u),
      v
    );
  }

  seed(Math.random());
  module.perlin2 = perlin2;
  return module;
})();