import numpy as np
import matplotlib.pyplot as plt

# Define the square-wave signal
def square_wave(t, T, T1):
    g = np.zeros(len(t))
    for k in range(-np.inf, np.inf):
        g += np.delta(t - k*T)
    x = (g(t + T1) - g(t - T1)) * 1
    return x

# Define the ideal lowpass filter
def ideal_lowpass_filter(t, f_c):
    h = np.sinc(2*f_c*t)
    y = np.convolve(x(t), h, mode='same')
    return y

# Define the parameters
T = 10e-3  # Period of the square-wave signal
T1 = 2e-3  # Pulse duration
f_c = 210  # Cutoff frequency of the lowpass filter

# Generate the time vector
t = np.linspace(-T, T, 1000)

# Generate the input signal
x = square_wave(t, T, T1)

# Generate the output signal
y = ideal_lowpass_filter(t, f_c)

# Plot the input and output signals
plt.plot(t, x, label='Input signal')
plt.plot(t, y, label='Output signal')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.title('Square-wave signal and output of ideal lowpass filter')
plt.legend()
plt.grid()
plt.show()
