"""Trilhas originais para os Reels (síntese local, sem licença de terceiros).
Uso: make_music2.py estilo duracao_s saida.wav"""
import sys, wave
import numpy as np

SR = 48000
style, DUR, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
rng = np.random.default_rng(5)
N = int(SR * DUR)


def midi(n): return 440 * 2 ** ((n - 69) / 12)
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
def hp(x, k): return x - lp(x, k)
def tt(d): return np.arange(int(SR * d)) / SR


def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf) or i < 0: return
    j = min(len(buf), i + len(x)); buf[i:j] += x[: j - i] * g


def tone(f, d, harm=((1, 1), (2, .25), (3, .08)), a=.01, r=.3, det=0.0, dk=0.0):
    t = tt(d)
    x = sum(g * np.sin(2 * np.pi * f * h * (1 + det) * t) for h, g in harm)
    e = np.clip(np.minimum(t / a, 1) * np.minimum((d - t) / r, 1), 0, 1) * np.exp(-t * dk)
    return x * e


def kick(g=1.0):
    t = tt(0.28); f = 50 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11) * g
def snare(g=1.0):
    t = tt(0.22); n = hp(rng.standard_normal(len(t)), 8)
    return (n * np.exp(-t * 22) * .7 + np.sin(2 * np.pi * 190 * t) * np.exp(-t * 28) * .5) * g
def clap(g=1.0):
    x = np.zeros(int(SR * .25))
    for o in (0, .012, .026):
        add(x, hp(rng.standard_normal(int(SR * .12)), 6) * np.exp(-tt(.12) * 40), o)
    return lp(x, 2) * g
def hat(g=1.0, op=False):
    d = .22 if op else .05; t = tt(d)
    return hp(rng.standard_normal(len(t)), 3) * np.exp(-t * (14 if op else 70)) * g
def tick(g=1.0, hi=True):
    t = tt(.03); return np.sin(2 * np.pi * (2100 if hi else 1300) * t) * np.exp(-t * 130) * g


