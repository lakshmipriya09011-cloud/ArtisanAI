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
      artisan: "Kamla Devi", region: "Jaipur, Rajasthan",
      desc: { en: "A hand-thrown blue pottery vase glazed with traditional cobalt patterns, fired using centuries-old Jaipur techniques.", hi: "पारंपरिक कोबाल्ट पैटर्न से सजा हाथ से बना ब्लू पॉटरी फूलदान, जो सदियों पुरानी जयपुर तकनीक से बनाया गया है।" } },
    { id: 2, name: { en: "Madhubani Painting", hi: "मधुबनी पेंटिंग" }, category: "Painting", price: 2200, icon: "🎨",
      artisan: "Ravi Paswan", region: "Madhubani, Bihar",
      desc: { en: "A vibrant Madhubani folk painting depicting nature and mythology, hand-painted with natural pigments on handmade paper.", hi: "प्रकृति और पौराणिक कथाओं को दर्शाती एक जीवंत मधुबनी लोक चित्रकला, हस्तनिर्मित कागज़ पर प्राकृतिक रंगों से हाथ से बनाई गई।" } },
    { id: 3, name: { en: "Terracotta Diya Set", hi: "टेराकोटा दीया सेट" }, category: "Pottery", price: 680, icon: "🪔",
      artisan: "Kamla Devi", region: "Khurja, Uttar Pradesh",
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
    currentProductId: null,
    authenticated: false,
    dashboardProducts: []
  };
  const API_URL = window.location.port === "8000"
    ? "http://127.0.0.1:5000"
    : window.location.origin;

  /* ---------------------------------------------------------
     2. NAVIGATION (SPA page switching)
     --------------------------------------------------------- */
  const pages = document.querySelectorAll(".page");
  const mainNav = document.getElementById("mainNav");

  function showPage(id, opts) {
    opts = opts || {};
    const privatePages = ["dashboard", "add-product", "image-studio", "catalog-generator", "pricing-assistant", "my-catalog"];
    if (privatePages.includes(id) && !state.authenticated) {
      id = "login";
    }
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
     3. MULTI-LANGUAGE SUPPORT (AI translation fallback)
     --------------------------------------------------------- */
  const SUPPORTED_LANGUAGES = ["en", "hi", "ta", "te", "ml", "bn", "gu", "mr", "kn", "ur"];
  let languageRequestId = 0;
  const translationCache = new Map();
  const COMMON_TRANSLATIONS = {
    hi: {
      Home: "होम",
      Marketplace: "बाज़ार",
      About: "जानकारी",
      "Artisan Dashboard": "कारीगर डैशबोर्ड",
      "Artisan Login": "कारीगर लॉगिन",
      "I am an Artisan": "मैं एक कारीगर हूँ",
      "Explore Marketplace": "बाज़ार देखें",
      Dashboard: "डैशबोर्ड",
      "Add Product": "उत्पाद जोड़ें",
      "My Products": "मेरे उत्पाद",
      "AI Image Studio": "AI इमेज स्टूडियो",
      "AI Catalog Generator": "AI कैटलॉग जनरेटर",
      "Smart Pricing": "स्मार्ट प्राइसिंग",
      Logout: "लॉगआउट",
      "Add New Product": "नया उत्पाद जोड़ें",
      "View Marketplace": "बाज़ार देखें",
      "Products listed": "सूचीबद्ध उत्पाद",
      "Views this month": "इस माह के व्यू",
      "Orders received": "प्राप्त ऑर्डर",
      "Total earnings": "कुल कमाई",
      "Recent products": "हाल के उत्पाद",
      "Recent orders": "हाल के ऑर्डर",
      Product: "उत्पाद",
      Buyer: "ग्राहक",
      Amount: "राशि",
      Status: "स्थिति",
      Shipped: "भेजा गया",
      Packing: "पैकिंग में",
      Delivered: "डिलीवर हो गया",
      "Add a new product": "नया उत्पाद जोड़ें",
      "Fill what you can — our AI tools help with the rest.": "जो जानते हैं भरें — बाकी काम में हमारे AI टूल मदद करेंगे।",
      Photo: "फ़ोटो",
      Details: "विवरण",
      "AI Help": "AI मदद",
      Publish: "प्रकाशित करें",
      "Tap to add a photo": "फ़ोटो जोड़ने के लिए टैप करें",
      "Product name": "उत्पाद का नाम",
      Category: "श्रेणी",
      "Materials used": "उपयोग की गई सामग्री",
      "Short description (optional)": "संक्षिप्त विवरण (वैकल्पिक)"
    },
    ta: {
      Home: "முகப்பு",
      Marketplace: "சந்தை",
      About: "பற்றி",
      "Artisan Dashboard": "கைவினைஞர் டாஷ்போர்டு",
      "Artisan Login": "கைவினைஞர் உள்நுழைவு",
      "I am an Artisan": "நான் ஒரு கைவினைஞர்",
      "Explore Marketplace": "சந்தையைப் பாருங்கள்",
      Dashboard: "டாஷ்போர்டு",
      "Add Product": "பொருள் சேர்க்கவும்",
      "My Products": "என் பொருட்கள்",
      "AI Image Studio": "AI படம் ஸ்டுடியோ",
      "AI Catalog Generator": "AI கேடலாக் ஜெனரேட்டர்",
      "Smart Pricing": "ஸ்மார்ட் விலை",
      Logout: "வெளியேறு",
      "Add New Product": "புதிய பொருள் சேர்க்கவும்",
      "View Marketplace": "சந்தையைப் பாருங்கள்",
      "Products listed": "பட்டியலிடப்பட்ட பொருட்கள்",
      "Views this month": "இந்த மாதம் பார்வைகள்",
      "Orders received": "பெறப்பட்ட ஆர்டர்கள்",
      "Total earnings": "மொத்த வருமானம்",
      "Recent products": "சமீபத்திய பொருட்கள்",
      "Recent orders": "சமீபத்திய ஆர்டர்கள்",
      Product: "பொருள்",
      Buyer: "வாங்குபவர்",
      Amount: "தொகை",
      Status: "நிலை",
      Shipped: "அனுப்பப்பட்டது",
      Packing: "பேக்கிங்",
      Delivered: "வழங்கப்பட்டது"
    },
    te: {
      Home: "హోమ్",
      Marketplace: "మార్కెట్",
      About: "గురించి",
      "Artisan Dashboard": "కళాకార డాష్బోర్డ్",
      "Artisan Login": "కళాకార లాగిన్",
      "I am an Artisan": "నేను కళాకారుడిని",
      "Explore Marketplace": "మార్కెట్ చూడండి",
      Dashboard: "డాష్బోర్డ్",
      "Add Product": "ఉత్పత్తి జోడించండి",
      "My Products": "నా ఉత్పత్తులు",
      "AI Image Studio": "AI ఇమేజ్ స్టూడియో",
      "AI Catalog Generator": "AI క్యాటలాగ్ జనరేటర్",
      "Smart Pricing": "స్మార్ట్ ధర",
      Logout: "లాగ్అవుట్",
      "Add New Product": "కొత్త ఉత్పత్తి జోడించండి",
      "View Marketplace": "మార్కెట్ చూడండి",
      "Products listed": "జాబితా చేయబడిన ఉత్పత్తులు",
      "Views this month": "ఈ నెల చూసినవారు",
      "Orders received": "స్వీకరించిన ఆర్డర్లు",
      "Total earnings": "మొత్తం ఆదాయం",
      "Recent products": "ఇటీవలి ఉత్పత్తులు",
      "Recent orders": "ఇటీవలి ఆర్డర్లు",
      Product: "ఉత్పత్తి",
      Buyer: "కొనుగోరి",
      Amount: "మొత్తం",
      Status: "స్థితి",
      Shipped: "అனுப்பబడింది",
      Packing: "ప్యాకింగ్",
      Delivered: "పొందుపర్చారు"
    },
    ml: {
      Home: "ഹോം",
      Marketplace: "മാർക്കറ്റ്പ്ലേസ്",
      About: "വിവരം",
      "Artisan Dashboard": "കുറുവിളക്കാർ ഡാഷ്ബോർഡ്",
      "Artisan Login": "കുറുവിളക്കാർ ലോഗിൻ",
      "I am an Artisan": "ഞാൻ ഒരു കച്ചവടക്കാരൻ",
      "Explore Marketplace": "മാർക്കറ്റ്പ്ലേസ് കാണുക",
      Dashboard: "ഡാഷ്ബോർഡ്",
      "Add Product": "ഉൽപ്പന്നം ചേർക്കുക",
      "My Products": "എന്റെ ഉൽപ്പന്നങ്ങൾ",
      "AI Image Studio": "AI ഇമേജ് സ്റ്റുഡിയോ",
      "AI Catalog Generator": "AI കാറ്റലോഗ് ജനറേറ്റർ",
      "Smart Pricing": "സ്മാർട് വില",
      Logout: "പുറത്തുകടക്കുക",
      "Add New Product": "പുതിയ ഉൽപ്പന്നം ചേർക്കുക",
      "View Marketplace": "മാർക്കറ്റ്പ്ലേസ് കാണുക",
      "Products listed": "പട്ടികയിൽ ഉള്ള ഉൽപ്പന്നങ്ങൾ",
      "Views this month": "ഈ മാസത്തെ കാഴÕES",
      "Orders received": "സമ്പാദിച്ച ഓർഡറുകൾ",
      "Total earnings": "മൊത്തം വരുമാനം",
      "Recent products": "സമീപകാല ഉൽപ്പന്നങ്ങൾ",
      "Recent orders": "സമീപകാല ഓർഡറുകൾ",
      Product: "ഉൽപ്പന്നം",
      Buyer: "വാങ്ങുന്നയാൾ",
      Amount: "തുക",
      Status: "സ്ഥിതി",
      Shipped: "അയച്ചു",
      Packing: "പോക്കിംഗ്",
      Delivered: "എത്തിച്ചു"
    },
    bn: {
      Home: "হোম",
      Marketplace: "মার্কেটপ্লেস",
      About: "সম্পর্কে",
      "Artisan Dashboard": "কারিগর ড্যাশবোর্ড",
      "Artisan Login": "কারিগর লগইন",
      "I am an Artisan": "আমি একজন কারিগর",
      "Explore Marketplace": "মার্কেটপ্লেস দেখুন",
      Dashboard: "ড্যাশবোর্ড",
      "Add Product": "পণ্য যোগ করুন",
      "My Products": "আমার পণ্য",
      "AI Image Studio": "AI ইমেজ স্টুডিও",
      "AI Catalog Generator": "AI ক্যাটালগ জেনারেটর",
      "Smart Pricing": "স্মার্ট মূল্য",
      Logout: "লগআউট",
      "Add New Product": "নতুন পণ্য যোগ করুন",
      "View Marketplace": "মার্কেটপ্লেস দেখুন",
      "Products listed": "তালিকাভুক্ত পণ্য",
      "Views this month": "এই মাসে ভিউ",
      "Orders received": "গৃহীত অর্ডার",
      "Total earnings": "মোট আয়",
      "Recent products": "সাম্প্রতিক পণ্য",
      "Recent orders": "সাম্প্রতিক অর্ডার",
      Product: "পণ্য",
      Buyer: "ক্রেতা",
      Amount: "পরিমাণ",
      Status: "অবস্থা",
      Shipped: "প্রেরিত",
      Packing: "প্যাকিং",
      Delivered: "বিতরণ করা হয়েছে"
    },
    gu: {
      Home: "હોમ",
      Marketplace: "માર્કેટપ્લેસ",
      About: "વિશે",
      "Artisan Dashboard": "કારીગર ડેશબોર્ડ",
      "Artisan Login": "કારીગર લોગિન",
      "I am an Artisan": "હું એક કારીગર છું",
      "Explore Marketplace": "માર્કેટપ્લેસ જુઓ",
      Dashboard: "ડેશબોર્ડ",
      "Add Product": "ઉત્પાદન ઉમેરો",
      "My Products": "મારા ઉત્પાદન",
      "AI Image Studio": "AI ઇમેજ સ્ટુડિયો",
      "AI Catalog Generator": "AI કેટલોગ જનરેટર",
      "Smart Pricing": "સ્માર્ટ ભાવ",
      Logout: "લોગઆઉટ",
      "Add New Product": "નવું ઉત્પાદન ઉમેરો",
      "View Marketplace": "માર્કેટપ્લેસ જુઓ",
      "Products listed": "સૂચીમાં આપેલ ઉત્પાદનો",
      "Views this month": "આ મહિને દેખાવ",
      "Orders received": "પ્રાપ્ત ઓર્ડર",
      "Total earnings": "કુલ આવક",
      "Recent products": "તાજેતરના ઉત્પાદનો",
      "Recent orders": "તાજેતરના ઓર્ડર",
      Product: "ઉત્પાદન",
      Buyer: "ખરીદનાર",
      Amount: "રકમ",
      Status: "સ્થિતિ",
      Shipped: "મોકલ્યું",
      Packing: "પેકિંગ",
      Delivered: "પહંચ્યું"
    },
    mr: {
      Home: "मुख्यपृष्ठ",
      Marketplace: "मार्केटप्लेस",
      About: "माहिती",
      "Artisan Dashboard": "कारागीर डॅशबोर्ड",
      "Artisan Login": "कारागीर लॉगिन",
      "I am an Artisan": "मी एक कारागीर आहे",
      "Explore Marketplace": "मार्केटप्लेस पहा",
      Dashboard: "डॅशबोर्ड",
      "Add Product": "उत्पादन जोडा",
      "My Products": "माझे उत्पादन",
      "AI Image Studio": "AI इमेज स्टुडिओ",
      "AI Catalog Generator": "AI कॅटलॉग जनरेटर",
      "Smart Pricing": "स्मार्ट किंमत",
      Logout: "लॉगआउट",
      "Add New Product": "नवीन उत्पादन जोडा",
      "View Marketplace": "मार्केटप्लेस पहा",
      "Products listed": "यादीत उत्पादन",
      "Views this month": "या महिन्यात दृश्ये",
      "Orders received": "प्राप्त ऑर्डर",
      "Total earnings": "एकूण कमाई",
      "Recent products": "अलीकडील उत्पादन",
      "Recent orders": "अलीकडील ऑर्डर",
      Product: "उत्पादन",
      Buyer: "खरेदीदार",
      Amount: "रक्कम",
      Status: "स्थिती",
      Shipped: "पाठवले",
      Packing: "पॅकिंग",
      Delivered: "पुरवले"
    },
    kn: {
      Home: "ಹೋಮ್",
      Marketplace: "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್",
      About: "ಮಾಹಿತಿ",
      "Artisan Dashboard": "ಕಾರಿಗರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "Artisan Login": "ಕಾರಿಗರ ಲಾಗಿನ್",
      "I am an Artisan": "ನಾನು ಒಂದು ಕಲೆಗಾರ",
      "Explore Marketplace": "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ವೀಕ್ಷಿಸಿ",
      Dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "Add Product": "ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
      "My Products": "ನನ್ನ ಉತ್ಪನ್ನಗಳು",
      "AI Image Studio": "AI ಇಮೇಜ್ ಸ್ಟುಡಿಯೋ",
      "AI Catalog Generator": "AI ಕ್ಯಾಟಲಾಗ್ ಜನರೇಟರ್",
      "Smart Pricing": "ಸ್ಮಾರ್ಟ್ ದರ",
      Logout: "ಲಾಗ್‌ಔಟ್",
      "Add New Product": "ಹೊಸ ಉತ್ಪನ್ನ ಸೇರಿಸಿ",
      "View Marketplace": "ಮಾರ್ಕೆಟ್‌ಪ್ಲೇಸ್ ವೀಕ್ಷಿಸಿ",
      "Products listed": "ಪಟ್ಟಿಮಾಡಲಾದ ಉತ್ಪನ್ನಗಳು",
      "Views this month": "ಈ ತಿಂಗಳು ವೀಕ್ಷಣೆಗಳು",
      "Orders received": "ಪಡೆಯಲಾದ ಆರ್ಡರ್ಗಳು",
      "Total earnings": "ಒಟ್ಟು ಆದಾಯ",
      "Recent products": "ಇತ್ತೀಚಿನ ಉತ್ಪನ್ನಗಳು",
      "Recent orders": "ಇತ್ತೀಚಿನ ಆರ್ಡರ್ಗಳು",
      Product: "ಉತ್ಪನ್ನ",
      Buyer: "ಖರೀದಿಸುವವನು",
      Amount: "ಮೊತ್ತ",
      Status: "ಸ್ಥಿತಿ",
      Shipped: "ಕಳುಹಿಸಲಾಗಿದೆ",
      Packing: "ಪ್ಯಾಕಿಂಗ್",
      Delivered: "ವಿತರಿಸಲಾಗಿದೆ"
    },
    ur: {
      Home: "ہوم",
      Marketplace: "مارکیٹ پلیس",
      About: "معلومات",
      "Artisan Dashboard": "صنعتکار ڈیش بورڈ",
      "Artisan Login": "صنعتکار لاگ ان",
      "I am an Artisan": "میں ایک صنعتکار ہوں",
      "Explore Marketplace": "مارکیٹ پلیس دیکھیں",
      Dashboard: "ڈیش بورڈ",
      "Add Product": "پروڈکٹ شامل کریں",
      "My Products": "میرے مصنوعات",
      "AI Image Studio": "AI امیج اسٹوڈیو",
      "AI Catalog Generator": "AI کیٹلاگ جنریٹر",
      "Smart Pricing": "اسمارٹ قیمت",
      Logout: "لاگ آوٹ",
      "Add New Product": "نئی پروڈکٹ شامل کریں",
      "View Marketplace": "مارکیٹ پلیس دیکھیں",
      "Products listed": "فہرست شدہ مصنوعات",
      "Views this month": "اس مہینے کے ویوز",
      "Orders received": "موصولہ آرڈر",
      "Total earnings": "کل آمدنی",
      "Recent products": "حالیہ مصنوعات",
      "Recent orders": "حالیہ آرڈرز",
      Product: "مصنوعات",
      Buyer: "خریدار",
      Amount: "رقم",
      Status: "حالت",
      Shipped: "بھیجا گیا",
      Packing: "پیکنگ",
      Delivered: "تسلیم ہوا"
    }
  };

  async function translateText(text, lang) {
    if (!text || lang === "en") return text;
    const key = `${lang}:${text}`;
    if (translationCache.has(key)) return translationCache.get(key);
    if (COMMON_TRANSLATIONS[lang] && COMMON_TRANSLATIONS[lang][text]) {
      const translated = COMMON_TRANSLATIONS[lang][text];
      translationCache.set(key, translated);
      return translated;
    }

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

  async function translateBatch(texts, lang) {
    if (!texts.length || lang === "en") return {};
    try {
      const response = await fetch(`${API_URL}/api/translate/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts, target_language: lang })
      });
      const data = await response.json();
      return data.translations || {};
    } catch (error) {
      console.warn("Batch translation fallback used:", error);
      return {};
    }
  }

  async function applyLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) lang = "en";
    const requestId = ++languageRequestId;
    state.lang = lang;
    localStorage.setItem("artisanai_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-lang", lang);

    renderMarketGrid();
    renderMyCatalogGrid();
    renderDashboardRecent();
    if (state.currentProductId) renderProductDetail(state.currentProductId);

    const nodes = document.querySelectorAll("[data-en]");
    const translationsByText = {};
    const missingTexts = [];
    const sourceTexts = Array.from(nodes).map((el) => {
      const sourceText = el.dataset.en || "";
      if (el.dataset[lang]) translationsByText[sourceText] = el.dataset[lang];
      else if (lang === "en") translationsByText[sourceText] = sourceText;
      else if (!missingTexts.includes(sourceText)) missingTexts.push(sourceText);
      return sourceText;
    });
    Object.assign(translationsByText, await translateBatch(missingTexts, lang));
    if (requestId !== languageRequestId) return;
    nodes.forEach((el, index) => {
      const translated = translationsByText[sourceTexts[index]] || sourceTexts[index];
      if (translated) el.textContent = translated;
    });
    const langSelect = document.getElementById("langSelect");
    if (langSelect) langSelect.value = lang;
  }

  function detectPreferredLanguage() {
    const saved = localStorage.getItem("artisanai_lang");
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }

    const browserLanguages = [];
    if (navigator.languages && navigator.languages.length) {
      browserLanguages.push(...navigator.languages);
    }
    if (navigator.language) {
      browserLanguages.push(navigator.language);
    }

    const localeMap = {
      en: "en",
      hi: "hi",
      hin: "hi",
      ta: "ta",
      te: "te",
      ml: "ml",
      bn: "bn",
      gu: "gu",
      mr: "mr",
      kn: "kn",
      ur: "ur"
    };

    for (const candidate of browserLanguages) {
      if (!candidate) continue;
      const normalized = candidate.toLowerCase();
      const base = normalized.split("-")[0];
      if (SUPPORTED_LANGUAGES.includes(normalized)) return normalized;
      if (SUPPORTED_LANGUAGES.includes(base)) return base;
      if (localeMap[base]) return localeMap[base];
    }

    return "en";
  }

  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.addEventListener("change", (event) => {
      applyLanguage(event.target.value);
    });
  }

  const initialLang = detectPreferredLanguage();
  applyLanguage(initialLang);

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
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not send OTP");
      status.textContent = data.demo ? "Demo mode: your OTP is 1234." : "OTP sent. Check your phone.";
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

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = document.getElementById("phoneInput").value.trim();
    const otp = document.getElementById("otpInput").value.trim();
    fetch(`${API_URL}/api/auth/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp })
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP");
      state.authenticated = true;
      showPage("dashboard");
      await loadDashboard();
      stepPhone.classList.remove("hidden");
      stepOtp.classList.add("hidden");
      loginForm.reset();
    }).catch((error) => {
      document.getElementById("otpHint").textContent = error.message;
    });
  });

  document.getElementById("registerLink").addEventListener("click", () => {
    document.getElementById("phoneInput").focus();
  });

  document.querySelector(".side-link-logout").addEventListener("click", async (event) => {
    event.preventDefault();
    await fetch(`${API_URL}/api/auth/logout`, { method: "POST" });
    state.authenticated = false;
    showPage("landing");
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
    alert("Please enter a name, category, and valid price.");
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
      icon: "🛍️",
      artisan: "Kamla Devi",
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
    alert("❌ Could not connect to the backend");
  }
});
  /* ---------------------------------------------------------
     7. AI IMAGE STUDIO (demo)
     --------------------------------------------------------- */
  const studioUploadBtn = document.getElementById("studioUploadBtn");
  const studioUpload = document.getElementById("studioUpload");
  studioUploadBtn.addEventListener("click", () => studioUpload.click());
  studioUpload.addEventListener("change", () => {
    const file = studioUpload.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    document.getElementById("rawPreview").innerHTML =
      '<img src="' + url + '" alt="Raw upload">';
  });

  document.getElementById("generateImageBtn").addEventListener("click", function () {
    const spinner = document.getElementById("resultSpinner");
    const content = document.getElementById("resultContent");
    const label = document.getElementById("resultLabel");
    const box = document.getElementById("resultPreview");
    content.classList.add("hidden");
    spinner.classList.remove("hidden");
    label.textContent = state.lang === "hi" ? "AI आपकी फ़ोटो निखार रहा है..." : "AI is enhancing your photo...";
    box.classList.remove("is-done");
    this.disabled = true;

    setTimeout(() => {
      spinner.classList.add("hidden");
      content.classList.remove("hidden");
      content.textContent = "🏺✨";
      box.classList.add("is-done");
      label.textContent = state.lang === "hi"
        ? "तैयार! साफ़ बैकग्राउंड और बेहतर रोशनी के साथ।"
        : "Done! Clean background and improved lighting applied.";
      this.disabled = false;
    }, 1400);
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
    const hi = {
      title: craft + " — " + region + " में हस्तनिर्मित",
      desc: "यह एक खूबसूरती से हाथ से बनाया गया " + craft + " है, जिसे " + region + " के कुशल कारीगरों ने " + materials + " का उपयोग करके तैयार किया है। हर उत्पाद उसे बनाने वाले हाथों की अनूठी छाप रखता है — कोई भी दो उत्पाद बिल्कुल एक जैसे नहीं होते।",
      tags: ["हस्तनिर्मित", "कारीगर-निर्मित", "पारंपरिक शिल्प"]
    };

    const targetLanguage = langChoice === "both" ? state.lang : langChoice;
    const translated = targetLanguage === "en" ? en : {
      title: await translateText(en.title, targetLanguage),
      desc: await translateText(en.desc, targetLanguage),
      tags: await Promise.all(en.tags.map((tag) => translateText(tag, targetLanguage)))
    };

    let html = "";
    if (langChoice !== "hi") {
      html += '<div class="lang-block"><span class="lang-flag">English</span>' +
        "<h3>" + en.title + "</h3><p>" + en.desc + "</p>" +
        '<div class="tag-row">' + en.tags.map((t) => '<span class="tag-chip">#' + t.replace(/\s+/g, "") + "</span>").join("") + "</div></div>";
    }
    if (langChoice !== "en") {
      const languageLabel = langChoice === "both" ? targetLanguage.toUpperCase() : langChoice.toUpperCase();
      const listing = langChoice === "hi" ? hi : translated;
      html += '<div class="lang-block"><span class="lang-flag">' + languageLabel + "</span>" +
        "<h3>" + listing.title + "</h3><p>" + listing.desc + "</p>" +
        '<div class="tag-row">' + listing.tags.map((t) => '<span class="tag-chip">#' + t + "</span>").join("") + "</div></div>";
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
    // simulate "my products" as the first 5 sample products (this artisan's own listings)
    const mine = PRODUCTS.slice(0, 5).filter((p) => (p.name.en + p.name.hi).toLowerCase().includes(q));
    grid.innerHTML = mine.length
      ? mine.map(productCardHTML).join("")
      : '<div class="empty-state" data-en="No products found.">No products found.</div>';
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
  }

  function renderDashboardRecent() {
    const wrap = document.getElementById("dashRecentProducts");
    const products = state.dashboardProducts.slice(0, 4);
    wrap.innerHTML = products.map((p) => (
      '<div class="mini-item" data-view-product="' + p.id + '">' +
        '<span class="mini-thumb">' + p.icon + "</span>" +
        '<span class="mini-info"><strong>' + (p.name[state.lang] || p.name.en) + "</strong>" +
        "<span>₹" + p.price.toLocaleString("en-IN") + "</span></span>" +
      "</div>"
    )).join("");
  }

  async function loadDashboard() {
    const response = await fetch(`${API_URL}/api/artisan/dashboard`);
    if (!response.ok) {
      state.authenticated = false;
      showPage("login");
      return;
    }
    const data = await response.json();
    state.dashboardProducts = data.products || [];
    document.getElementById("dashboardProductCount").textContent = state.dashboardProducts.length;
    document.getElementById("dashboardOrderCount").textContent = (data.orders || []).length;
    document.getElementById("dashboardViews").textContent = data.analytics?.views || 0;
    document.getElementById("dashboardEarnings").textContent = "₹" + Number(data.earnings?.total || 0).toLocaleString("en-IN");
    document.getElementById("dashboardOrders").innerHTML = (data.orders || []).map((order) =>
      "<tr><td>" + order.product + "</td><td>" + order.buyer + "</td><td>₹" + Number(order.amount).toLocaleString("en-IN") + "</td><td>" + order.status + "</td></tr>"
    ).join("");
    renderDashboardRecent();
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
      '<button type="button" class="link-btn back-link" data-target="marketplace" data-en="← Back to marketplace">' +
      "← Back to marketplace" +
      "</button>" +
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
            '<a class="btn btn-soft btn-lg" id="whatsappBtn" target="_blank" rel="noopener noreferrer" data-en="💬 WhatsApp Seller">💬 WhatsApp Seller</a>' +
          "</div>" +
          '<div class="artisan-box">' +
            '<span class="artisan-avatar">🧑‍🎨</span>' +
            "<span><strong>" + p.artisan + "</strong><span>" + p.region + "</span></span>" +
          "</div>" +
        "</div>" +
      "</div>";

    document.getElementById("addToCartBtn").addEventListener("click", bumpCart);
    document.getElementById("buyNowBtn").addEventListener("click", bumpCart);
    document.getElementById("whatsappBtn").addEventListener("click", async () => {
      try {
        const response = await fetch(`${API_URL}/api/products/${id}/whatsapp`);
        const data = await response.json();
        if (response.ok && data.url) {
          window.open(data.url, "_blank", "noopener,noreferrer");
        }
      } catch (error) {
        console.warn("WhatsApp link unavailable", error);
      }
    });
  }

  function bumpCart() {
    state.cartCount += 1;
    document.getElementById("cartCount").textContent = state.cartCount;
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
    const authResponse = await fetch(`${API_URL}/api/auth/me`);
    state.authenticated = authResponse.ok && (await authResponse.json()).authenticated;
    applyLanguage(state.lang);

    const startId = location.hash.replace("#", "") || "landing";
    showPage(startId, { skipHash: true });

    if (state.authenticated) await loadDashboard();

    const backendProducts = await loadProductsFromBackend();

    if (backendProducts.length > 0) {
      PRODUCTS = backendProducts;
    }

    renderMarketGrid();
    renderMyCatalogGrid();
    renderDashboardRecent();
    await applyLanguage(state.lang);
}

  document.addEventListener("DOMContentLoaded", init);

})();  