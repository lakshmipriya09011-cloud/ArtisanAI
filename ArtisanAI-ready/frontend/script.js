/* =========================================================
   ArtisanAI — script.js
   Handles: SPA navigation, bilingual toggle, mobile menu,
   demo login, product data + marketplace/catalog rendering,
   product detail view, and the three AI-tool demo flows.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     1. SAMPLE PRODUCT DATA
     --------------------------------------------------------- */
  let PRODUCTS = [
    { id: 1, name: { en: "Blue Pottery Vase", hi: "ब्लू पॉटरी फूलदान" }, category: "Pottery", price: 1450, icon: "🏺",
      artisan: "Hello Lakshmi Priyaa", region: "Jaipur, Rajasthan",
      desc: { en: "A hand-thrown blue pottery vase glazed with traditional cobalt patterns, fired using centuries-old Jaipur techniques.", hi: "पारंपरिक कोबाल्ट पैटर्न से सजा हाथ से बना ब्लू पॉटरी फूलदान, जो सदियों पुरानी जयपुर तकनीक से बनाया गया है।" } },
    { id: 2, name: { en: "Madhubani Painting", hi: "मधुबनी पेंटिंग" }, category: "Painting", price: 2200, icon: "🎨",
      artisan: "Ravi Paswan", region: "Madhubani, Bihar",
      desc: { en: "A vibrant Madhubani folk painting depicting nature and mythology, hand-painted with natural pigments on handmade paper.", hi: "प्रकृति और पौराणिक कथाओं को दर्शाती एक जीवंत मधुबनी लोक चित्रकला, हस्तनिर्मित कागज़ पर प्राकृतिक रंगों से हाथ से बनाई गई।" } },
    { id: 3, name: { en: "Terracotta Diya Set", hi: "टेराकोटा दीया सेट" }, category: "Pottery", price: 680, icon: "🪔",
      artisan: "Hello Lakshmi Priyaa", region: "Khurja, Uttar Pradesh",
      desc: { en: "A set of 6 hand-moulded terracotta diyas, perfect for festive lighting, finished with a natural clay glaze.", hi: "त्योहारी रोशनी के लिए बिल्कुल उपयुक्त, 6 हाथ से बने टेराकोटा दीयों का सेट, प्राकृतिक मिट्टी की चमक के साथ तैयार।" } },
    { id: 4, name: { en: "Banarasi Silk Stole", hi: "बनारसी सिल्क स्टोल" }, category: "Textiles & Weaving", price: 3400, icon: "🧣",
      artisan: "Imran Ansari", region: "Varanasi, Uttar Pradesh",
      desc: { en: "A handwoven Banarasi silk stole with fine zari brocade work, woven on a traditional pit loom.", hi: "बारीक ज़री बुनाई के साथ हाथ से बुना गया बनारसी सिल्क स्टोल, पारंपरिक पिट लूम पर बुना गया।" } },
    { id: 5, name: { en: "Silver Filigree Earrings", hi: "सिल्वर फिलिग्री बालियां" }, category: "Jewelry", price: 1250, icon: "💍",
      artisan: "Sunita Behera", region: "Cuttack, Odisha",
      desc: { en: "Intricate silver filigree earrings handcrafted using the delicate Cuttack tarakasi technique.", hi: "कटक की नाज़ुक तारकशी तकनीक से हाथ से बनाई गई बारीक सिल्वर फिलिग्री बालियां।" } },
    { id: 6, name: { en: "Warli Art Wall Panel", hi: "वारली आर्ट वॉल पैनल" }, category: "Painting", price: 1800, icon: "🖼️",
      artisan: "Jivya Meshram", region: "Palghar, Maharashtra",
      desc: { en: "A Warli tribal art wall panel painted with white pigment on a natural earthen backdrop, depicting village life.", hi: "गांव के जीवन को दर्शाता, प्राकृतिक मिट्टी की पृष्ठभूमि पर सफ़ेद रंग से बना वारली जनजातीय कला वॉल पैनल।" } },
    { id: 7, name: { en: "Handloom Cotton Saree", hi: "हैंडलूम कॉटन साड़ी" }, category: "Textiles & Weaving", price: 2100, icon: "👘",
      artisan: "Lakshmi Nair", region: "Kannur, Kerala",
      desc: { en: "A breathable handloom cotton saree with a woven temple border, ideal for everyday elegance.", hi: "बुने हुए मंदिर बॉर्डर के साथ हल्की और आरामदायक हैंडलूम कॉटन साड़ी, रोज़मर्रा की खूबसूरती के लिए उपयुक्त।" } },
    { id: 8, name: { en: "Carved Wooden Elephant", hi: "नक्काशीदार लकड़ी का हाथी" }, category: "Woodwork", price: 950, icon: "🐘",
      artisan: "Manoj Kumhar", region: "Saharanpur, Uttar Pradesh",
      desc: { en: "A hand-carved rosewood elephant figurine, sanded and polished by hand over three days of careful work.", hi: "हाथ से नक्काशीदार शीशम की लकड़ी का हाथी, तीन दिनों की मेहनत से हाथ से रेता और पॉलिश किया गया।" } }
  ];

  const state = {
    lang: localStorage.getItem("artisanai_lang") || "en",
    cartCount: 0,
    cartItems: [],
    currentProductId: null
  };
  const API_URL = window.location.protocol === "file:"
    ? "http://127.0.0.1:5000"
    : window.location.port === "5500"
      ? `${window.location.protocol}//${window.location.hostname}:5000`
      : window.location.origin;

  /* ---------------------------------------------------------
     2. NAVIGATION (SPA page switching)
     --------------------------------------------------------- */
  const pages = document.querySelectorAll(".page");
  const mainNav = document.getElementById("mainNav");

  function showPage(id, opts) {
    opts = opts || {};
    let found = false;
    pages.forEach((p) => {
      const match = p.dataset.page === id;
      p.classList.toggle("is-active", match);
      if (match) found = true;
    });
    if (!found) {
      document.querySelector('[data-page="landing"]').classList.add("is-active");
      id = "landing";
    }
    // sync sidebar / nav active states
    document.querySelectorAll(".side-link, .nav-link").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.target === id);
    });
    if (!opts.skipHash) {
      history.pushState(null, "", "#" + id);
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    mainNav.classList.remove("open");
    document.getElementById("hamburgerBtn").setAttribute("aria-expanded", "false");
  }

  // Any element with data-target navigates
  document.body.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-target]");
    if (!trigger) return;
    e.preventDefault();
    showPage(trigger.dataset.target);
  });

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "") || "landing";
    showPage(id, { skipHash: true });
  });

  /* ---------------------------------------------------------
     3. LANGUAGE SUPPORT (English / Bengali)
     --------------------------------------------------------- */
  const SUPPORTED_LANGUAGES = ["en", "bn"];
  const translationCache = new Map();
  let languageRequestId = 0;

  async function translateText(text, lang) {
    if (!text || lang === "en") return text;
    const key = `${lang}:${text}`;
    if (translationCache.has(key)) return translationCache.get(key);
    try {
      const response = await fetch(`${API_URL}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, target_language: lang })
      });
      const data = await response.json();
      const translated = data.translated_text || text;
      translationCache.set(key, translated);
      return translated;
    } catch (error) {
      console.warn("Translation fallback used:", error);
      return text;
    }
  }

  async function showMessage(text) {
    alert(await translateText(text, state.lang));
  }

  async function applyLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) lang = "en";
    const requestId = ++languageRequestId;
    state.lang = lang;
    localStorage.setItem("artisanai_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-lang", lang);

    if (document.getElementById("marketGrid")) {
      renderMarketGrid();
      renderMyCatalogGrid();
      renderDashboardRecent();
      if (state.currentProductId) renderProductDetail(state.currentProductId);
    }

    const nodes = Array.from(document.querySelectorAll("[data-en]"));
    const attributeNodes = [];
    document.querySelectorAll("[placeholder], [aria-label]").forEach((el) => {
      ["placeholder", "aria-label"].forEach((attribute) => {
        const value = el.getAttribute(attribute);
        if (value && value !== "98xxxxxxxx" && value !== "0000") {
          attributeNodes.push({ el, attribute, value });
        }
      });
    });
    const translations = await Promise.all(nodes.map((el) => translateText(el.dataset.en, lang)));
    const attributeTranslations = await Promise.all(
      attributeNodes.map(({ value }) => translateText(value, lang))
    );
    if (requestId !== languageRequestId) return;
    nodes.forEach((el, index) => { el.textContent = translations[index]; });
    attributeNodes.forEach(({ el, attribute }, index) => {
      el.setAttribute(attribute, attributeTranslations[index]);
    });
    const select = document.getElementById("languageSelect");
    if (select) select.value = lang;
  }

  document.getElementById("languageSelect").addEventListener("change", (event) => {
    applyLanguage(event.target.value);
  });

  applyLanguage(SUPPORTED_LANGUAGES.includes(state.lang) ? state.lang : "en");

  /* ---------------------------------------------------------
     4. MOBILE MENU
     --------------------------------------------------------- */
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  hamburgerBtn.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    hamburgerBtn.setAttribute("aria-expanded", String(isOpen));
  });

  /* ---------------------------------------------------------
     5. LOGIN FLOW (demo)
     --------------------------------------------------------- */
  const loginForm = document.getElementById("loginForm");
  const stepPhone = document.getElementById("stepPhone");
  const stepOtp = document.getElementById("stepOtp");

  document.getElementById("sendOtpBtn").addEventListener("click", async () => {
    const phone = document.getElementById("phoneInput").value.trim();
    if (phone.length < 10) {
      document.getElementById("phoneInput").focus();
      return;
    }

    const status = document.getElementById("otpStatus");
    status.textContent = "Sending OTP...";
    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send OTP");
      status.textContent = data.demo
        ? "Demo mode: your OTP is 1234."
        : "OTP sent. Check your phone.";
      document.getElementById("otpHint").textContent = data.demo
        ? "Demo mode: enter OTP 1234."
        : "Enter the OTP sent to your phone.";
    } catch (error) {
      status.textContent = error.message;
      return;
    }

    stepPhone.classList.add("hidden");
    stepOtp.classList.remove("hidden");
    document.getElementById("otpInput").focus();
  });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const otp = document.getElementById("otpInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();
    const otpHint = document.getElementById("otpHint");
    otpHint.textContent = "Verifying...";
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP");
    } catch (error) {
      otpHint.textContent = error.message;
      document.getElementById("otpInput").focus();
      return;
    }
    showPage("dashboard");
    // reset form state for next visit
    stepPhone.classList.remove("hidden");
    stepOtp.classList.add("hidden");
    loginForm.reset();
  });

  document.getElementById("registerLink").addEventListener("click", () => {
    document.getElementById("phoneInput").focus();
  });

  /* ---------------------------------------------------------
     6. ADD PRODUCT — photo preview
     --------------------------------------------------------- */
  const uploadBox = document.getElementById("uploadBox");
  const productPhotoInput = document.getElementById("productPhoto");
  uploadBox.addEventListener("click", () => productPhotoInput.click());
  productPhotoInput.addEventListener("change", () => {
    const file = productPhotoInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    document.getElementById("uploadPreviewWrap").innerHTML =
      '<img src="' + url + '" alt="Product preview">';
  });
  document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("prodName").value.trim();
  const category = document.getElementById("prodCategory").value;
  const price = document.getElementById("prodPrice").value;
  const description = document.getElementById("prodDesc").value.trim();

  if (!name || !category || !price || Number(price) <= 0) {
    await showMessage("Please enter a name, category, and valid price.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name,
        category: category,
        price: Number(price),
        description: description
      })
    });


    const data = await response.json();

    if (!response.ok) {
      await showMessage(data.error || "Could not add product");
      return;
    }

    await showMessage("✅ Product added successfully!");

    const savedProduct = data.product;
    PRODUCTS.unshift({
      id: savedProduct.id,
      name: { en: savedProduct.name, hi: savedProduct.name },
      category: savedProduct.category,
      price: Number(savedProduct.price),
      icon: "🛍️",
      artisan: "Hello Lakshmi Priyaa",
      region: "India",
      desc: { en: savedProduct.description || "", hi: savedProduct.description || "" }
    });
    renderMarketGrid();
    renderMyCatalogGrid();
    renderDashboardRecent();
    document.getElementById("addProductForm").reset();
    document.getElementById("uploadPreviewWrap").innerHTML =
      '<span class="upload-icon">📷</span><p>Tap to add a photo</p>';

    showPage("my-catalog");

  } catch (error) {
    console.error("Error:", error);
    await showMessage("❌ Could not connect to the backend");
  }
});
  /* ---------------------------------------------------------
     7. AI IMAGE STUDIO (demo)
     --------------------------------------------------------- */
  const studioUploadBtn = document.getElementById("studioUploadBtn");
  const studioUpload = document.getElementById("studioUpload");
  let studioImageUrl = "";
  studioUploadBtn.addEventListener("click", () => studioUpload.click());
  studioUpload.addEventListener("change", () => {
    const file = studioUpload.files[0];
    if (!file) return;
    studioImageUrl = URL.createObjectURL(file);
    document.getElementById("rawPreview").innerHTML =
      '<img src="' + studioImageUrl + '" alt="Raw upload">';
  });

  document.getElementById("generateImageBtn").addEventListener("click", async function () {
    const spinner = document.getElementById("resultSpinner");
    const content = document.getElementById("resultContent");
    const label = document.getElementById("resultLabel");
    const box = document.getElementById("resultPreview");
    if (!studioImageUrl) {
      label.textContent = await translateText("Upload a photo first.", state.lang);
      return;
    }
    content.classList.add("hidden");
    spinner.classList.remove("hidden");
    label.textContent = await translateText("AI is enhancing your photo...", state.lang);
    box.classList.remove("is-done");
    this.disabled = true;

    try {
      const response = await fetch(`${API_URL}/api/image/enhance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: studioImageUrl })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not enhance image");
      content.innerHTML = '<img src="' + data.enhanced_image_url + '" alt="Enhanced product">';
      label.textContent = await translateText("Done! Clean background and improved lighting applied.", state.lang);
      box.classList.add("is-done");
    } catch (error) {
      content.textContent = "⚠️";
      label.textContent = error.message;
    } finally {
      spinner.classList.add("hidden");
      content.classList.remove("hidden");
      this.disabled = false;
    }
  });

  /* ---------------------------------------------------------
     8. AI CATALOG GENERATOR (demo)
     --------------------------------------------------------- */
  document.getElementById("generateCatalogBtn").addEventListener("click", async () => {
    const craft = document.getElementById("genCraft").value || "Handmade product";
    const materials = document.getElementById("genMaterials").value || "traditional materials";
    const region = document.getElementById("genRegion").value || "India";
    const langChoice = document.getElementById("genLang").value;
    const out = document.getElementById("catalogOutput");

    const en = {
      title: craft + " — Handcrafted in " + region,
      desc: "A beautifully handcrafted " + craft.toLowerCase() + ", made using " + materials.toLowerCase() +
        " by skilled artisans in " + region + ". Every piece carries the unique mark of the hands that made it — no two are exactly alike.",
      tags: ["handmade", "artisan-made", region.split(",")[0].trim().toLowerCase(), craft.split(" ")[0].toLowerCase(), "traditional craft"]
    };
    const bn = {
      title: craft + " — " + region + "-এ হস্তনির্মিত",
      desc: "এটি " + region + "-এর দক্ষ কারিগরদের তৈরি একটি সুন্দর " + craft + ", যেখানে " + materials + " ব্যবহার করা হয়েছে। প্রতিটি পণ্যে কারিগরের হাতের অনন্য ছাপ রয়েছে।",
      tags: ["হস্তনির্মিত", "কারিগর-তৈরি", "ঐতিহ্যবাহী কারুশিল্প"]
    };

    let html = "";
    if (langChoice !== "bn") {
      html += '<div class="lang-block"><span class="lang-flag">English</span>' +
        "<h3>" + en.title + "</h3><p>" + en.desc + "</p>" +
        '<div class="tag-row">' + en.tags.map((t) => '<span class="tag-chip">#' + t.replace(/\s+/g, "") + "</span>").join("") + "</div></div>";
    }
    if (langChoice !== "en") {
      html += '<div class="lang-block"><span class="lang-flag">বাংলা</span>' +
        "<h3>" + bn.title + "</h3><p>" + bn.desc + "</p>" +
        '<div class="tag-row">' + bn.tags.map((t) => '<span class="tag-chip">#' + t + "</span>").join("") + "</div></div>";
    }
    out.innerHTML = html;
  });

  /* ---------------------------------------------------------
     9. SMART PRICING ASSISTANT (real calculation, demo comparisons)
     --------------------------------------------------------- */
  document.getElementById("calcPriceBtn").addEventListener("click", () => {
    const materials = parseFloat(document.getElementById("priceMaterials").value) || 0;
    const hours = parseFloat(document.getElementById("priceHours").value) || 0;
    const rate = parseFloat(document.getElementById("priceRate").value) || 0;

    const labour = hours * rate;
    const base = materials + labour;
    const fairMargin = base * 0.35; // margin for artisan's profit
    const low = Math.round((base + fairMargin * 0.7) / 10) * 10;
    const high = Math.round((base + fairMargin * 1.3) / 10) * 10;
    const marketAvg = Math.round(((low + high) / 2) * 1.05 / 10) * 10;
    const resale = Math.round(((low + high) / 2) * 1.9 / 10) * 10;

    document.getElementById("priceLow").textContent = "₹" + low;
    document.getElementById("priceHigh").textContent = "₹" + high;

    const maxVal = Math.max(high, marketAvg, resale, 1);
    document.getElementById("barYou").style.width = (high / maxVal * 100) + "%";
    document.getElementById("barMarket").style.width = (marketAvg / maxVal * 100) + "%";
    document.getElementById("barResale").style.width = (resale / maxVal * 100) + "%";
  });
  // run once with default values so the panel isn't empty
  document.getElementById("calcPriceBtn").click();

  /* ---------------------------------------------------------
     10. PRODUCT GRIDS — marketplace & artisan catalog
     --------------------------------------------------------- */
  async function loadProductsFromBackend() {
  try {
    const response = await fetch(`${API_URL}/api/products`);
    const data = await response.json();

    console.log("Products from Flask:", data.products);

    return (data.products || []).map(p => ({
      id: p.id,
      name: {
        en: p.name,
        hi: p.name
      },
      category: p.category,
      price: Number(p.price),
      icon: p.icon || "🛍️",
      artisan: p.artisan || "Artisan",
      region: p.region || "India",
      desc: {
        en: p.description || "",
        hi: p.description || ""
      }
    }));

  } catch (error) {
    console.error("Backend connection error:", error);
    return [];
  }
}
  
