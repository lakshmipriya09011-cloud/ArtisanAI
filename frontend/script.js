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
    { id: 1, name: { en: "Blue Pottery Vase", hi: "ब्लू पॉटरी फूलदान" }, category: "Pottery", price: 1450, icon: "🏺", image_url: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
      artisan: "Hello Lakshmi Priyaa", region: "Jaipur, Rajasthan",
      desc: { en: "A hand-thrown blue pottery vase glazed with traditional cobalt patterns, fired using centuries-old Jaipur techniques.", hi: "पारंपरिक कोबाल्ट पैटर्न से सजा हाथ से बना ब्लू पॉटरी फूलदान, जो सदियों पुरानी जयपुर तकनीक से बनाया गया है।" } },
    { id: 2, name: { en: "Madhubani Painting", hi: "मधुबनी पेंटिंग" }, category: "Paintings", price: 2200, icon: "🎨", image_url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=800&q=80",
      artisan: "Ravi Paswan", region: "Madhubani, Bihar",
      desc: { en: "A vibrant Madhubani folk painting depicting nature and mythology, hand-painted with natural pigments on handmade paper.", hi: "प्रकृति और पौराणिक कथाओं को दर्शाती एक जीवंत मधुबनी लोक चित्रकला, हस्तनिर्मित कागज़ पर प्राकृतिक रंगों से हाथ से बनाई गई।" } },
    { id: 3, name: { en: "Terracotta Diya Set", hi: "टेराकोटा दीया सेट" }, category: "Pottery", price: 680, icon: "🪔", image_url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
      artisan: "Hello Lakshmi Priyaa", region: "Khurja, Uttar Pradesh",
      desc: { en: "A set of 6 hand-moulded terracotta diyas, perfect for festive lighting, finished with a natural clay glaze.", hi: "त्योहारी रोशनी के लिए बिल्कुल उपयुक्त, 6 हाथ से बने टेराकोटा दीयों का सेट, प्राकृतिक मिट्टी की चमक के साथ तैयार।" } },
    { id: 4, name: { en: "Banarasi Silk Stole", hi: "बनारसी सिल्क स्टोल" }, category: "Handloom", price: 3400, icon: "🧣", image_url: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
      artisan: "Imran Ansari", region: "Varanasi, Uttar Pradesh",
      desc: { en: "A handwoven Banarasi silk stole with fine zari brocade work, woven on a traditional pit loom.", hi: "बारीक ज़री बुनाई के साथ हाथ से बुना गया बनारसी सिल्क स्टोल, पारंपरिक पिट लूम पर बुना गया।" } },
    { id: 5, name: { en: "Silver Filigree Earrings", hi: "सिल्वर फिलिग्री बालियां" }, category: "Jewellery", price: 1250, icon: "💍", image_url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      artisan: "Sunita Behera", region: "Cuttack, Odisha",
      desc: { en: "Intricate silver filigree earrings handcrafted using the delicate Cuttack tarakasi technique.", hi: "कटक की नाज़ुक तारकशी तकनीक से हाथ से बनाई गई बारीक सिल्वर फिलिग्री बालियां।" } },
    { id: 6, name: { en: "Warli Art Wall Panel", hi: "वारली आर्ट वॉल पैनल" }, category: "Paintings", price: 1800, icon: "🖼️", image_url: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80",
      artisan: "Jivya Meshram", region: "Palghar, Maharashtra",
      desc: { en: "A Warli tribal art wall panel painted with white pigment on a natural earthen backdrop, depicting village life.", hi: "गांव के जीवन को दर्शाता, प्राकृतिक मिट्टी की पृष्ठभूमि पर सफ़ेद रंग से बना वारली जनजातीय कला वॉल पैनल।" } },
    { id: 7, name: { en: "Handloom Cotton Saree", hi: "हैंडलूम कॉटन साड़ी" }, category: "Handloom", price: 2100, icon: "👘", image_url: "https://images.unsplash.com/photo-1610189012906-4c3c0f2b1f3d?auto=format&fit=crop&w=800&q=80",
      artisan: "Lakshmi Nair", region: "Kannur, Kerala",
      desc: { en: "A breathable handloom cotton saree with a woven temple border, ideal for everyday elegance.", hi: "बुने हुए मंदिर बॉर्डर के साथ हल्की और आरामदायक हैंडलूम कॉटन साड़ी, रोज़मर्रा की खूबसूरती के लिए उपयुक्त।" } },
    { id: 8, name: { en: "Carved Wooden Elephant", hi: "नक्काशीदार लकड़ी का हाथी" }, category: "Wood Craft", price: 950, icon: "🐘", image_url: "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=800&q=80",
      artisan: "Manoj Kumhar", region: "Saharanpur, Uttar Pradesh",
      desc: { en: "A hand-carved rosewood elephant figurine, sanded and polished by hand over three days of careful work.", hi: "हाथ से नक्काशीदार शीशम की लकड़ी का हाथी, तीन दिनों की मेहनत से हाथ से रेता और पॉलिश किया गया।" } }
  ];

  const state = {
    lang: localStorage.getItem("artisanai_lang") || "en",
    cartCount: 0,
    currentProductId: null
  };
  const API_URL = window.location.protocol === "file:"
    ? "http://127.0.0.1:5000"
    : window.location.port === "5500"
      ? `${window.location.protocol}//${window.location.hostname}:5000`
      : window.location.origin;
  const DEFAULT_PRODUCT_IMAGE = "/static/uploads/products/default-product.svg";

  function getCategory(selectId, customInputId) {
    const select = document.getElementById(selectId);
    return select.value === "__custom__"
      ? document.getElementById(customInputId).value.trim()
      : select.value;
  }

  function updateCustomCategory(selectId, customInputId) {
    const select = document.getElementById(selectId);
    const input = document.getElementById(customInputId);
    const isCustom = select.value === "__custom__";
    input.classList.toggle("hidden", !isCustom);
    input.required = isCustom;
    if (isCustom) input.focus();
  }

  [["prodCategory", "prodCustomCategory"], ["priceCategory", "priceCustomCategory"], ["marketCategory", "marketCustomCategory"]]
    .forEach(([selectId, customInputId]) => {
      document.getElementById(selectId).addEventListener("change", () => updateCustomCategory(selectId, customInputId));
    });

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
      history.pushState(null, "", "#/" + id);
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
    const id = location.hash.replace(/^#\/?/, "") || "landing";
    showPage(id, { skipHash: true });
  });

  const voiceAssistantBtn = document.getElementById("voiceAssistantBtn");
  const voiceStatus = document.getElementById("voiceStatus");
  const voiceCommandInput = document.getElementById("voiceCommandInput");
  const voiceSubmitBtn = document.getElementById("voiceSubmitBtn");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function executeVoiceCommand() {
    const command = voiceCommandInput.value.trim().toLowerCase();
    if (!command) return;
    const wantsCart = /\b(add|put|save)\b.*\b(cart|basket)\b/.test(command) || command.includes("कार्ट में");
    const wantsPurchase = /\b(buy|purchase|order|checkout)\b/.test(command) || command.includes("खरीद");
    if ((wantsCart || wantsPurchase) && state.currentProductId) {
      const actionButton = document.getElementById(wantsPurchase ? "buyNowBtn" : "addToCartBtn");
      if (actionButton) {
        actionButton.click();
        voiceStatus.textContent = wantsPurchase
          ? (state.lang === "hi" ? "खरीदारी शुरू हो गई।" : "Purchase started.")
          : (state.lang === "hi" ? "उत्पाद कार्ट में जोड़ दिया गया।" : "Product added to cart.");
        return;
      }
    }
    const isSearch = /\b(search|find|show me|look for|देखें|खोजें)\b/.test(command);
    const destinations = [
      { page: "marketplace", words: ["marketplace", "go to market", "open market", "बाज़ार", "बाजार"] },
      { page: "dashboard", words: ["dashboard", "my dashboard", "go to dashboard", "डैशबोर्ड"] },
      { page: "pricing-assistant", words: ["pricing", "smart pricing", "open pricing", "कीमत", "मूल्य"] },
      { page: "add-product", words: ["add product", "new product", "list a product", "उत्पाद जोड़ें"] },
      { page: "my-catalog", words: ["my products", "my catalog", "open catalog", "मेरे उत्पाद"] },
      { page: "image-studio", words: ["image studio", "enhance image", "इमेज स्टूडियो"] },
      { page: "catalog-generator", words: ["catalog generator", "generate listing", "कैटलॉग जनरेटर"] },
      { page: "landing", words: ["go home", "go back", "होम"] }
    ];
    const destination = isSearch ? null : destinations.find((item) => item.words.some((word) => command.includes(word)));
    if (destination) {
      showPage(destination.page);
      voiceStatus.textContent = state.lang === "hi" ? "आपका आदेश पूरा हो गया।" : "Your request is complete.";
      return;
    }
    showPage("marketplace");
    document.getElementById("marketSearch").value = voiceCommandInput.value.trim();
    renderMarketGrid();
    voiceStatus.textContent = state.lang === "hi" ? "आपकी खोज पूरी हो गई।" : "Your search is complete.";
  }

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = state.lang === "hi" ? "hi-IN" : "en-IN";
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      voiceAssistantBtn.classList.add("is-listening");
      voiceCommandInput.value = "";
      voiceSubmitBtn.disabled = true;
      voiceStatus.textContent = state.lang === "hi" ? "अब बोलें..." : "Speak now...";
    };
    recognition.onerror = (event) => {
      voiceAssistantBtn.classList.remove("is-listening");
      const errors = {
        "not-allowed": "Microphone permission was denied. Allow microphone access and try again.",
        "audio-capture": "No microphone was found. Check your microphone and try again.",
        "no-speech": "No speech detected. Click the microphone and speak clearly.",
        "network": "Voice recognition needs an internet connection in this browser."
      };
      voiceStatus.textContent = errors[event.error] || "Voice recognition failed. Please try again.";
    };
    recognition.onnomatch = () => {
      voiceAssistantBtn.classList.remove("is-listening");
      voiceStatus.textContent = "No words were recognized. Please speak again.";
    };
    recognition.onend = () => voiceAssistantBtn.classList.remove("is-listening");
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      voiceCommandInput.value = transcript;
      voiceSubmitBtn.disabled = false;
      voiceStatus.textContent = state.lang === "hi" ? "खोज रहा हूँ..." : "Searching...";
      executeVoiceCommand();
    };
    voiceAssistantBtn.addEventListener("click", () => {
      if (voiceAssistantBtn.classList.contains("is-listening")) return;
      recognition.lang = state.lang === "hi" ? "hi-IN" : "en-IN";
      try {
        recognition.start();
      } catch (error) {
        voiceAssistantBtn.classList.remove("is-listening");
        voiceStatus.textContent = "Microphone is already active. Please wait and try again.";
      }
    });
    voiceSubmitBtn.addEventListener("click", executeVoiceCommand);
  } else {
    voiceAssistantBtn.disabled = true;
    voiceSubmitBtn.disabled = true;
    voiceStatus.textContent = "Voice commands are not supported in this browser.";
  }

  /* ---------------------------------------------------------
     3. LANGUAGE TOGGLE (English / Hindi)
     --------------------------------------------------------- */
  function applyLanguage(lang) {
    state.lang = lang;
    localStorage.setItem("artisanai_lang", lang);
    document.documentElement.setAttribute("lang", lang === "hi" ? "hi" : "en");
    document.documentElement.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-en]").forEach((el) => {
      // skip elements only used as containers for translation data (none currently)
      const text = el.dataset[lang] || el.dataset.en;
      if (text !== undefined) el.textContent = text;
    });
  }

  document.getElementById("langToggle").addEventListener("click", () => {
    applyLanguage(state.lang === "en" ? "hi" : "en");
  });

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
  let productPhotoDataUrl = "";
  uploadBox.addEventListener("click", () => productPhotoInput.click());
  productPhotoInput.addEventListener("change", () => {
    const file = productPhotoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      productPhotoDataUrl = reader.result;
      document.getElementById("uploadPreviewWrap").innerHTML =
        '<img src="' + productPhotoDataUrl + '" alt="Product preview">';
    };
    reader.readAsDataURL(file);
  });
  document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("prodName").value.trim();
  const category = getCategory("prodCategory", "prodCustomCategory");
  const price = document.getElementById("prodPrice").value;
  const description = document.getElementById("prodDesc").value.trim();
  const artisan = document.getElementById("prodArtisan").value.trim() || "Artisan";
  const region = document.getElementById("prodRegion").value.trim() || "India";
  const imageFile = productPhotoInput.files[0];

  if (!name || !category || !price || Number(price) <= 0 || !imageFile) {
    alert("Please choose a product image and add a product name, category, and valid price.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", Number(price));
    formData.append("description", description);
    formData.append("artisan", artisan);
    formData.append("region", region);
    if (imageFile) formData.append("image", imageFile);

    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      body: formData
    });


    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Could not add product");
      return;
    }

    alert("✅ Product added successfully!");

    const savedProduct = data.product;
    PRODUCTS.unshift({
      id: savedProduct.id,
      name: { en: savedProduct.name, hi: savedProduct.name },
      category: savedProduct.category,
      price: Number(savedProduct.price),
      image_url: savedProduct.image_url || DEFAULT_PRODUCT_IMAGE,
      icon: "🛍️",
      artisan: savedProduct.artisan || artisan,
      region: savedProduct.region || region,
      desc: { en: savedProduct.description || "", hi: savedProduct.description || "" }
    });
    renderMarketGrid();
    renderMyCatalogGrid();
    renderDashboardRecent();
    document.getElementById("addProductForm").reset();
    productPhotoInput.value = "";
    productPhotoDataUrl = "";
    document.getElementById("uploadPreviewWrap").innerHTML =
      '<span class="upload-icon">📷</span><p>Upload Product Image</p><small>JPG, PNG, or WEBP (required)</small>';

    showPage("my-catalog");

  } catch (error) {
    console.error("Error:", error);
    alert("❌ Could not connect to the backend");
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
      label.textContent = state.lang === "hi" ? "पहले एक फ़ोटो अपलोड करें।" : "Upload a photo first.";
      return;
    }
    content.classList.add("hidden");
    spinner.classList.remove("hidden");
    label.textContent = state.lang === "hi" ? "AI आपकी फ़ोटो निखार रहा है..." : "AI is enhancing your photo...";
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
      label.textContent = state.lang === "hi"
        ? "तैयार! साफ़ बैकग्राउंड और बेहतर रोशनी के साथ।"
        : "Done! Clean background and improved lighting applied.";
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
  document.getElementById("generateCatalogBtn").addEventListener("click", () => {
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
    const hi = {
      title: craft + " — " + region + " में हस्तनिर्मित",
      desc: "यह एक खूबसूरती से हाथ से बनाया गया " + craft + " है, जिसे " + region + " के कुशल कारीगरों ने " + materials + " का उपयोग करके तैयार किया है। हर उत्पाद उसे बनाने वाले हाथों की अनूठी छाप रखता है — कोई भी दो उत्पाद बिल्कुल एक जैसे नहीं होते।",
      tags: ["हस्तनिर्मित", "कारीगर-निर्मित", "पारंपरिक शिल्प"]
    };

    let html = "";
    if (langChoice !== "hi") {
      html += '<div class="lang-block"><span class="lang-flag">English</span>' +
        "<h3>" + en.title + "</h3><p>" + en.desc + "</p>" +
        '<div class="tag-row">' + en.tags.map((t) => '<span class="tag-chip">#' + t.replace(/\s+/g, "") + "</span>").join("") + "</div></div>";
    }
    if (langChoice !== "en") {
      html += '<div class="lang-block"><span class="lang-flag">हिंदी</span>' +
        "<h3>" + hi.title + "</h3><p>" + hi.desc + "</p>" +
        '<div class="tag-row">' + hi.tags.map((t) => '<span class="tag-chip">#' + t + "</span>").join("") + "</div></div>";
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
      image_url: p.image_url || DEFAULT_PRODUCT_IMAGE,
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
        '<div class="product-thumb"><span class="cat-chip">' + p.category + '</span><img src="' + (p.image_url || DEFAULT_PRODUCT_IMAGE) + '" alt="' + name + '"></div>' +
        '<div class="product-body">' +
          "<h3>" + name + "</h3>" +
          '<div class="product-artisan">' + p.artisan + " · " + p.region + "</div>" +
          '<div class="product-price-row">' +
            '<span class="product-price">₹' + p.price.toLocaleString("en-IN") + "</span>" +
            '<button type="button" class="mini-btn" data-view-product="' + p.id + '">' +
              (state.lang === "hi" ? "विवरण देखें" : "View Details") +
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
      : '<div class="empty-state">' + (state.lang === "hi" ? "कोई उत्पाद नहीं मिला।" : "No products found.") + "</div>";
    document.getElementById("productCount").textContent = PRODUCTS.length;
  }

  function renderMarketGrid() {
    const grid = document.getElementById("marketGrid");
    const query = (document.getElementById("marketSearch").value || "").toLowerCase();
    const categorySelect = document.getElementById("marketCategory");
    const category = getCategory("marketCategory", "marketCustomCategory");
    const sort = document.getElementById("marketSort").value;
    const products = PRODUCTS.filter((p) => {
      const name = (p.name.en + " " + p.name.hi).toLowerCase();
      const artisan = (p.artisan || "").toLowerCase();
      const region = (p.region || "").toLowerCase();
      const matchesQuery = !query || name.includes(query) || artisan.includes(query) || region.includes(query) || p.category.toLowerCase().includes(query);
      const categoryAliases = {
        jewellery: ["jewellery", "jewelry"],
        paintings: ["paintings", "painting"],
        handloom: ["handloom", "textiles & weaving"],
        "wood craft": ["wood craft", "woodwork", "woodcraft"]
      };
      const selectedCategories = categoryAliases[category.toLowerCase()] || [category.toLowerCase()];
      const matchesCategory = categorySelect.value === "all" || (category && selectedCategories.includes(p.category.toLowerCase()));
      return matchesQuery && matchesCategory;
    });

    if (sort === "low") products.sort((a, b) => a.price - b.price);
    if (sort === "high") products.sort((a, b) => b.price - a.price);

    grid.innerHTML = products.length
      ? products.map(productCardHTML).join("")
      : '<div class="empty-state">' + (state.lang === "hi" ? "कोई उत्पाद नहीं मिला।" : "No products found.") + "</div>";
  }

  function renderDashboardRecent() {
    const wrap = document.getElementById("dashRecentProducts");
    wrap.innerHTML = PRODUCTS.slice(0, 4).map((p) => (
      '<div class="mini-item" data-view-product="' + p.id + '">' +
        '<span class="mini-thumb">' + p.icon + "</span>" +
        '<span class="mini-info"><strong>' + (p.name[state.lang] || p.name.en) + "</strong>" +
        "<span>₹" + p.price.toLocaleString("en-IN") + "</span></span>" +
      "</div>"
    )).join("");
  }

  ["marketSearch", "marketCategory", "marketSort", "marketCustomCategory"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderMarketGrid);
  });
  ["marketCategory", "marketSort"].forEach((id) => {
    document.getElementById(id).addEventListener("change", renderMarketGrid);
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
      '<button type="button" class="link-btn back-link" data-target="marketplace">' +
        (state.lang === "hi" ? "← बाज़ार पर वापस जाएं" : "← Back to marketplace") +
      "</button>" +
      '<div class="detail-grid">' +
        "<div>" +
          '<div class="detail-gallery-main"><img src="' + (p.image_url || DEFAULT_PRODUCT_IMAGE) + '" alt="' + name + '"></div>' +
          '<div class="detail-thumbs"><span><img src="' + (p.image_url || DEFAULT_PRODUCT_IMAGE) + '" alt="' + name + '"></span><span>🧵</span><span>📦</span></div>' +
        "</div>" +
        "<div class=\"detail-info\">" +
          '<span class="cat-chip-solo">' + p.category + "</span>" +
          "<h1>" + name + "</h1>" +
          '<div class="detail-price-row"><span class="detail-price">₹' + p.price.toLocaleString("en-IN") + "</span></div>" +
          "<p>" + desc + "</p>" +
          '<div class="detail-actions">' +
            '<button type="button" class="btn btn-primary btn-lg" id="addToCartBtn">🧺 ' + (state.lang === "hi" ? "कार्ट में डालें" : "Add to Cart") + "</button>" +
            '<button type="button" class="btn btn-outline btn-lg" id="buyNowBtn">' + (state.lang === "hi" ? "अभी खरीदें" : "Buy Now") + "</button>" +
          "</div>" +
          '<div class="artisan-box">' +
            '<span class="artisan-avatar">🧑‍🎨</span>' +
            "<span><strong>" + p.artisan + "</strong><span>" + p.region + "</span></span>" +
          "</div>" +
        "</div>" +
      "</div>";


    document.getElementById("addToCartBtn").addEventListener("click", bumpCart);
    document.getElementById("buyNowBtn").addEventListener("click", buyProduct);
  }

  function bumpCart() {
    state.cartCount += 1;
    document.getElementById("cartCount").textContent = state.cartCount;
  }

  function buyProduct() {
    bumpCart();
    alert(state.lang === "hi" ? "खरीदारी शुरू हो गई। आपका उत्पाद कार्ट में है।" : "Purchase started. Your product is in the cart.");
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
  });

  /* ---------------------------------------------------------
     12. INIT
     --------------------------------------------------------- */
  async function init() {
    applyLanguage(state.lang);

    const startId = location.hash.replace(/^#\/?/, "") || "landing";
    showPage(startId, { skipHash: true });

    const backendProducts = await loadProductsFromBackend();

    if (backendProducts.length > 0) {
      PRODUCTS = backendProducts;
    }

    renderMarketGrid();
    renderMyCatalogGrid();
    renderDashboardRecent();
}

  document.addEventListener("DOMContentLoaded", init);

})();  