# ---------- configuração por estilo ----------
M = lambda *n: list(n)
S = {
 # lo-fi leve 90 BPM
 "lofi": dict(bpm=90, chords=[(M(57, 60, 64, 67), 45), (M(53, 57, 60, 64), 41), (M(48, 52, 55, 59), 36), (M(55, 59, 62, 65), 43)],
              kick="x.....x...x.....", snare="....x.......x...", hat="x.x.x.x.x.x.x.x.", swing=.12, soft=True, pad=.5, bass=.5, pluck="rhodes", crackle=True, vol=(1, .7, .5)),
 # eletrônico minimalista constante 118 BPM
 "mini": dict(bpm=118, chords=[(M(57, 60, 64), 45), (M(57, 60, 64), 45), (M(55, 59, 62), 43), (M(53, 57, 60), 41)],
              kick="x...x...x...x...", snare="................", hat="..x...x...x...x.", swing=0, pad=.25, bass=.55, pluck="arp16", bassp="x.xx.xx.x.xx.xx.", vol=(.9, .8, .4)),
 # tenso -> positivo 100 BPM (troca em switch)
 "tense": dict(bpm=100, chords=[(M(50, 53, 57), 38), (M(46, 50, 53), 34)] * 2, kick="x..x..x...x..x..", snare="....x.......x...", hat="x.x.x.x.x.x.x.xx", swing=0, pad=.35, bass=.7, pluck="stab", bassp="x.......x.......",
               switch=True, chords2=[(M(53, 57, 60), 41), (M(48, 52, 55), 36), (M(57, 60, 64), 45), (M(55, 59, 62), 43)], vol=(1, .8, .5)),
 # pop alegre 112 BPM
 "pop": dict(bpm=112, chords=[(M(60, 64, 67), 48), (M(55, 59, 62), 43), (M(57, 60, 64), 45), (M(53, 57, 60), 41)], kick="x...x...x...x...", snare="....c.......c...", hat="x.xxx.xxx.xxx.xx",
             swing=0, pad=.3, bass=.5, pluck="bright8", bassp="x..x..x.x..x..x.", vol=(1, .8, .55)),
 # lo-fi bem-humorado 86 BPM
 "quirk": dict(bpm=86, chords=[(M(60, 64, 67, 71), 48), (M(57, 60, 64, 67), 45), (M(62, 65, 69, 72), 50), (M(55, 59, 62, 65), 43)], kick="x..x..x.x..x....", snare="....c.......c...", hat="..x...x...x...x.",
               swing=.1, soft=True, pad=.35, bass=.6, pluck="uke", bassp="x..x..x.x..x..x.", vol=(.9, .8, .6)),
 # build-up -> drop 124 BPM
 "build": dict(bpm=124, chords=[(M(57, 60, 64), 45), (M(53, 57, 60), 41), (M(48, 52, 55), 36), (M(55, 59, 62), 43)], kick="x...x...x...x...", snare="....c.......c...", hat="x.x.x.x.x.x.x.x.",
               swing=0, pad=.4, bass=.65, pluck="arp16", bassp="x.xx.xx.x.xx.xx.", build=True, vol=(1, .8, .5)),
 # hip-hop 95 BPM
 "hiphop": dict(bpm=95, chords=[(M(57, 60, 64, 67), 33), (M(53, 57, 60, 64), 29), (M(55, 58, 62, 65), 31), (M(52, 55, 59, 62), 28)], kick="x.......x.x.....", snare="....x.......x...", hat="x.x.x.x.x.x.x.xx",
            swing=.08, pad=.3, bass=.8, pluck="rhodes", bassp="x.......x.x.....", crackle=True, vol=(1, .85, .5)),
 # relógio/tique-taque 100 BPM
 "tick": dict(bpm=100, chords=[(M(60, 64, 67, 71), 48), (M(57, 60, 64, 67), 45)], kick="x.......x.......", snare="................", hat="................", swing=0, pad=.55, bass=.35, pluck="rhodes", tickbeat=True, vol=(.9, .7, .5)),
 # corporativo leve 100 BPM
 "corp": dict(bpm=100, chords=[(M(60, 64, 67, 71), 48), (M(55, 59, 62, 66), 43), (M(57, 60, 64, 67), 45), (M(53, 57, 60, 64), 41)], kick="x.......x.......", snare="....c.......c...", hat="x.x.x.x.x.x.x.x.",
          swing=0, pad=.45, bass=.4, pluck="bright8", bassp="x.......x.......", vol=(.8, .7, .5)),
 # inspirador crescente 92 BPM
 "inspire": dict(bpm=92, chords=[(M(57, 60, 64), 45), (M(53, 57, 60), 41), (M(48, 52, 55), 36), (M(55, 59, 62), 43)], kick="x.......x.......", snare="....c.......c...", hat="x.x.x.x.x.x.x.x.",
                 swing=0, pad=.5, bass=.5, pluck="arp8", bassp="x.......x.......", grow=True, switch=True, chords2=[(M(60, 64, 67), 48), (M(55, 59, 62), 43), (M(57, 60, 64), 45), (M(53, 57, 60), 41)], vol=(1, .8, .5)),
}
C = S[style]
bpm = C["bpm"]; beat = 60 / bpm; step = beat / 4; bar = 4 * beat
sw = C.get("swing", 0)
switch_t = DUR * 0.62  # "tense"/"inspire": virada para o lado positivo
build_t = DUR * 0.68    # "build": onde o drop acontece
BR = min(8 * bar, build_t * 0.85)  # duração do build-up
pad_b, bass_b, hat_b, kick_b, sn_b = (np.zeros(N) for _ in range(5))
pluck_b = np.zeros(N)

