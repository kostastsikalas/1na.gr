from PIL import Image

def remove_white_bg(input_path, output_path, tolerance=240):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if the pixel is close to white
        if item[0] >= tolerance and item[1] >= tolerance and item[2] >= tolerance:
            # Make it transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_white_bg("public/images/logo.jpg", "public/images/logo.png")
