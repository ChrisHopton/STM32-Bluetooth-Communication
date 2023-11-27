import matplotlib.pyplot as plt
import numpy as np

# Data from the Open Circuit Test
field_current_oc = np.array([275, 320, 365, 380, 475, 570]) # Field current in amperes
line_voltage_oc = np.array([12.2, 13.0, 13.8, 14.1, 15.2, 16.0]) # Line voltage in kV
extrapolated_airgap_voltage_oc = np.array([13.3, 15.4, 17.5, 18.3, 22.8, 27.4]) # Extrapolated air-gap voltage in kV

# Data from the Short Circuit Test
field_current_sc = np.array([275, 320, 365, 380, 475, 570]) # Field current in amperes
armature_current_sc = np.array([890, 1040, 1190, 1240, 1550, 1885]) # Armature current in amperes

# Plotting Open Circuit Test Results
plt.figure(figsize=(14, 7))

# Plot for line voltage
plt.subplot(1, 2, 1)
plt.plot(field_current_oc, line_voltage_oc, marker='o', label='Line Voltage (kV)')
plt.plot(field_current_oc, extrapolated_airgap_voltage_oc, marker='x', linestyle='--', label='Extrapolated Air-gap Voltage (kV)')
plt.title('Open Circuit Test')
plt.xlabel('Field Current (A)')
plt.ylabel('Voltage (kV)')
plt.grid(True)
plt.legend()

# Plotting Short Circuit Test Results
plt.subplot(1, 2, 2)
plt.plot(field_current_sc, armature_current_sc, marker='s', color='red', label='Armature Current (A)')
plt.title('Short Circuit Test')
plt.xlabel('Field Current (A)')
plt.ylabel('Armature Current (A)')
plt.grid(True)
plt.legend()

plt.tight_layout()
plt.show()