nbars = int(DUR / bar) + 2
for b in range(nbars):
    t0 = b * bar
    chs = C["chords"]
    if C.get("switch") and t0 >= switch_t:
        chs = C["chords2"]
    notes, root = chs[(b // (2 if len(chs) > 2 and style != "tick" else 1)) % len(chs)] if style != "tick" else chs[(b // 2) % len(chs)]
    grow = (0.35 + 0.65 * min(1, t0 / (DUR * .6))) if C.get("grow") else 1
    if b % 2 == 0 or style == "tick":
        d = (2 if style != "tick" else 2) * bar + .5
        for n in notes:
            for det in (-.003, .003):
                add(pad_b, tone(midi(n), d, ((1, 1), (2, .2)), a=1.0, r=1.2, det=det), t0, .35 * grow)
    # bateria (16 passos)
    drums_on = True
    if C.get("build"):
        drums_on = t0 >= build_t - BR / 2  # kick entra antes do drop, hats aceleram
    if C.get("grow"):
        drums_on = t0 >= switch_t
    for i in range(16):
        ts = t0 + i * step + (sw * step if i % 2 == 1 else 0)
        if ts >= DUR: break
        kp, sp, hpat = C["kick"][i], C["snare"][i], C["hat"][i]
        if C.get("build") and ts < build_t:
            frac = ts / build_t
            if frac > .25 and i % 4 == 0 and ts > build_t - BR: add(kick_b, kick(.7), ts)
            if ts > build_t - .75 * BR and i % max(1, int(8 - 7 * frac)) == 0: add(hat_b, hat(.5 * frac), ts)
            if ts > build_t - .25 * BR and i % 2 == 0: add(sn_b, snare(.35 * frac), ts)
            continue
        if style in ("lofi", "quirk", "hiphop", "mini", "pop", "corp", "tense") or (drums_on and style in ("build", "inspire")):
            if kp == "x" and not (C.get("grow") and not drums_on): add(kick_b, kick(.9 if style != "corp" else .5), ts)
            if sp == "x" and drums_on: add(sn_b, snare(.6), ts)
            if sp == "c" and drums_on: add(sn_b, clap(.5), ts)
            if hpat == "x" and drums_on: add(hat_b, hat(.35 if i % 4 else .5), ts)
        if C.get("tickbeat") and i % 4 == 0:
            add(hat_b, tick(.55, hi=(i % 8 == 0)), ts)
        # baixo
        bp = C.get("bassp", "x.......x.......")[i]
        if bp == "x" and (drums_on or style in ("tick", "lofi", "quirk", "mini", "corp", "pop", "hiphop", "tense")):
            if not (C.get("build") and ts < build_t):
                dur_n = step * (3 if style in ("hiphop", "tense") else 1.6)
                f = midi(root) * (2 if (style in ("mini", "build") and i % 4 == 3) else 1)
                add(bass_b, tone(f, dur_n, ((1, 1), (2, .2)), a=.005, r=.08), ts, 1.0)
    # plucks
    ptype = C["pluck"]
    for k in range(8):
        ts = t0 + k * beat / 2 + (sw * step if k % 2 == 1 else 0)
        n = notes[k % len(notes)] + (12 if ptype in ("bright8", "arp8", "arp16", "uke") else 0) + (12 if k % 4 == 3 else 0)
        if ts >= DUR: break
        if C.get("build") and ts < build_t - BR: continue
        if ptype == "rhodes" and k % 2 == 0 and (k % 3 != 1):
            add(pluck_b, tone(midi(n + 12), .9, ((1, 1), (2, .45), (3, .12), (5, .04)), a=.004, r=.5, dk=3.0), ts, .5)
        elif ptype == "uke" and k % 2 == 1:
            add(pluck_b, tone(midi(n + 12), .35, ((1, 1), (2, .5), (3, .2)), a=.003, r=.2, dk=7), ts, .5)
        elif ptype in ("bright8",):
            add(pluck_b, tone(midi(n + 12), .3, ((1, 1), (2, .35), (3, .1)), a=.003, r=.2, dk=6), ts, .45)
        elif ptype == "arp8":
            add(pluck_b, tone(midi(n + 12), .6, ((1, 1), (2, .3), (4, .06)), a=.004, r=.4, dk=3.5), ts, .45 * grow)
        elif ptype == "arp16":
            for q in range(2):
                add(pluck_b, tone(midi(notes[(k + q) % len(notes)] + 24), .16, ((1, 1), (2, .2)), a=.002, r=.1, dk=14), ts + q * step, .28)
        elif ptype == "stab" and k % 4 == 0:
            for nn in notes:
                add(pluck_b, tone(midi(nn + 12), .3, ((1, 1), (2, .4), (3, .2)), a=.003, r=.15, dk=8), ts, .25)

v_main, v_mid, v_low = C.get("vol", (1, .8, .5))
mix = pad_b * C["pad"] + bass_b * C["bass"] * .6 + pluck_b * .5
mix = mix + kick_b * .9 + sn_b * .6 + hat_b * .35
if C.get("soft"):
    mix = lp(mix, 4)
if C.get("crackle"):
    cr = (rng.random(N) > .9995) * rng.standard_normal(N) * .5
    mix = mix + lp(cr, 3) * .15
if C.get("build"):
    # riser de ruído até o drop
    ri = int((build_t - BR) * SR); rj = int(build_t * SR)
    n = hp(rng.standard_normal(rj - ri), 8) * np.linspace(0, 1, rj - ri) ** 2.2
    mix[ri:rj] += n * .3
    add(mix, tone(45, 1.2, ((1, 1),), a=.005, r=.9, dk=2.5), build_t, 1.4)
    mix[rj:rj + int(SR * .12)] *= .5

# reverb leve
L = 1 << int(np.ceil(np.log2(N + SR * 2)))
ir = lp(rng.standard_normal(int(SR * 1.4)) * np.exp(-np.arange(int(SR * 1.4)) / (SR * .4)), 8)
wet = np.fft.irfft(np.fft.rfft(mix, L) * np.fft.rfft(ir, L), L)[:N]
mix = mix * .75 + wet / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(mix)) * .25
fi, fo = int(SR * .15), int(SR * 1.5)
mix[:fi] *= np.linspace(0, 1, fi); mix[-fo:] *= np.linspace(1, 0, fo)
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .9
with wave.open(out, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", style)
