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
from flask import Flask,request, jsonify, send_from_directory, send_file, session
from flask_cors import CORS    # Flask = our web server toolkit
from werkzeug.utils import secure_filename
import sqlite3                              # sqlite3 = built into Python, no install needed
import os
import secrets
import time
import json
from functools import wraps
from copy import deepcopy
from datetime import datetime
from urllib import request as urllib_request, error as urllib_error
from urllib.parse import quote
from twilio.rest import Client

# ---------------------------------------------------------------
# STEP 2: Create the Flask app
# ---------------------------------------------------------------
FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))
app = Flask(__name__, static_folder=FRONTEND_DIR, static_url_path="")
CORS(app)
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY") or secrets.token_hex(32)

OTP_TTL_SECONDS = 300
OTP_STORE = {}
ARTISAN_PROFILE = {
    "name": "Hello Lakshmi Priyaa",
    "shop_name": "Lakshmi Priyaa Handcrafts",
    "craft_category": "Pottery",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "story": "I make useful, joyful pieces by hand and share traditional craft with new homes.",
    "contact": "lakshmi@example.com",
    "verification_status": "Verified",
    "rating": 4.8,
    "followers": 126
}
ARTISAN_PROFILES = {}
DEMO_ORDERS = [
    {"id": "ORD-1001", "product": "Blue Pottery Vase", "buyer": "R. Sharma", "amount": 1450, "status": "Shipped"},
    {"id": "ORD-1002", "product": "Madhubani Painting", "buyer": "A. Iyer", "amount": 2200, "status": "Processing"},
    {"id": "ORD-1003", "product": "Terracotta Diya Set", "buyer": "S. Khan", "amount": 680, "status": "Delivered"}
]
DEMO_REVIEWS = [
    {"author": "Meera K.", "rating": 5, "text": "Beautiful finish and carefully packed."},
    {"author": "Arjun P.", "rating": 4, "text": "The craft feels authentic and special."}
]

# The database file will be created in the same folder as this app.py
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artisan.db")
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static", "uploads", "products")
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp"}


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


def translate_with_openai(text, target_language):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or not text:
        return None

    lang_name = {
        "en": "English",
        "hi": "Hindi",
        "ta": "Tamil",
        "te": "Telugu",
        "ml": "Malayalam",
        "bn": "Bengali",
        "gu": "Gujarati",
        "mr": "Marathi",
        "kn": "Kannada",
        "ur": "Urdu",
    }.get(target_language, "the target language")

    payload = {
        "model": "gpt-4o-mini",
        "messages": [{
            "role": "user",
            "content": f"Translate this text to {lang_name}. Return only the translated text with no explanation: {text}"
        }],
        "temperature": 0
    }

    req = urllib_request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib_request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
        return content.strip() if content else None
    except Exception:
        return None


def translate_many_with_openai(texts, target_language):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or not texts:
        return {}

    language_names = {
        "en": "English", "hi": "Hindi", "ta": "Tamil", "te": "Telugu",
        "ml": "Malayalam", "bn": "Bengali", "gu": "Gujarati", "mr": "Marathi",
        "kn": "Kannada", "ur": "Urdu",
    }
    prompt = (
        f"Translate each string into {language_names.get(target_language, target_language)}. "
        "Return only a valid JSON object mapping each original string to its translation. "
        "Preserve punctuation, emojis, numbers, and product names.\n" + json.dumps(texts, ensure_ascii=False)
    )
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }
    req = urllib_request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib_request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data.get("choices", [{}])[0].get("message", {}).get("content", "{}")
        translated = json.loads(content)
        return {text: str(translated.get(text, text)) for text in texts}
    except Exception:
        return {}


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
    if "owner_phone" not in columns:
        conn.execute("ALTER TABLE products ADD COLUMN owner_phone TEXT")
    conn.commit()
    conn.close()


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if not session.get("artisan_phone"):
            return jsonify({"error": "Authentication required"}), 401
        return view(*args, **kwargs)
    return wrapped


def current_artisan_phone():
    return session.get("artisan_phone")


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
    session.clear()
    session["artisan_phone"] = phone
    return jsonify({"message": "Phone number verified"}), 200


@app.route("/api/auth/me", methods=["GET"])
def auth_me():
    return jsonify({"authenticated": bool(current_artisan_phone())}), 200


