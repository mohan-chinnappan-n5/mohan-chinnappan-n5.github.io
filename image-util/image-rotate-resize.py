import streamlit as st
from PIL import Image
import torch
from torchvision import transforms

# Function to rotate image using PyTorch
def rotate_image(image, angle):
    # Convert to PyTorch tensor
    tensor = transforms.ToTensor()(image).unsqueeze(0)
    
    # Perform rotation (by the given angle, in degrees)
    k = angle // 90  # Number of 90-degree rotations
    rotated_tensor = torch.rot90(tensor, k, [2, 3])  # Rotate by k 90-degree steps
    
    # Convert back to PIL image
    rotated_image = transforms.ToPILImage()(rotated_tensor.squeeze(0))
    return rotated_image

# Function to resize the image
def resize_image(image, width, height):
    resized_image = image.resize((width, height))  # Resize image to the specified width and height
    return resized_image

# Streamlit interface
st.title("Image Rotation and Resize Application")

# Upload image file
uploaded_file = st.file_uploader("Upload an image", type=["jpg", "png", "jpeg"])

# If the user uploads an image
if uploaded_file is not None:
    # Open the image
    image = Image.open(uploaded_file)

    # Display the original image
    st.image(image, caption="Original Image", use_column_width=True)

    # Ask user for rotation angle
    angle = st.number_input("Enter the rotation angle (in degrees)", min_value=-360, max_value=360, step=90)

    # Ask user for resize dimensions
    resize_width = st.number_input("Enter the width to resize the image", min_value=1, step=1)
    resize_height = st.number_input("Enter the height to resize the image", min_value=1, step=1)

    # Apply rotation
    if st.button("Rotate Image"):
        rotated_image = rotate_image(image, angle)
        st.image(rotated_image, caption=f"Rotated Image by {angle}°", use_column_width=True)

    # Apply resizing
    if st.button("Resize Image"):
        resized_image = resize_image(image, resize_width, resize_height)
        st.image(resized_image, caption=f"Resized Image ({resize_width}x{resize_height})", use_column_width=True)

    # Allow users to download the processed image
    if st.button("Download Resized and Rotated Image"):
        # Save the processed image to a temporary file
        output_image = resized_image if 'resized_image' in locals() else rotated_image
        output_image_path = "/tmp/output_image.jpg"
        output_image.save(output_image_path)

        # Provide download link
        with open(output_image_path, "rb") as file:
            st.download_button(
                label="Download Image",
                data=file,
                file_name="processed_image.jpg",
                mime="image/jpeg"
            )