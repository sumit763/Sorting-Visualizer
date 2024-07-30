mycanvas.width = 400;
mycanvas.height = 400;
const margin = 30;
const n = 20;
const array = [];
let moves = [];
const cols = [];
const spacing = (mycanvas.width - margin * 2) / n;
const ctx = mycanvas.getContext("2d");

const maxCloumnHeight = 200;
init();

let audioCtx = null;
function playnote(frequency, type) {
  if (audioCtx == null) {
    audioCtx = new (AudioContext ||
      webkitAudioContext ||
      window.webkitAudioContext)();
  }
  const duration = 0.2;
  const oscilation = audioCtx.createOscillator();
  oscilation.frequency.value = frequency;
  oscilation.start();
  oscilation.type;
  oscilation.stop(audioCtx.currentTime + duration);

  const node = audioCtx.createGain();
  node.gain.value = 0.4;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
  oscilation.connect(node);
  node.connect(audioCtx.destination);
}

function init() {
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  moves = [];
  for (let i = 0; i < array.length; i++) {
    const x = i * spacing + spacing / 2 + margin;
    const y = mycanvas.height - margin - i * 2.4;
    const width = spacing - 4;
    const height = maxCloumnHeight * array[i];
    cols[i] = new Column(x, y, width, height);
  }
}
function play() {
  moves = bblSort(array);
}

animate();
function bblSort(array) {
  const moves = [];
  let swapped;
  do {
    swapped = false;
    for (let i = 1; i < array.length; i++) {
      if (array[i - 1] > array[i]) {
        swapped = true;
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        moves.push({ indices: [i - 1, i], swap: true });
      } else {
        moves.push({ indices: [i - 1, i], swap: false });
      }
    }
  } while (swapped);
  return moves;
}

function animate() {
  ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
  let change = false;
  for (let i = 0; i < cols.length; i++) {
    change = cols[i].draw(ctx) || change;
  }

  if (!change && moves.length > 0) {
    const move = moves.shift();
    const [i, j] = move.indices;
    const waveformType = move.swap ? "square" : "triangle";
    playnote(cols[i].height + cols[j].height, waveformType);
    if (move.swap) {
      cols[i].moveTo(cols[j]);
      cols[j].moveTo(cols[i], -1);
      [cols[i], cols[j]] = [cols[j], cols[i]];
    } else {
      cols[i].jump();
      cols[j].jump();
    }
  }
  requestAnimationFrame(animate);
}
