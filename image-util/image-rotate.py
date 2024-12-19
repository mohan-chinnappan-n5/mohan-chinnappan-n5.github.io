import streamlit as st
from PIL import Image
import torch
from torchvision import transforms
import numpy as np
import io

# App title
st.title("Image Rotation App")

# Upload image
uploaded_image = st.file_uploader("Upload an image", type=["png", "jpg", "jpeg"])

# Ask for rotation direction
rotation_direction = st.selectbox("Choose rotation direction", ["Clockwise (CW)", "Counter-Clockwise (CCW)"])

# Ask for the degree of rotation
rotation_degree = st.number_input("Enter degrees to rotate", min_value=0, max_value=360, step=15, value=90)

# Function to rotate image using PyTorch
def rotate_image(image, angle, direction):
    # Convert PIL Image to PyTorch tensor
    transform = transforms.ToTensor()
    image_tensor = transform(image).unsqueeze(0)  # Add batch dimension

    # Rotate clockwise or counterclockwise
    if direction == "Clockwise (CW)":
        angle = -angle  # Negative for clockwise rotation

    # Rotate the image tensor
    rotated_tensor = torch.rot90(image_tensor, k=angle // 90, dims=[2, 3])  # 90 degrees at a time
    rotated_image = transforms.ToPILImage()(rotated_tensor.squeeze(0))  # Convert back to PIL image
    return rotated_image

# Process the image if uploaded
if uploaded_image:
    # Open the uploaded image
    image = Image.open(uploaded_image)

    # Display the original image
    st.image(image, caption="Original Image", use_column_width=True)

    # Rotate the image when the user submits
    if st.button("Rotate Image"):
        # Rotate the image
        rotated_image = rotate_image(image, rotation_degree, rotation_direction)

        # Display the rotated image
        st.image(rotated_image, caption=f"Rotated Image ({rotation_degree}° {rotation_direction})", use_column_width=True)