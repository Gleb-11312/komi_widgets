// widgets/mini-lm.js
// Мини "on-device" модель (bigram) + комбинированная оценка.
// Активируется только при ?ml=1. Если файла нет — всё работает как раньше.

(function (g) {
  const MiniLM = {};
  let LM = null;

  const KOMI_CHARS = " абвгдеёжзийклмнопрстуфхцчшьыъэюяӧ’--";

  function normalizeKomi(s) {
    return (s || "")
      .toLowerCase()
      .replace(/[^\u0400-\u04FF\-’\sёӧ]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildLM(allTargets) {
    const START = "^", STOP = "$";
    const chars = new Set([START, STOP, ...KOMI_CHARS.split("")]);
    const idx = [...chars].reduce((m, c, i) => ((m[c] = i), m), {});
    const N = chars.size;
    const mat = Array.from({ length: N }, () => Array(N).fill(1)); // add-1 smoothing

    for (const t of allTargets) {
      const s = normalizeKomi(t);
      if (!s) continue;
      const seq = [START, ...s.split(""), STOP];
      for (let i = 0; i < seq.length - 1; i++) {
        const a = idx[seq[i]] ?? idx[" "];
        const b = idx[seq[i + 1]] ?? idx[" "];
        mat[a][b] += 1;
      }
    }
    const logp = mat.map((row) => {
      const sum = row.reduce((x, y) => x + y, 0);
      return row.map((v) => Math.log(v / sum));
    });

    LM = { idx, logp, START, STOP };
  }

  function lmScore(textKomi) {
    if (!LM) return 50; // нейтрально
    const s = normalizeKomi(textKomi);
    if (!s) return 0;
    const { idx, logp, START, STOP } = LM;
    const seq = [START, ...s.split(""), STOP];
    let sum = 0, n = 0;
    for (let i = 0; i < seq.length - 1; i++) {
      const a = idx[seq[i]] ?? idx[" "];
      const b = idx[seq[i + 1]] ?? idx[" "];
      sum += logp[a][b];
      n++;
    }
    const avg = sum / Math.max(1, n);
    const scaled = Math.max(0, Math.min(100, Math.round((1 + avg / 4) * 100)));
    return scaled;
  }

  function editScore(rec, ref) {
    rec = (rec || "").toLowerCase();
    ref = (ref || "").toLowerCase();
    const m = [];
    for (let i = 0; i <= rec.length; i++) m[i] = [i];
    for (let j = 1; j <= ref.length; j++) m[0][j] = j;
    for (let i = 1; i <= rec.length; i++) {
      for (let j = 1; j <= ref.length; j++) {
        m[i][j] = Math.min(
          m[i - 1][j] + 1,
          m[i][j - 1] + 1,
          m[i - 1][j - 1] + (rec[i - 1] === ref[j - 1] ? 0 : 1)
        );
      }
    }
    const d = m[rec.length][ref.length];
    const max = Math.max(ref.length, 1);
    return Math.max(0, Math.min(100, Math.round(100 * (1 - d / max))));
  }

  MiniLM.init = function (dict) {
    try {
      const allTargets = Object.values(dict).filter((v) => typeof v === "string");
      buildLM(allTargets);
      MiniLM.ready = true;
      console.log("[MiniLM] ready with", allTargets.length, "samples");
    } catch (e) {
      console.warn("[MiniLM] init failed", e);
      MiniLM.ready = false;
    }
  };

  MiniLM.score = function (heard, target) {
    const edit = editScore(heard, target);
    const plaus = lmScore(target);
    return Math.round(0.7 * edit + 0.3 * plaus);
  };

  g.MiniLM = MiniLM;
})(window);
