import matplotlib.pyplot as plt

# Data for the graph
categories = ["US Before", "US After", "Asia-Pacific Before", "Asia-Pacific After"]
load_times = [1.2, 1.1, 2.8, 1.5]  # Page load times in seconds
colors = ["blue", "green", "blue", "green"]  # Blue for Before, Green for After

# Create the bar chart
plt.figure(figsize=(10, 6))  # Set figure size (width, height)

# Plot bars
bars = plt.bar(categories, load_times, color=colors)

# Add labels and title
plt.ylabel("Page Load Time [s]")
plt.title("Page Load Time Before and After CDN Implementation")

# Add gridlines on y-axis
plt.grid(axis="y", linestyle="--", alpha=0.7)

# Add value labels on top of each bar
for bar in bars:
    yval = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2, yval + 0.05, f"{yval:.1f}", 
             ha="center", va="bottom")

# Set y-axis limit for better visibility
plt.ylim(0, 3.5)

# Display the plot
plt.tight_layout()
plt.show()

# Optionally, save the plot as an image file
plt.savefig("page_load_time_cdn_comparison.png", dpi=300, bbox_inches="tight")