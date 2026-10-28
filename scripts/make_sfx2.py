"""Efeitos adicionais para os Reels (síntese local, sem bancos de áudio). Uso: make_sfx2.py pasta_saida"""
import sys, wave
import numpy as np

SR = 48000
out = sys.argv[1]
rng = np.random.default_rng(11)


def save(name, x, peak=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    with wave.open(f"{out}/{name}.wav", "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t(d): return np.arange(int(SR * d)) / SR
def lp(x, k): return np.convolve(x, np.ones(k) / k, mode="same")
def hp(x, k): return x - lp(x, k)
def sine(f, d): return np.sin(2 * np.pi * f * t(d))
def sweep(f0, f1, d, geo=True):
    f = np.geomspace(f0, f1, int(SR * d)) if geo else np.linspace(f0, f1, int(SR * d))
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def dec(d, k): return np.exp(-t(d) * k)
def put(buf, x, at):
    i = int(at * SR); j = min(len(buf), i + len(x))
    if i < len(buf): buf[i:j] += x[: j - i]


def click(g=1.0, bright=1):
    n = int(SR * 0.02)
    return hp(rng.standard_normal(n), 6) * np.exp(-np.arange(n) / (SR * 0.003)) * g * bright


# typing: teclas com ritmo irregular (1,6 s)
buf = np.zeros(int(SR * 1.6)); pos = 0.02
while pos < 1.5:
    put(buf, click(rng.uniform(0.6, 1.0)) + sine(rng.uniform(150, 230), 0.02) * dec(0.02, 150) * 0.5, pos)
    pos += rng.uniform(0.06, 0.14)
save("typing", buf)

# click de mouse (descida + subida)
buf = np.zeros(int(SR * 0.12)); put(buf, click(1.0), 0.0); put(buf, click(0.6), 0.07); save("click", buf)

# erro: buzina grave dupla
x = np.zeros(int(SR * 0.45))
for at in (0.0, 0.2):
    b = np.sign(sine(160, 0.15)) * 0.6 + sine(240, 0.15) * 0.4
    put(x, lp(b, 5) * np.minimum(t(0.15) / 0.005, 1) * np.minimum((0.15 - t(0.15)) / 0.03, 1), at)
save("error", x)

# vibração de notificação (brr brr)
x = np.zeros(int(SR * 0.7))
for at in (0.0, 0.3):
    d = 0.22; tt = t(d)
    b = (np.sin(2 * np.pi * 70 * tt) + 0.5 * np.sin(2 * np.pi * 140 * tt)) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * tt))
    put(x, b * np.minimum(tt / 0.01, 1) * np.minimum((d - tt) / 0.03, 1) + lp(rng.standard_normal(len(tt)), 3) * 0.1, at)
save("vibrate", x)

# vidro quebrando
x = np.zeros(int(SR * 1.0))
put(x, hp(rng.standard_normal(int(SR * 0.35)), 4) * dec(0.35, 14), 0.0)
for _ in range(26):
    at = rng.uniform(0.02, 0.8); f = rng.uniform(2500, 9000); d = rng.uniform(0.08, 0.25)
    put(x, sine(f, d) * dec(d, rng.uniform(15, 35)) * rng.uniform(0.1, 0.4), at)
save("glass", x)

# porta fechando
x = np.zeros(int(SR * 0.7))
put(x, sweep(120, 50, 0.3) * dec(0.3, 11) + lp(rng.standard_normal(int(SR * 0.3)), 30) * dec(0.3, 18) * 0.8, 0.0)
put(x, click(0.9) * 0.8, 0.09); put(x, lp(rng.standard_normal(int(SR * 0.4)), 60) * dec(0.4, 9) * 0.25, 0.1)
save("door", x)

# encaixe de bloco
x = np.zeros(int(SR * 0.22))
put(x, sweep(420, 160, 0.12) * dec(0.12, 28), 0.0); put(x, click(1.2), 0.0); put(x, sine(900, 0.08) * dec(0.08, 50) * 0.3, 0.01)
save("snap", x)

# mensagem (dois tons)
x = np.zeros(int(SR * 0.5))
put(x, sine(659, 0.3) * dec(0.3, 9), 0.0); put(x, sine(880, 0.35) * dec(0.35, 8), 0.12)
save("msg", x)

