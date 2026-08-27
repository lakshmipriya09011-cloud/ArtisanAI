"""
ArtisanAI - Simple Flask Backend
=================================

This is a beginner-friendly backend for the "ArtisanAI" SIH project.

WHAT THIS FILE DOES:
- Starts a small web server using Flask.
- Creates a SQLite database file called "artisan.db" automatically
  (SQLite is just a database that lives in a single file - no extra
  software to install).
- Provides these APIs:
    POST   /api/products          -> add a new product
    GET    /api/products          -> get list of all products
    GET    /api/products/<id>     -> get one product by its id
    POST   /api/catalog/generate  -> auto-generate a catalog description
    POST   /api/pricing/suggest   -> suggest a price for a product
    POST   /api/image/enhance     -> "enhance" a product image (mock)
    POST   /api/translate         -> translate text (mock)

NOTE ABOUT THE "AI" ROUTES:
The catalog/pricing/image/translate routes below use very simple
placeholder logic (no external AI service, no internet needed) so
that this app runs immediately with zero setup and zero API keys.
Comments in each function explain exactly where you would plug in
a real AI/translation/image API later (for example OpenAI, Google
Translate, or an image-enhancement API) once you get one for your
hackathon.
"""

# ---------------------------------------------------------------
# STEP 1: Import the tools we need
# ---------------------------------------------------------------
from flask import Flask,request, jsonify, send_from_directory
from flask_cors import CORS    # Flask = our web server toolkit
from werkzeug.utils import secure_filename
import sqlite3                              # sqlite3 = built into Python, no install needed
import os
import secrets
import time
from datetime import datetime
from twilio.rest import Client

# ---------------------------------------------------------------
# STEP 2: Create the Flask app
# ---------------------------------------------------------------
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "uploads", "products")
DEFAULT_IMAGE_URL = "/static/uploads/products/default-product.svg"
ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)

OTP_TTL_SECONDS = 300
OTP_STORE = {}

# The database file will be created in the same folder as this app.py
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artisan.db")


def normalize_phone(phone):
    phone = str(phone or "").strip()
    digits = "".join(character for character in phone if character.isdigit())
    if len(digits) == 10:
        return "+91" + digits
    if len(digits) == 12 and digits.startswith("91"):
        return "+" + digits
    if phone.startswith("+") and len(digits) >= 10:
        return "+" + digits
    return None


# ---------------------------------------------------------------
# STEP 3: A helper function to connect to the database
# ---------------------------------------------------------------
def get_db_connection():
    """Opens a connection to the SQLite database file."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row  # lets us access columns by name, e.g. row["name"]
    return conn


def init_db():
    """
    Creates the 'products' table if it doesn't already exist.
    This runs once automatically when the app starts.
    """
    conn = get_db_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            category TEXT,
            price REAL,
            image_url TEXT,
            created_at TEXT
        )
    """)
    columns = {row[1] for row in conn.execute("PRAGMA table_info(products)").fetchall()}
    if "artisan" not in columns:
        conn.execute("ALTER TABLE products ADD COLUMN artisan TEXT")
    if "region" not in columns:
        conn.execute("ALTER TABLE products ADD COLUMN region TEXT")
    conn.execute(
        "UPDATE products SET image_url = REPLACE(image_url, '/uploads/', '/static/uploads/products/') "
        "WHERE image_url LIKE '/uploads/%' AND image_url NOT LIKE '/uploads/uploads/%'"
    )
    conn.execute(
        "UPDATE products SET image_url = '/static/uploads/products/' || image_url "
        "WHERE image_url LIKE 'uploads/products/%'"
    )
    conn.commit()
    conn.close()


def save_product_image(image):
    if not image or not image.filename:
        raise ValueError("Please choose a product image before publishing")
    extension = image.filename.rsplit(".", 1)[-1].lower() if "." in image.filename else ""
    if extension not in ALLOWED_IMAGE_EXTENSIONS or not image.mimetype.startswith("image/"):
        raise ValueError("Upload a JPG, JPEG, PNG, or WEBP image")
    filename = secure_filename(image.filename)
    filename = f"{secrets.token_hex(8)}-{filename}"
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    image.save(os.path.join(UPLOAD_DIR, filename))
    return f"/static/uploads/products/{filename}"


def resolve_image_url(image_url):
    """Return a browser URL only when the stored local image exists."""
    if not image_url:
        return DEFAULT_IMAGE_URL
    if image_url.startswith("/static/uploads/products/"):
        filename = image_url.rsplit("/", 1)[-1]
        return image_url if os.path.isfile(os.path.join(UPLOAD_DIR, filename)) else DEFAULT_IMAGE_URL
    if image_url.startswith("/uploads/"):
        filename = image_url.rsplit("/", 1)[-1]
        local_path = os.path.join(UPLOAD_DIR, filename)
        return f"/static/uploads/products/{filename}" if os.path.isfile(local_path) else DEFAULT_IMAGE_URL
    if image_url.startswith("uploads/products/"):
        filename = image_url.rsplit("/", 1)[-1]
        local_path = os.path.join(UPLOAD_DIR, filename)
        return f"/static/uploads/products/{filename}" if os.path.isfile(local_path) else DEFAULT_IMAGE_URL
    return image_url


