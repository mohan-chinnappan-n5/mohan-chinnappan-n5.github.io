import speedtest
import argparse

def run_speed_test(server=None):
    # Create a Speedtest object
    st = speedtest.Speedtest()

    if server:
        # Find the closest server based on the provided server URL
        st.get_best_server(server)

    # Perform a download speed test
    download_speed = st.download() / 1_000_000  # Convert to Mbps

    # Perform an upload speed test
    upload_speed = st.upload() / 1_000_000  # Convert to Mbps

    return download_speed, upload_speed

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Speed test application")
    parser.add_argument("--server", type=str, help="Custom server URL for testing")

    args = parser.parse_args()

    server_url = args.server

    if server_url:
        print(f"Testing to custom server: {server_url}")
    else:
        print("Testing to the best server available")

    download_speed, upload_speed = run_speed_test(server_url)

    print(f"Download Speed: {download_speed:.2f} Mbps")
    print(f"Upload Speed: {upload_speed:.2f} Mbps")
