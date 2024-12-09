import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import subprocess
import json

# Title and Description
st.title("Network Speed Test App")
st.write("Test your Internet speed and visualize the results.")

# Run Speed Test using speedtest-cli
def run_speed_test():
    try:
        # Run the speedtest-cli command and capture the output
        result = subprocess.run(
            ["speedtest", "--json"],
            capture_output=True,
            text=True,
        )
        if result.returncode != 0:
            st.error("Speedtest-cli command failed.")
            return None

        # Parse the JSON result
        speed_data = json.loads(result.stdout)
        download_speed = speed_data["download"] / 1_000_000  # Convert to Mbps
        upload_speed = speed_data["upload"] / 1_000_000  # Convert to Mbps
        latency = speed_data["ping"]  # Latency in ms

        return download_speed, upload_speed, latency
    except Exception as e:
        st.error(f"An error occurred: {e}")
        return None

# Button to trigger the speed test
if st.button("Run Speed Test"):
    st.write("Running speed test... please wait.")
    results = run_speed_test()

    if results:
        download_speed, upload_speed, latency = results

        # Display the results
        st.write(f"**Download Speed**: {download_speed:.2f} Mbps")
        st.write(f"**Upload Speed**: {upload_speed:.2f} Mbps")
        st.write(f"**Latency**: {latency:.2f} ms")

        # Prepare data for visualization
        data = pd.DataFrame({
            "Metric": ["Download Speed", "Upload Speed", "Latency"],
            "Value": [download_speed, upload_speed, latency]
        })

        # Bar Chart Visualization
        st.subheader("Speed Test Results (Visualization)")

        fig, ax = plt.subplots(figsize=(6, 4))
        colors = ['blue', 'green', 'orange']
        ax.bar(data["Metric"], data["Value"], color=colors)
        ax.set_ylabel("Value (Mbps/ms)")
        ax.set_title("Speed Test Results")
        st.pyplot(fig)
    else:
        st.error("Failed to run the speed test.")

# Information Section
st.info(
    """
This app uses the `speedtest-cli` command-line tool to measure your download and upload speeds, as well as network latency.
"""
)