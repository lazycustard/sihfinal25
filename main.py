import qrcode
import uuid
import os

def main():
    # Make sure folder exists
    os.makedirs("qrcodes", exist_ok=True)

    # Example: Generate 5 unique product QR codes
    for i in range(5):
        # Generate unique blockchain/product ID (you could also pull this from Hyperledger)
        product_id = str(uuid.uuid4())
        
        # URL that will redirect to your product details page
        product_url = f"https://yourcompany.com/product/{product_id}"
        
        # Generate QR
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(product_url)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")

        # Save QR image with product ID as filename
        img.save(f"qrcodes/{product_id}.png")

        print(f"Generated QR for {product_id} → {product_url}")

if __name__ == "__main__":
    main()