function productCardHTML(p) {
    const name = p.name[state.lang] || p.name.en;
    return (
      '<div class="product-card" data-product-id="' + p.id + '">' +
        '<div class="product-thumb"><span class="cat-chip" data-en="' + p.category + '">' + p.category + '</span>' + p.icon + "</div>" +
        '<div class="product-body">' +
          '<h3 data-en="' + p.name.en + '">' + name + "</h3>" +
          '<div class="product-artisan">' + p.artisan + " · " + p.region + "</div>" +
          '<div class="product-price-row">' +
            '<span class="product-price">₹' + p.price.toLocaleString("en-IN") + "</span>" +
            '<button type="button" class="mini-btn" data-view-product="' + p.id + '">' +
              '<span data-en="View">View</span>' +
            "</button>" +
          "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function renderMyCatalogGrid() {
    const grid = document.getElementById("myCatalogGrid");
    const q = (document.getElementById("myCatalogSearch").value || "").toLowerCase();
    const mine = PRODUCTS.filter((p) => (p.name.en + p.name.hi).toLowerCase().includes(q));
    grid.innerHTML = mine.length
      ? mine.map(productCardHTML).join("")
      : '<div class="empty-state" data-en="No products found.">No products found.</div>';
    document.getElementById("productCount").textContent = PRODUCTS.length;
  }

  function renderMarketGrid() {
    const grid = document.getElementById("marketGrid");
    const query = (document.getElementById("marketSearch").value || "").toLowerCase();
    const category = document.getElementById("marketCategory").value;
    const sort = document.getElementById("marketSort").value;
    const products = PRODUCTS.filter((p) => {
      const name = (p.name.en + " " + p.name.hi).toLowerCase();
      const matchesQuery = !query || name.includes(query) || p.category.toLowerCase().includes(query);
      const matchesCategory = category === "all" || p.category === category;
      return matchesQuery && matchesCategory;
    });

    if (sort === "low") products.sort((a, b) => a.price - b.price);
    if (sort === "high") products.sort((a, b) => b.price - a.price);

    grid.innerHTML = products.length
      ? products.map(productCardHTML).join("")
      : '<div class="empty-state" data-en="No products found.">No products found.</div>';
    renderCartPanel();
  }

  function renderCartPanel() {
    const panel = document.getElementById("cartPanel");
    const items = document.getElementById("cartItems");
    if (!panel || !items) return;
    panel.hidden = state.cartItems.length === 0;
    items.innerHTML = state.cartItems.map((id) => {
      const product = PRODUCTS.find((item) => item.id === id);
      if (!product) return "";
      return '<article class="cart-item"><strong>' + product.name.en + '</strong>' +
        '<span>₹' + product.price.toLocaleString("en-IN") + '</span>' +
        '<button type="button" class="btn btn-soft" data-ai-details="' + product.id + '" data-en="✨ Get AI product details">✨ Get AI product details</button>' +
        '<div class="ai-cart-details" id="ai-cart-details-' + product.id + '"></div></article>';
    }).join("");
  }

  function renderDashboardRecent() {
    const wrap = document.getElementById("dashRecentProducts");
    wrap.innerHTML = PRODUCTS.slice(0, 4).map((p) => (
      '<div class="mini-item" data-view-product="' + p.id + '">' +
        '<span class="mini-thumb">' + p.icon + "</span>" +
        '<span class="mini-info"><strong data-en="' + p.name.en + '">' + (p.name[state.lang] || p.name.en) + "</strong>" +
        "<span>₹" + p.price.toLocaleString("en-IN") + "</span></span>" +
      "</div>"
    )).join("");
  }

  ["marketSearch", "marketCategory", "marketSort"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderMarketGrid);
  });
  document.getElementById("myCatalogSearch").addEventListener("input", renderMyCatalogGrid);

  /* ---------------------------------------------------------
     11. PRODUCT DETAILS
     --------------------------------------------------------- */
  function renderProductDetail(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    const wrap = document.getElementById("productDetailWrap");
    if (!p) {
      wrap.innerHTML = "";
      return;
    }
    const name = p.name[state.lang] || p.name.en;
    const desc = p.desc[state.lang] || p.desc.en;
    wrap.innerHTML =
      '<button type="button" class="link-btn back-link" data-target="marketplace" data-en="← Back to marketplace">← Back to marketplace</button>' +
      '<div class="detail-grid">' +
        "<div>" +
          '<div class="detail-gallery-main">' + p.icon + "</div>" +
          '<div class="detail-thumbs"><span>' + p.icon + "</span><span>🧵</span><span>📦</span></div>" +
        "</div>" +
        "<div class=\"detail-info\">" +
          '<span class="cat-chip-solo" data-en="' + p.category + '">' + p.category + "</span>" +
          '<h1 data-en="' + p.name.en + '">' + name + "</h1>" +
          '<div class="detail-price-row"><span class="detail-price">₹' + p.price.toLocaleString("en-IN") + "</span></div>" +
          '<p data-en="' + p.desc.en + '">' + desc + "</p>" +
          '<div class="detail-actions">' +
            '<button type="button" class="btn btn-primary btn-lg" id="addToCartBtn" data-en="🧺 Add to Cart">🧺 Add to Cart</button>' +
            '<button type="button" class="btn btn-outline btn-lg" id="buyNowBtn" data-en="Buy Now">Buy Now</button>' +
          "</div>" +
          '<div class="artisan-box">' +
            '<span class="artisan-avatar">🧑‍🎨</span>' +
            "<span><strong>" + p.artisan + "</strong><span>" + p.region + "</span></span>" +
          "</div>" +
        "</div>" +
      "</div>";


    document.getElementById("addToCartBtn").addEventListener("click", () => bumpCart(p.id));
    document.getElementById("buyNowBtn").addEventListener("click", () => bumpCart(p.id));
  }

  async function loadAiProductDetails(id) {
    const target = document.getElementById("ai-cart-details-" + id);
    if (!target) return;
    target.textContent = "Loading AI details...";
    try {
      const response = await fetch(`${API_URL}/api/products/${id}/ai-details`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load AI details");
      target.innerHTML = "<p><strong>Story:</strong> " + data.story + "</p>" +
        "<p><strong>Care:</strong> " + data.care + "</p>" +
        "<p><strong>Best for:</strong> " + data.best_for + "</p>";
    } catch (error) {
      target.textContent = error.message;
    }
  }

  function bumpCart(productId) {
    if (productId && !state.cartItems.includes(productId)) state.cartItems.push(productId);
    state.cartCount += 1;
    document.getElementById("cartCount").textContent = state.cartCount;
    renderCartPanel();
  }

  document.body.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view-product]");
    const card = e.target.closest("[data-product-id]");
    const id = viewBtn ? parseInt(viewBtn.dataset.viewProduct, 10)
             : card ? parseInt(card.dataset.productId, 10)
             : null;
    if (id) {
      state.currentProductId = id;
      renderProductDetail(id);
      showPage("product-details");
    }
    const detailsButton = e.target.closest("[data-ai-details]");
    if (detailsButton) loadAiProductDetails(parseInt(detailsButton.dataset.aiDetails, 10));
  });

  /* ---------------------------------------------------------
     12. INIT
     --------------------------------------------------------- */
  let initialized = false;
  async function init() {
    if (initialized) return;
    initialized = true;
    const startId = location.hash.replace("#", "") || "landing";
    showPage(startId, { skipHash: true });

    await applyLanguage(state.lang);

    const backendProducts = await loadProductsFromBackend();

    if (backendProducts.length > 0) {
      PRODUCTS = backendProducts;
    }

    renderMarketGrid();
    renderMyCatalogGrid();
    renderDashboardRecent();
}

  init();

})();  