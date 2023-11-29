import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# Gyroscope data
data = [
    [0.1, -0.2, 0.3],
    [0.2, -0.3, 0.4],
    [0.3, -0.4, 0.5],
    [0.4, -0.5, 0.6],
    [0.5, -0.6, 0.7]
]

# Unpack the data
x_data = [point[0] for point in data]
y_data = [point[1] for point in data]
z_data = [point[2] for point in data]

# Plotting
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

# Scatter plot
ax.scatter(x_data, y_data, z_data, c='r', marker='o')

# Set labels
ax.set_xlabel('X Gyro')
ax.set_ylabel('Y Gyro')
ax.set_zlabel('Z Gyro')

# Show the plot
plt.show()