@app.route("/api/auth/send-otp", methods=["POST"])
def send_otp():
    data = request.get_json(silent=True) or {}
    phone = normalize_phone(data.get("phone"))
    if not phone:
        return jsonify({"error": "Enter a valid 10-digit phone number"}), 400

    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_PHONE_NUMBER")
    if not account_sid or not auth_token or not from_number:
        OTP_STORE[phone] = {"code": "1234", "expires_at": time.time() + OTP_TTL_SECONDS}
        return jsonify({
            "message": "Demo OTP created",
            "demo": True,
            "demo_otp": "1234"
        }), 200

    otp = f"{secrets.randbelow(10000):04d}"
    try:
        Client(account_sid, auth_token).messages.create(
            body=f"Your ArtisanAI verification code is {otp}. It expires in 5 minutes.",
            from_=from_number,
            to=phone,
        )
    except Exception:
        app.logger.exception("Twilio failed to send OTP")
        return jsonify({"error": "Could not send the OTP. Check your Twilio settings and phone number."}), 502

    OTP_STORE[phone] = {"code": otp, "expires_at": time.time() + OTP_TTL_SECONDS}
    return jsonify({"message": "OTP sent successfully"}), 200


@app.route("/api/auth/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json(silent=True) or {}
    phone = normalize_phone(data.get("phone"))
    code = str(data.get("otp", "")).strip()
    record = OTP_STORE.get(phone) if phone else None
    if not record or time.time() > record["expires_at"] or not secrets.compare_digest(code, record["code"]):
        return jsonify({"error": "Invalid or expired OTP"}), 401

    OTP_STORE.pop(phone, None)
    return jsonify({"message": "Phone number verified"}), 200


# =================================================================
# ROUTE 1: POST /api/products  -> Create a new product
# =================================================================
@app.route("/api/products", methods=["POST"])
def create_product():
    """
    Expects JSON body like:
    {
        "name": "Handwoven Basket",
        "description": "A basket made of bamboo",
        "category": "Home Decor",
        "price": 499.0,
        "image_url": "https://example.com/basket.jpg"
    }
    Only "name" is required. Everything else is optional.
    """
    data = request.form if request.form else (request.get_json(silent=True) or {})

    name = data.get("name")
    if not name:
        # 400 = "Bad Request" - the client sent something wrong/incomplete
        return jsonify({"error": "Field 'name' is required"}), 400

    description = data.get("description", "")
    category = data.get("category", "")
    price = data.get("price", 0)
    artisan = data.get("artisan", "Artisan")
    region = data.get("region", "India")
    try:
        image_url = save_product_image(request.files.get("image"))
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    created_at = datetime.utcnow().isoformat()

    conn = get_db_connection()
    cursor = conn.execute(
        """
        INSERT INTO products (name, description, category, price, image_url, artisan, region, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (name, description, category, price, image_url, artisan, region, created_at),
    )
    conn.commit()
    new_id = cursor.lastrowid  # the id SQLite just assigned to this new row
    conn.close()

    return jsonify({
        "message": "Product created successfully",
        "product": {
            "id": new_id,
            "name": name,
            "description": description,
            "category": category,
            "price": price,
            "image_url": image_url,
            "artisan": artisan,
            "region": region,
            "created_at": created_at,
        }
    }), 201  # 201 = "Created"


# =================================================================
# ROUTE 2: GET /api/products  -> List all products
# =================================================================
@app.route("/api/products", methods=["GET"])
def get_products():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM products ORDER BY id DESC").fetchall()
    conn.close()

    products = [dict(row) for row in rows]  # convert each DB row into a normal dictionary
    for product in products:
        product["image_url"] = resolve_image_url(product.get("image_url"))
    return jsonify({"count": len(products), "products": products}), 200


# =================================================================
# ROUTE 3: GET /api/products/<id>  -> Get a single product
# =================================================================
@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    conn = get_db_connection()
    row = conn.execute(
        "SELECT * FROM products WHERE id = ?", (product_id,)
    ).fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": f"No product found with id {product_id}"}), 404

    product = dict(row)
    product["image_url"] = resolve_image_url(product.get("image_url"))
    return jsonify({"product": product}), 200


# =================================================================
# ROUTE 4: POST /api/catalog/generate -> Auto-generate a catalog listing
# =================================================================
@app.route("/api/catalog/generate", methods=["POST"])
def generate_catalog():
    """
    Expects JSON body like:
    {
        "name": "Handwoven Basket",
        "material": "Bamboo",
        "category": "Home Decor"
    }

    Returns a simple auto-generated title + description.

    ---- WHERE TO PLUG IN REAL AI LATER ----
    Right now this just combines the words you gave it into a sentence.
    Later, you could replace the code inside this function with a call
    to a real text-generation API (for example, sending a prompt to an
    LLM) to get a much richer, more creative description.
    """
    data = request.get_json(silent=True) or {}

    name = data.get("name", "Handcrafted Item")
    material = data.get("material", "traditional materials")
    category = data.get("category", "handicraft")

    generated_title = f"{name} - Authentic {category}"
    generated_description = (
        f"This beautiful {name.lower()} is handcrafted using {material}. "
        f"A perfect piece of {category.lower()}, made with care by skilled artisans, "
        f"bringing tradition and craftsmanship into your home."
    )

    return jsonify({
        "generated_title": generated_title,
        "generated_description": generated_description
    }), 200


# =================================================================
# ROUTE 5: POST /api/pricing/suggest -> Suggest a price
# =================================================================
@app.route("/api/pricing/suggest", methods=["POST"])
def suggest_pricing():
    """
    Expects JSON body like:
    {
        "cost_price": 200,
        "category": "Home Decor"
    }

    Returns a suggested selling price.

    ---- WHERE TO PLUG IN REAL AI/LOGIC LATER ----
    This uses a simple fixed markup formula as a placeholder.
    Later you could replace this with real market-data lookups or
    a trained pricing model.
    """
    data = request.get_json(silent=True) or {}

    cost_price = data.get("cost_price", 0)
    try:
        cost_price = float(cost_price)
    except (TypeError, ValueError):
        return jsonify({"error": "'cost_price' must be a number"}), 400

    category = data.get("category", "general")

    # Simple placeholder rule: mark up cost price by 60%, then round.
    markup_multiplier = 1.6
    suggested_price = round(cost_price * markup_multiplier, 2)

    return jsonify({
        "category": category,
        "cost_price": cost_price,
        "suggested_price": suggested_price,
        "note": "This is a simple placeholder formula (cost x 1.6). "
                "Replace with real market logic when available."
    }), 200


# =================================================================
# ROUTE 6: POST /api/image/enhance -> "Enhance" a product image
# =================================================================
@app.route("/api/image/enhance", methods=["POST"])
def enhance_image():
    """
    Expects JSON body like:
    {
        "image_url": "https://example.com/basket.jpg"
    }

    ---- WHERE TO PLUG IN REAL IMAGE ENHANCEMENT LATER ----
    Right now this route does NOT actually process any image - it just
    echoes back the same URL with a message. Real image enhancement
    (brightness/background removal/upscaling) needs an image-processing
    library (like Pillow) or an external AI image API. This placeholder
    keeps the app simple and dependency-free for now.
    """
    data = request.get_json(silent=True) or {}
    image_url = data.get("image_url")

    if not image_url:
        return jsonify({"error": "Field 'image_url' is required"}), 400

    return jsonify({
        "original_image_url": image_url,
        "enhanced_image_url": image_url,  # placeholder: same URL returned
        "note": "This is a placeholder. Plug in a real image-enhancement "
                "library or API here to actually process the image."
    }), 200


# =================================================================
# ROUTE 7: POST /api/translate -> Translate text
# =================================================================
@app.route("/api/translate", methods=["POST"])
def translate_text():
    """
    Expects JSON body like:
    {
        "text": "Handwoven Basket",
        "target_language": "hi"
    }

    ---- WHERE TO PLUG IN REAL TRANSLATION LATER ----
    This is a placeholder that does not actually translate anything -
    it just returns the original text along with a note. To do real
    translation, you would call a translation API (for example Google
    Translate API) inside this function and return its result instead.
    """
    data = request.get_json(silent=True) or {}
    text = data.get("text")
    target_language = data.get("target_language", "en")

    if not text:
        return jsonify({"error": "Field 'text' is required"}), 400

    return jsonify({
        "original_text": text,
        "target_language": target_language,
        "translated_text": text,  # placeholder: no real translation happening
        "note": "This is a placeholder. Plug in a real translation API here "
                "to get an actual translated result."
    }), 200


# =================================================================
# A friendly homepage route, so opening the site in a browser
# doesn't just show a blank "Not Found" error.
# =================================================================
@app.route("/", methods=["GET"])
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/static/uploads/products/<path:filename>", methods=["GET"])
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.route("/uploads/<path:filename>", methods=["GET"])
def legacy_uploaded_file(filename):
    legacy_upload_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    if filename == "default-product.svg" and not os.path.exists(os.path.join(legacy_upload_dir, filename)):
        return send_from_directory(UPLOAD_DIR, filename)
    return send_from_directory(legacy_upload_dir, filename)


# Initialize the schema for both Flask development and Gunicorn imports.
init_db()

# ---------------------------------------------------------------
# STEP 4: Run the app
# ---------------------------------------------------------------
if __name__ == "__main__":
    # debug=True auto-restarts the server whenever you save a code change
    app.run(debug=False, host="0.0.0.0", port=5000)