@app.route("/api/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return jsonify({"message": "Logged out"}), 200


# =================================================================
# ROUTE 1: POST /api/products  -> Create a new product
# =================================================================
@app.route("/api/products", methods=["POST"])
@login_required
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
    data = request.form.to_dict() if request.form else (request.get_json(silent=True) or {})

    name = data.get("name")
    if not name:
        # 400 = "Bad Request" - the client sent something wrong/incomplete
        return jsonify({"error": "Field 'name' is required"}), 400

    description = data.get("description", "")
    category = data.get("category", "")
    price = data.get("price", 0)
    try:
        price = float(price)
    except (TypeError, ValueError):
        return jsonify({"error": "Field 'price' must be a number"}), 400
    image_url = data.get("image_url", "")
    image = request.files.get("image")
    if image and image.filename:
        extension = os.path.splitext(image.filename)[1].lower()
        if extension not in ALLOWED_IMAGE_EXTENSIONS:
            return jsonify({"error": "Use a JPG, PNG, GIF, or WEBP image"}), 400
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        filename = f"{secrets.token_hex(10)}{extension}"
        image.save(os.path.join(UPLOAD_DIR, filename))
        image_url = f"/uploads/products/{filename}"
    created_at = datetime.utcnow().isoformat()

    conn = get_db_connection()
    cursor = conn.execute(
        """
        INSERT INTO products (name, description, category, price, image_url, created_at, owner_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (name, description, category, price, image_url, created_at, current_artisan_phone()),
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
    return jsonify({"count": len(products), "products": products}), 200


@app.route("/uploads/products/<path:filename>", methods=["GET"])
def uploaded_product_image(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.route("/api/products/<int:product_id>/whatsapp", methods=["GET"])
def product_whatsapp_link(product_id):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    conn.close()
    if row is None:
        return jsonify({"error": f"No product found with id {product_id}"}), 404

    product = dict(row)
    owner_phone = product.get("owner_phone") or current_artisan_phone() or "+919876543210"
    cleaned = "".join(ch for ch in str(owner_phone) if ch.isdigit())
    if cleaned.startswith("0") and len(cleaned) == 10:
        cleaned = "91" + cleaned[1:]
    if cleaned.startswith("91") and len(cleaned) == 12:
        wa_number = cleaned
    else:
        wa_number = cleaned.lstrip("0")
    message = f"Hi! I’m interested in your product: {product.get('name', 'Artisan product')}. Can you share more details?"
    url = f"https://wa.me/{wa_number}?text={quote(message)}"

    return jsonify({
        "whatsapp_number": wa_number,
        "url": url,
        "message": message,
        "product_name": product.get("name"),
    }), 200


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

    return jsonify({"product": dict(row)}), 200


@app.route("/api/artisan/profile", methods=["GET", "POST"])
@login_required
def artisan_profile():
    phone = current_artisan_phone()
    profile = ARTISAN_PROFILES.setdefault(phone, deepcopy(ARTISAN_PROFILE))
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        profile.update({key: data[key] for key in profile if key in data})
    return jsonify({"profile": profile}), 200


@app.route("/api/products/<int:product_id>", methods=["PUT", "DELETE"])
@login_required
def update_or_delete_product(product_id):
    conn = get_db_connection()
    existing = conn.execute("SELECT * FROM products WHERE id = ? AND owner_phone = ?", (product_id, current_artisan_phone())).fetchone()
    if existing is None:
        conn.close()
        return jsonify({"error": "Product not found"}), 404
    if request.method == "DELETE":
        conn.execute("DELETE FROM products WHERE id = ?", (product_id,))
    else:
        data = request.get_json(silent=True) or {}
        conn.execute(
            "UPDATE products SET name = ?, description = ?, category = ?, price = ? WHERE id = ?",
            (data.get("name", existing["name"]), data.get("description", existing["description"]),
             data.get("category", existing["category"]), data.get("price", existing["price"]), product_id)
        )
    conn.commit()
    conn.close()
    return jsonify({"message": "Product deleted" if request.method == "DELETE" else "Product updated"}), 200


@app.route("/api/orders", methods=["GET", "PATCH"])
@login_required
def orders():
    own_orders = [order for order in DEMO_ORDERS if order.get("artisan_phone") == current_artisan_phone()]
    if request.method == "PATCH":
        data = request.get_json(silent=True) or {}
        for order in own_orders:
            if order["id"] == data.get("id") and data.get("status") in {"New", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"}:
                order["status"] = data["status"]
    return jsonify({"orders": own_orders}), 200


@app.route("/api/orders", methods=["POST"])
def create_order():
    data = request.get_json(silent=True) or {}
    items = data.get("items") or []
    if not data.get("name") or not data.get("phone") or not data.get("address") or not items:
        return jsonify({"error": "Name, phone, address, and at least one item are required"}), 400

    total = sum(float(item.get("price", 0)) * int(item.get("quantity", 1)) for item in items)
    order = {
        "id": f"ORD-{1000 + len(DEMO_ORDERS) + 1}",
        "product": items[0].get("name", "Artisan product") if len(items) == 1 else f"{len(items)} artisan products",
        "buyer": data["name"],
        "amount": round(total, 2),
        "status": "New"
    }
    DEMO_ORDERS.insert(0, order)
    return jsonify({"message": "Order placed successfully", "order": order}), 201


@app.route("/api/reviews", methods=["GET", "POST"])
def reviews():
    if request.method == "POST":
        data = request.get_json(silent=True) or {}
        DEMO_REVIEWS.append({"author": data.get("author", "Guest"), "rating": int(data.get("rating", 5)), "text": data.get("text", "")})
    return jsonify({"reviews": DEMO_REVIEWS}), 200


@app.route("/api/earnings", methods=["GET"])
@login_required
def earnings():
    own_orders = [order for order in DEMO_ORDERS if order.get("artisan_phone") == current_artisan_phone()]
    completed = sum(order["amount"] for order in own_orders if order["status"] == "Delivered")
    pending = sum(order["amount"] for order in own_orders if order["status"] not in {"Delivered", "Cancelled", "Returned"})
    return jsonify({"total": completed + pending, "pending": pending, "completed": completed, "sales": own_orders}), 200


@app.route("/api/artisan/dashboard", methods=["GET"])
@login_required
def artisan_dashboard():
    phone = current_artisan_phone()
    conn = get_db_connection()
    products = [dict(row) for row in conn.execute(
        "SELECT id, name, description, category, price, image_url, created_at FROM products WHERE owner_phone = ? ORDER BY id DESC",
        (phone,)
    ).fetchall()]
    conn.close()
    own_orders = [order for order in DEMO_ORDERS if order.get("artisan_phone") == phone]
    completed = sum(order["amount"] for order in own_orders if order["status"] == "Delivered")
    pending = sum(order["amount"] for order in own_orders if order["status"] not in {"Delivered", "Cancelled", "Returned"})
    profile = ARTISAN_PROFILES.setdefault(phone, deepcopy(ARTISAN_PROFILE))
    return jsonify({
        "profile": profile,
        "products": products,
        "orders": own_orders,
        "earnings": {"total": completed + pending, "pending": pending, "completed": completed},
        "analytics": {"views": 0}
    }), 200


@app.route("/api/ai/describe", methods=["POST"])
@login_required
def ai_describe():
    data = request.get_json(silent=True) or {}
    name = data.get("name", "handmade product")
    material = data.get("material", "traditional materials")
    return jsonify({"description": f"A thoughtfully handmade {name.lower()} crafted with {material.lower()}. Made in small batches with care, character and a story worth sharing."}), 200


@app.route("/api/ai/categorize", methods=["POST"])
@login_required
def ai_categorize():
    text = str((request.get_json(silent=True) or {}).get("text", "")).lower()
    category = "Textiles & Weaving" if any(word in text for word in ["silk", "cotton", "weave", "saree"]) else "Jewelry" if any(word in text for word in ["earring", "necklace", "silver"]) else "Pottery" if any(word in text for word in ["clay", "pottery", "ceramic", "diya"]) else "Handicrafts"
    return jsonify({"category": category}), 200


# =================================================================
# ROUTE 4: POST /api/catalog/generate -> Auto-generate a catalog listing
# =================================================================
@app.route("/api/catalog/generate", methods=["POST"])
@login_required
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
@login_required
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
@login_required
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
    AI-ready translation endpoint.
    The app uses real-language translation fallback for a broader language set
    and can be upgraded later to a hosted translation API such as Google,
    Azure AI Translator, or OpenAI-compatible models.
    """
    data = request.get_json(silent=True) or {}
    text = str(data.get("text", "")).strip()
    target_language = str(data.get("target_language", "en")).lower()

    if not text:
        return jsonify({"error": "Field 'text' is required"}), 400

    supported = {
        "en": "English",
        "hi": "Hindi",
        "ta": "Tamil",
        "te": "Telugu",
        "ml": "Malayalam",
        "bn": "Bengali",
        "gu": "Gujarati",
        "mr": "Marathi",
        "kn": "Kannada",
        "ur": "Urdu",
    }

    COMMON_TRANSLATIONS = {
        "hi": {
            "Home": "होम",
            "Marketplace": "बाज़ार",
            "About": "जानकारी",
            "Artisan Dashboard": "कारीगर डैशबोर्ड",
            "Artisan Login": "कारीगर लॉगिन",
            "Dashboard": "डैशबोर्ड",
            "Add Product": "उत्पाद जोड़ें",
            "My Products": "मेरे उत्पाद",
            "AI Image Studio": "AI इमेज स्टूडियो",
            "AI Catalog Generator": "AI कैटलॉग जनरेटर",
            "Smart Pricing": "स्मार्ट प्राइसिंग",
            "Logout": "लॉगआउट",
            "Add New Product": "नया उत्पाद जोड़ें",
            "View Marketplace": "बाज़ार देखें",
            "Products listed": "सूचीबद्ध उत्पाद",
            "Views this month": "इस माह के व्यू",
            "Orders received": "प्राप्त ऑर्डर",
            "Total earnings": "कुल कमाई",
            "Recent products": "हाल के उत्पाद",
            "Recent orders": "हाल के ऑर्डर",
            "Product": "उत्पाद",
            "Buyer": "ग्राहक",
            "Amount": "राशि",
            "Status": "स्थिति",
            "Shipped": "भेजा गया",
            "Packing": "पैकिंग में",
            "Delivered": "डिलीवर हो गया"
        },
        "ta": {
            "Home": "முகப்பு",
            "Marketplace": "சந்தை",
            "About": "பற்றி",
            "Artisan Dashboard": "கைவினைஞர் டாஷ்போர்டு",
            "Artisan Login": "கைவினைஞர் உள்நுழைவு",
            "Dashboard": "டாஷ்போர்டு",
            "Add Product": "பொருள் சேர்க்கவும்",
            "My Products": "என் பொருட்கள்",
            "AI Image Studio": "AI படம் ஸ்டுடியோ",
            "AI Catalog Generator": "AI கேடலாக் ஜெனரேட்டர்",
            "Smart Pricing": "ஸ்மார்ட் விலை",
            "Logout": "வெளியேறு",
            "Add New Product": "புதிய பொருள் சேர்க்கவும்",
            "View Marketplace": "சந்தையைப் பாருங்கள்",
            "Products listed": "பட்டியலிடப்பட்ட பொருட்கள்",
            "Views this month": "இந்த மாதம் பார்வைகள்",
            "Orders received": "பெறப்பட்ட ஆர்டர்கள்",
            "Total earnings": "மொத்த வருமானம்",
            "Recent products": "சமீபத்திய பொருட்கள்",
            "Recent orders": "சமீபத்திய ஆர்டர்கள்",
            "Product": "பொருள்",
            "Buyer": "வாங்குபவர்",
            "Amount": "தொகை",
            "Status": "நிலை",
            "Shipped": "அனுப்பப்பட்டது",
            "Packing": "பேக்கிங்",
            "Delivered": "வழங்கப்பட்டது"
        },
        "te": {
            "Home": "హోమ్",
            "Marketplace": "మార్కెట్",
            "About": "గురించి",
            "Artisan Dashboard": "కళాకార డాష్బోర్డ్",
            "Artisan Login": "కళాకార లాగిన్",
            "Dashboard": "డాష్బోర్డ్",
            "Add Product": "ఉత్పత్తి జోడించండి",
            "My Products": "నా ఉత్పత్తులు",
            "AI Image Studio": "AI ఇమేజ్ స్టూడియో",
            "AI Catalog Generator": "AI క్యాటలాగ్ జనరేటర్",
            "Smart Pricing": "స్మార్ట్ ధర",
            "Logout": "లాగ్అవుట్",
            "Add New Product": "కొత్త ఉత్పత్తి జోడించండి",
            "View Marketplace": "మార్కెట్ చూడండి",
            "Products listed": "జాబితా చేయబడిన ఉత్పత్తులు",
            "Views this month": "ఈ నెల చూసినవారు",
            "Orders received": "స్వీకరించిన ఆర్డర్లు",
            "Total earnings": "మొత్తం ఆదాయం",
            "Recent products": "ఇటీవలి ఉత్పత్తులు",
            "Recent orders": "ఇటీవలి ఆర్డర్లు",
            "Product": "ఉత్పత్తి",
            "Buyer": "కొనుగోరి",
            "Amount": "మొత్తం",
            "Status": "స్థితి",
            "Shipped": "అనுப்பబడింది",
            "Packing": "ప్యాకింగ్",
            "Delivered": "పొందుపర్చారు"
        },
        "ml": {
            "Home": "ഹോം",
            "Marketplace": "മാർക്കറ്റ്പ്ലേസ്",
            "About": "വിവരം",
            "Artisan Dashboard": "കുറുവിളക്കാർ ഡാഷ്ബോർഡ്",
            "Artisan Login": "കുറുവിളക്കാർ ലോഗിൻ",
            "Dashboard": "ഡാഷ്ബോർഡ്",
            "Add Product": "ഉൽപ്പന്നം ചേർക്കുക",
            "My Products": "എന്റെ ഉൽപ്പന്നങ്ങൾ",
            "AI Image Studio": "AI ഇമേജ് സ്റ്റുഡിയോ",
            "AI Catalog Generator": "AI കാറ്റലോഗ് ജനറേറ്റർ",
            "Smart Pricing": "സ്മാർട് വില",
            "Logout": "പുറത്തുകടക്കുക",
            "Add New Product": "പുതിയ ഉൽപ്പന്നം ചേർക്കുക",
            "View Marketplace": "മാർക്കറ്റ്പ്ലേസ് കാണുക",
            "Products listed": "പട്ടികയിൽ ഉള്ള ഉൽപ്പന്നങ്ങൾ",
            "Views this month": "ഈ മാസത്തെ കാഴÕES",
            "Orders received": "സമ്പാദിച്ച ഓർഡറുകൾ",
            "Total earnings": "മൊത്തം വരുമാനം",
            "Recent products": "സമീപകാല ഉൽപ്പന്നങ്ങൾ",
            "Recent orders": "സമീപകാല ഓർडറുകൾ",
            "Product": "ഉൽപ്പന്നം",
            "Buyer": "വാങ്ങുന്നയാൾ",
            "Amount": "തുക",
            "Status": "സ്ഥിതി",
            "Shipped": "അയച്ചു",
            "Packing": "പോക്കിംഗ്",
            "Delivered": "എത്തിച്ചു"
        },
        "bn": {
            "Home": "হোম",
            "Marketplace": "মার্কেটপ্লেস",
            "About": "সম্পর্কে",
            "Artisan Dashboard": "কারিগর ড্যাশবোর্ড",
            "Artisan Login": "কারিগর লগইন",
            "Dashboard": "ড্যাশবোর্ড",
            "Add Product": "পণ্য যোগ করুন",
            "My Products": "আমার পণ্য",
            "AI Image Studio": "AI ইমেজ স্টুডিও",
            "AI Catalog Generator": "AI ক্যাটালগ জেনারেটর",
            "Smart Pricing": "স্মার্ট মূল্য",
            "Logout": "লগআউট",
            "Add New Product": "নতুন পণ্য যোগ করুন",
            "View Marketplace": "মার্কেটপ্লেস দেখুন",
            "Products listed": "তালিকাভুক্ত পণ্য",
            "Views this month": "এই মাসে ভিউ",
            "Orders received": "গৃহীত অর্ডার",
            "Total earnings": "মোট আয়",
            "Recent products": "সাম্প্রতিক পণ্য",
            "Recent orders": "সাম্প্রতিক অর্ডার",
            "Product": "পণ্য",
            "Buyer": "ক্রেতা",
            "Amount": "পরিমাণ",
            "Status": "অবস্থা",
            "Shipped": "প্রেরিত",
            "Packing": "প্যাকিং",
            "Delivered": "বিতরণ করা হয়েছে"
        },
        "gu": {
            "Home": "હોમ",
            "Marketplace": "માર્કેટપ્લેસ",
            "About": "વિશે",
            "Artisan Dashboard": "कारीગર ડેશબોર્ડ",
            "Artisan Login": "कारीગર લોગિન",
            "Dashboard": "ડેશબોર્ડ",
            "Add Product": "ઉત્પાદન ઉમેરો",
            "My Products": "મારા ઉત્પાદન",
            "AI Image Studio": "AI ઇમેજ સ્ટુડિયો",
            "AI Catalog Generator": "AI કેટલોગ જનરેટર",
            "Smart Pricing": "સ્માર્ટ ભાવ",
            "Logout": "લોગઆઉટ",
            "Add New Product": "નવું ઉત્પાદન ઉમેરો",
            "View Marketplace": "માર્કેટપ્લેસ જુઓ",
            "Products listed": "સૂચીમાં આપેલ ઉત્પાદનો",
            "Views this month": "આ મહિને દેખાવ",
            "Orders received": "પ્રાપ્ત ઓર્ડર",
            "Total earnings": "કુલ આવક",
            "Recent products": "તાજેતરના ઉત્પાદનો",
            "Recent orders": "તાજેતરના ઓર્ડર",
            "Product": "ઉત્પાદન",
            "Buyer": "ખરીદનાર",
            "Amount": "રકમ",
            "Status": "સ્થિતિ",
            "Shipped": "મોકલ્યું",
            "Packing": "પેકિંગ",
            "Delivered": "પહંચ્યું"
        },
        "mr": {
            "Home": "मुख्यपृष्ठ",
            "Marketplace": "मार्केटप्लेस",
            "About": "माहिती",
            "Artisan Dashboard": "कारागीर डॅशबोर्ड",
            "Artisan Login": "कारागीर लॉगिन",
            "Dashboard": "डॅशबोर्ड",
            "Add Product": "उत्पादन जोडा",
            "My Products": "माझे उत्पादन",
            "AI Image Studio": "AI इमेज स्टुडिओ",
            "AI Catalog Generator": "AI कॅटलॉग जनरेटर",
            "Smart Pricing": "स्मार्ट किंमत",
            "Logout": "लॉगआउट",
            "Add New Product": "नवीन उत्पादन जोडा",
            "View Marketplace": "मार्केटप्लेस पहा",
            "Products listed": "यादीत उत्पादन",
            "Views this month": "या महिन्यात दृश्ये",
            "Orders received": "प्राप्त ऑर्डर",
            "Total earnings": "एकूण कमाई",
            "Recent products": "अलीकडील उत्पादन",
            "Recent orders": "अलीकडील ऑर्डर",
            "Product": "उत्पादन",
            "Buyer": "खरेदीदार",
            "Amount": "रक्कम",
            "Status": "स्थिती",
            "Shipped": "पाठवले",
            "Packing": "पॅकिंग",
            "Delivered": "पुरवले"
        },
        "kn": {
            "Home": "ಹೋಮ್",
            "Marketplace": "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",
            "About": "ಮಾಹಿತಿ",
            "Artisan Dashboard": "ಕಾರಿಗರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            "Artisan Login": "ಕಾರಿಗರ ಲಾಗಿನ್",
            "Dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
            "Add Product": "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
            "My Products": "ನನ್ನ ಉತ್ಪನ್ನಗಳು",
            "AI Image Studio": "AI ಇಮೇಜ್ ಸ್ಟುಡಿಯೋ",
            "AI Catalog Generator": "AI ಕ್ಯಾಟಲಾಗ್ ಜನರೇಟರ್",
            "Smart Pricing": "ಸ್ಮಾರ್ಟ್ ದರ",
            "Logout": "ಲಾಗ್‌ಔಟ್",
            "Add New Product": "ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
            "View Marketplace": "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ವೀಕ್ಷಿಸಿ",
            "Products listed": "ಪಟ್ಟಿಮಾಡಲಾದ ಉತ್ಪನ್ನಗಳು",
            "Views this month": "ಈ ತಿಂಗಳು ವೀಕ್ಷಣೆಗಳು",
            "Orders received": "ಪಡೆಯಲಾದ ಆರ್ಡರ್ಗಳು",
            "Total earnings": "ಒಟ್ಟು ಆದಾಯ",
            "Recent products": "ಇತ್ತೀಚಿನ ಉತ್ಪನ್ನಗಳು",
            "Recent orders": "ಇತ್ತೀಚಿನ ಆರ್ಡರ್ಗಳು",
            "Product": "ಉತ್ಪನ್ನ",
            "Buyer": "ಖರೀದಿಸುವವನು",
            "Amount": "ಮೊತ್ತ",
            "Status": "ಸ್ಥಿತಿ",
            "Shipped": "ಕಳುಹಿಸಲಾಗಿದೆ",
            "Packing": "ಪ್ಯಾಕಿಂಗ್",
            "Delivered": "ವಿತರಿಸಲಾಗಿದೆ"
        },
        "ur": {
            "Home": "ہوم",
            "Marketplace": "مارکیٹ پلیس",
            "About": "معلومات",
            "Artisan Dashboard": "صنعتکار ڈیش بورڈ",
            "Artisan Login": "صنعتکار لاگ ان",
            "Dashboard": "ڈیش بورڈ",
            "Add Product": "پروڈکٹ شامل کریں",
            "My Products": "میرے مصنوعات",
            "AI Image Studio": "AI امیج اسٹوڈیو",
            "AI Catalog Generator": "AI کیٹلاگ جنریٹر",
            "Smart Pricing": "اسمارٹ قیمت",
            "Logout": "لاگ آوٹ",
            "Add New Product": "نئی پروڈکٹ شامل کریں",
            "View Marketplace": "مارکیٹ پلیس دیکھیں",
            "Products listed": "فہرست شدہ مصنوعات",
            "Views this month": "اس مہینے کے ویوز",
            "Orders received": "موصولہ آرڈر",
            "Total earnings": "کل آمدنی",
            "Recent products": "حالیہ مصنوعات",
            "Recent orders": "حالیہ آرڈرز",
            "Product": "مصنوعات",
            "Buyer": "خریدار",
            "Amount": "رقم",
            "Status": "حالت",
            "Shipped": "بھیجا گیا",
            "Packing": "پیکنگ",
            "Delivered": "تسلیم ہوا"
        }
    }

    if target_language not in supported:
        return jsonify({
            "original_text": text,
            "target_language": target_language,
            "translated_text": text,
            "note": "Language is not currently supported in this demo. Use EN, HI, TA, TE, ML, BN, GU, MR, KN, or UR."
        }), 200

    translated_text = COMMON_TRANSLATIONS.get(target_language, {}).get(text)
    if translated_text is None:
        translated_text = translate_with_openai(text, target_language) or text

    return jsonify({
        "original_text": text,
        "target_language": target_language,
        "translated_text": translated_text,
        "language_name": supported[target_language],
        "note": "AI translation fallback active; if OPENAI_API_KEY is configured, the app uses OpenAI for live translation. Otherwise it uses built-in language mappings."
    }), 200


@app.route("/api/translate/batch", methods=["POST"])
def translate_batch():
    data = request.get_json(silent=True) or {}
    texts = data.get("texts")
    target_language = str(data.get("target_language", "en")).lower()
    supported_codes = {"en", "hi", "ta", "te", "ml", "bn", "gu", "mr", "kn", "ur"}
    if not isinstance(texts, list) or not all(isinstance(text, str) for text in texts):
        return jsonify({"error": "Field 'texts' must be an array of strings"}), 400
    if target_language not in supported_codes:
        return jsonify({"error": "Unsupported target language"}), 400
    unique_texts = list(dict.fromkeys(text.strip() for text in texts if text.strip()))[:250]
    translations = translate_many_with_openai(unique_texts, target_language)
    return jsonify({
        "target_language": target_language,
        "translations": {text: translations.get(text, text) for text in unique_texts},
        "ai_enabled": bool(os.getenv("OPENAI_API_KEY")),
    }), 200


# =================================================================
# A friendly homepage route, so opening the site in a browser
# doesn't just show a blank "Not Found" error.
# =================================================================
@app.route("/", methods=["GET"])
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/download/artisanai-complete.zip", methods=["GET"])
def download_project():
    archive_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ArtisanAI-complete.zip"))
    if not os.path.isfile(archive_path):
        return jsonify({"error": "Project archive is not available"}), 404
    return send_file(archive_path, as_attachment=True, download_name="ArtisanAI-complete.zip")


# ---------------------------------------------------------------
# STEP 4: Run the app
# ---------------------------------------------------------------
init_db()

if __name__ == "__main__":
    # debug=True auto-restarts the server whenever you save a code change
    app.run(debug=False, host="0.0.0.0", port=5000)