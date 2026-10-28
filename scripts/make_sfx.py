"""Gera os efeitos sonoros do Reels (síntese local, sem bancos de áudio nem licenças)."""
import sys, wave
import numpy as np

SR = 48000
rng = np.random.default_rng(7)
out = sys.argv[1]


def save(name, x, peak=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    with wave.open(f"{out}/{name}.wav", "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, r=0.1):
    e = np.ones(n)
    na, nr = int(SR * a), int(SR * r)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] = np.linspace(1, 0, nr) ** 2
    return e


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


# pop: clique curto de interface (seno com queda de frequência)
tt = t(0.11)
f = 520 + 900 * np.exp(-tt * 38)
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(tt), 0.002, 0.09))

# number: blip agudo para valores que entram
tt = t(0.16)
x = np.sin(2 * np.pi * 1180 * tt) + 0.5 * np.sin(2 * np.pi * 1770 * tt)
save("number", x * env(len(tt), 0.002, 0.14))

# whoosh: ruído com filtro passa-banda que sobe (transição de cena)
n = int(SR * 0.55)
noise = rng.standard_normal(n)
cut = np.geomspace(300, 5000, n)
alpha = 1 - np.exp(-2 * np.pi * cut / SR)
lp = np.zeros(n)
acc = 0.0
for i in range(n):
    acc += alpha[i] * (noise[i] - acc)
    lp[i] = acc
y = lp - lowpass(lp, 100)
save("whoosh", y * np.sin(np.linspace(0, np.pi, n)) ** 1.5, 0.8)

# swipe: whoosh curto
n = int(SR * 0.28)
z = rng.standard_normal(n)
z = z - lowpass(z, 40)
save("swipe", z * np.sin(np.linspace(0, np.pi, n)) ** 2, 0.7)

# tick: contagem (cliques secos), 1,5 s com ritmo acelerando
d = 1.5
buf = np.zeros(int(SR * d))
pos, gap = 0.0, 0.12
while pos < d - 0.03:
    c = t(0.025)
    click = np.sin(2 * np.pi * 2400 * c) * np.exp(-c * 180)
    i = int(pos * SR)
    buf[i:i + len(click)] += click * (0.5 + 0.5 * pos / d)
    pos += gap
    gap = max(0.045, gap * 0.9)
save("count", buf)

# ding: sino curto de acerto (parciais inarmônicos leves)
tt = t(0.9)
x = sum(a * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * dk) for fr, a, dk in [(880, 1, 5), (1760, 0.45, 7), (2640, 0.2, 9), (2217, 0.25, 6)])
save("ding", x * env(len(tt), 0.002, 0.3))

# thud: batida grave suave (entrada do botão do código)
tt = t(0.3)
f = 110 * np.exp(-tt * 9) + 45
save("thud", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 12) * env(len(tt), 0.003, 0.05))
print("ok")
