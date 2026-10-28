"""Trilha de fundo original (síntese local): pad suave + notas curtas, Lá menor, 84 BPM.
Uso: python3 make_music.py saida.wav [duracao_s]"""
import sys, wave
import numpy as np

SR = 48000
out = sys.argv[1]
DUR = float(sys.argv[2]) if len(sys.argv) > 2 else 50.0
BPM = 84
beat = 60 / BPM
bar = beat * 4
rng = np.random.default_rng(3)
N = int(SR * DUR)
mix = np.zeros(N)


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def add(buf, x, t0):
    i = int(t0 * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i]


def tone(freq, d, harm=((1, 1), (2, 0.25), (3, 0.08)), a=0.02, r=0.3, detune=0.0):
    t = np.arange(int(SR * d)) / SR
    x = sum(g * np.sin(2 * np.pi * freq * h * (1 + detune) * t) for h, g in harm)
    e = np.minimum(t / a, 1) * np.minimum((d - t) / r, 1)
    return x * np.clip(e, 0, 1)


# Am - F - C - G (2 compassos cada)
chords = [
    ([57, 60, 64], 45),  # Am
    ([53, 57, 60], 41),  # F
    ([60, 64, 67], 48),  # C
    ([55, 59, 62], 43),  # G
]
pad = np.zeros(N)
bass = np.zeros(N)
pluck = np.zeros(N)
n_bars = int(DUR / bar) + 2
for b in range(0, n_bars, 2):
    notes, root = chords[(b // 2) % 4]
    t0 = b * bar
    d = 2 * bar + 0.6
    for n in notes:
        for det in (-0.003, 0.003):
            add(pad, tone(midi(n), d, ((1, 1), (2, 0.18)), a=1.2, r=1.4, detune=det) * 0.5, t0)
    add(bass, tone(midi(root), d - 0.4, ((1, 1), (2, 0.15)), a=0.15, r=0.8), t0)
    # arpejo esparso, notas curtas
    arp = [notes[0], notes[2], notes[1] + 12, notes[2], notes[0] + 12, notes[1] + 12, notes[2], notes[1]]
    for k, n in enumerate(arp * 2):
        if k % 3 == 2:
            continue  # espaços para respirar
        tt = t0 + k * beat / 2
        add(pluck, tone(midi(n + 12), 0.7, ((1, 1), (2, 0.3), (4, 0.05)), a=0.004, r=0.6) * (0.55 + 0.25 * ((k % 4) == 0)), tt)


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


pluck = lowpass(pluck, 6)
mix = pad * 0.55 + bass * 0.5 + pluck * 0.35

# reverb leve por convolução (FFT)
ir_len = int(SR * 1.6)
ir = rng.standard_normal(ir_len) * np.exp(-np.arange(ir_len) / (SR * 0.45))
ir = lowpass(ir, 8)
L = 1 << int(np.ceil(np.log2(N + ir_len)))
wet = np.fft.irfft(np.fft.rfft(mix, L) * np.fft.rfft(ir, L), L)[:N]
mix = mix * 0.7 + wet / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(mix)) * 0.35

# entrada e saída suaves
fi, fo = int(SR * 2.5), int(SR * 3.5)
mix[:fi] *= np.linspace(0, 1, fi)
mix[-fo:] *= np.linspace(1, 0, fo)
mix = mix / np.max(np.abs(mix)) * 0.9
with wave.open(out, "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype(np.int16).tobytes())
print("ok", DUR)
