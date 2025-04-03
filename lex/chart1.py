import matplotlib.pyplot as plt

# Data for the graph
rtt_values = [0, 50, 100, 200, 300]  # RTT in milliseconds

# Page load times in seconds for 5, 25, and 50 requests
load_time_5_requests = [0, 0.25, 0.5, 1, 1.5]
load_time_25_requests = [0, 1.25, 2.5, 5, 7.5]
load_time_50_requests = [0, 2.5, 5, 10, 15]

# Create the plot
plt.figure(figsize=(10, 6))  # Set figure size (width, height)

# Plot each line with specified colors
plt.plot(rtt_values, load_time_5_requests, color='blue', label='5 Requests', marker='o')
plt.plot(rtt_values, load_time_25_requests, color='orange', label='25 Requests', marker='o')
plt.plot(rtt_values, load_time_50_requests, color='green', label='50 Requests', marker='o')

# Add labels and title
plt.xlabel('Round-Trip Time (RTT) [ms]')
plt.ylabel('Page Load Time [s]')
plt.title('Impact of RTT on Page Load Time')

# Add gridlines
plt.grid(True, linestyle='--', alpha=0.7)

# Add legend
plt.legend()

# Set axis limits for clarity
plt.xlim(0, 300)
plt.ylim(0, 16)

# Display the plot
plt.tight_layout()
plt.show()

# Optionally, save the plot as an image file
plt.savefig('impact_of_rtt_on_page_load_time.png', dpi=300, bbox_inches='tight')