# "ah não": trombone descendo
d = 1.0; tt = t(d)
f = np.interp(tt, [0, 0.25, 0.5, 0.75, 1.0], [233, 220, 208, 196, 185])
saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
x = lp(saw, 14) * np.minimum(tt / 0.03, 1) * np.minimum((d - tt) / 0.15, 1) * (0.8 + 0.2 * np.sin(2 * np.pi * 5 * tt))
save("womp", x)

# suspiro
d = 1.0; tt = t(d); n = rng.standard_normal(len(tt))
x = (lp(n, 10) - lp(n, 60)) * np.sin(np.pi * np.clip(tt / d, 0, 1)) ** 2
save("sigh", x, 0.6)

# whoosh de aceleração (1,3 s)
d = 1.3; n = int(SR * d); nz = rng.standard_normal(n)
cut = np.geomspace(200, 9000, n); a = 1 - np.exp(-2 * np.pi * cut / SR)
y = np.zeros(n); acc = 0.0
for i in range(n):
    acc += a[i] * (nz[i] - acc); y[i] = acc
save("accel", hp(y, 80) * (np.linspace(0, 1, n) ** 2.2) * np.minimum((d - t(d)) / 0.05, 1))

# estouro de comemoração
x = np.zeros(int(SR * 1.4))
put(x, hp(rng.standard_normal(int(SR * 0.25)), 5) * dec(0.25, 16), 0.0); put(x, sweep(220, 60, 0.3) * dec(0.3, 9), 0.0)
for _ in range(34):
    at = rng.uniform(0.04, 1.0); f = rng.uniform(1500, 6500); d = rng.uniform(0.1, 0.3)
    put(x, sine(f, d) * dec(d, rng.uniform(10, 25)) * rng.uniform(0.1, 0.35), at)
save("confetti", x)

# risco de caneta
d = 0.4; tt = t(d); n = rng.standard_normal(len(tt))
bp = hp(lp(n, 3), 12)
x = bp * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 9 * tt))) * np.minimum(tt / 0.02, 1) * np.minimum((d - tt) / 0.04, 1)
save("pen", x, 0.7)

# carimbo
x = np.zeros(int(SR * 0.35))
put(x, sweep(130, 45, 0.25) * dec(0.25, 14), 0.0); put(x, hp(rng.standard_normal(int(SR * 0.05)), 5) * dec(0.05, 60) * 0.8, 0.0)
save("stamp", x)

# relógio: tic e toc
save("tick", sine(1700, 0.03) * dec(0.03, 140))
save("tock", sine(1100, 0.04) * dec(0.04, 110))

# papel caindo
d = 0.5; tt = t(d); n = rng.standard_normal(len(tt))
x = (lp(n, 6) - lp(n, 40)) * dec(d, 7) * (0.6 + 0.4 * np.sin(2 * np.pi * 14 * tt))
save("paper", x, 0.6)

# ímã / atração
d = 0.8; tt = t(d)
x = sweep(180, 820, d) * (0.7 + 0.3 * np.sin(2 * np.pi * 12 * tt)) * np.sin(np.pi * tt / d) ** 0.6
save("magnet", x, 0.7)

# pops mais agudos (gente chegando)
for nm, f0 in (("pop2", 700), ("pop3", 900)):
    tt = t(0.1); f = f0 + 800 * np.exp(-tt * 40)
    save(nm, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 38))

# caixa registradora
x = np.zeros(int(SR * 1.2))
put(x, click(1.0), 0.0); put(x, sweep(300, 100, 0.12) * dec(0.12, 25), 0.0)
for fr, g in ((2093, 1), (3136, 0.6), (4186, 0.35)):
    put(x, sine(fr, 1.0) * dec(1.0, 5) * g * 0.5, 0.1)
save("register", x)

# gráfico subindo
d = 1.2; tt = t(d)
x = sweep(300, 1600, d, geo=False) * (0.6 + 0.4 * tt / d) * np.minimum((d - tt) / 0.05, 1)
save("riser", x, 0.7)

# ding de alívio (acorde maior)
x = sum(sine(f, 1.4) * dec(1.4, 3.2) * g for f, g in ((523, 1), (659, 0.7), (784, 0.6), (1047, 0.3)))
save("relief", x * np.minimum(t(1.4) / 0.004, 1))

# batida grave (drop)
x = sweep(90, 35, 0.9) * dec(0.9, 3.5)
save("boom", x)
print("ok")
