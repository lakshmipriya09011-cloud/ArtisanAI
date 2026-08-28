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
    { id: 1008, name: { en: "Carved Wooden Elephant", hi: "नक्काशीदार लकड़ी का हाथी" }, category: "Woodwork", price: 950, icon: "🐘",
      artisan: "Manoj Kumhar", region: "Saharanpur, Uttar Pradesh",
      desc: { en: "A hand-carved rosewood elephant figurine, sanded and polished by hand over three days of careful work.", hi: "हाथ से नक्काशीदार शीशम की लकड़ी का हाथी, तीन दिनों की मेहनत से हाथ से रेता और पॉलिश किया गया।" } },
    { id: 1009, name: { en: "Blue Lotus Brass Diya", hi: "नीला कमल पीतल दीया" }, category: "Metalwork", price: 780, icon: "🪔",
      artisan: "Kavita Sahu", region: "Moradabad, Uttar Pradesh",
      desc: { en: "A hand-finished brass diya inspired by the blue lotus, shaped and polished in a family metalworking studio.", hi: "नीले कमल से प्रेरित हाथ से तैयार पीतल का दीया, पारिवारिक धातु शिल्प स्टूडियो में बनाया और चमकाया गया।" } },
    { id: 1010, name: { en: "Kutch Embroidered Cushion", hi: "कच्छ कढ़ाई कुशन" }, category: "Textiles & Weaving", price: 1150, icon: "🧵",
      artisan: "Amina Khatri", region: "Kutch, Gujarat",
      desc: { en: "A vibrant cushion cover featuring patient mirror work and geometric embroidery stitched by hand in Kutch.", hi: "कच्छ में हाथ से की गई बारीक शीशे के काम और ज्यामितीय कढ़ाई वाला रंगीन कुशन कवर।" } },
    { id: 1011, name: { en: "Blue River Ceramic Mug", hi: "नीली नदी सिरेमिक मग" }, category: "Pottery", price: 620, icon: "☕",
      artisan: "Meena Kumari", region: "Khurja, Uttar Pradesh",
      desc: { en: "A wheel-thrown ceramic mug with a flowing blue glaze, made for slow mornings and everyday rituals.", hi: "बहती नीली चमक वाला चाक पर बनाया गया सिरेमिक मग, आराम से सुबह बिताने के लिए।" } },
    { id: 1012, name: { en: "Madhubani Sun Wall Art", hi: "मधुबनी सूर्य वॉल आर्ट" }, category: "Painting", price: 1650, icon: "🌞",
      artisan: "Sita Jha", region: "Madhubani, Bihar",
      desc: { en: "A joyful hand-painted sun artwork filled with folk symbols, natural colour and the energy of Madhubani storytelling.", hi: "लोक प्रतीकों, प्राकृतिक रंगों और मधुबनी कहानी कहने की ऊर्जा से भरी आनंदमयी हाथ से बनी सूर्य चित्रकला।" } },
    { id: 1013, name: { en: "Warli Village Story", hi: "वारली गांव की कहानी" }, category: "Painting", price: 1250, icon: "🖌️",
      artisan: "Ramesh Bhagat", region: "Palghar, Maharashtra",
      desc: { en: "A hand-painted Warli scene showing village music, farming and community life in the traditional white-on-earth style.", hi: "पारंपरिक सफेद-मिट्टी शैली में गांव का संगीत, खेती और सामुदायिक जीवन दिखाने वाली हाथ से बनी वारली चित्रकला।" } },
    { id: 1014, name: { en: "Lotus Folk Canvas", hi: "कमल लोक कैनवास" }, category: "Painting", price: 1450, icon: "🌸",
      artisan: "Pooja Devi", region: "Jaipur, Rajasthan",
      desc: { en: "A vivid lotus canvas painted with natural pigments and decorative folk patterns for a calm, colourful home.", hi: "शांत और रंगीन घर के लिए प्राकृतिक रंगों और सजावटी लोक पैटर्न से बनी जीवंत कमल कैनवास चित्रकला।" } },
    { id: 1015, name: { en: "Monsoon Folk Landscape", hi: "मानसून लोक दृश्य" }, category: "Painting", price: 1950, icon: "🌧️",
      artisan: "Anil Kumar", region: "Bihar",
      desc: { en: "A layered folk landscape capturing rain, fields and village homes with expressive hand-painted detail.", hi: "बारिश, खेतों और गांव के घरों को अभिव्यंजक हाथ से बने विवरण में दिखाने वाली लोक परिदृश्य चित्रकला।" } },
    { id: 1016, name: { en: "Peacock Mandala Art", hi: "मोर मंडला कला" }, category: "Painting", price: 1750, icon: "🦚",
      artisan: "Nandini Rao", region: "Bengaluru, Karnataka",
      desc: { en: "A detailed peacock mandala combining folk geometry, jewel-like colour and patient brushwork on handmade paper.", hi: "हस्तनिर्मित कागज़ पर लोक ज्यामिति, रत्न जैसे रंग और बारीक ब्रशवर्क से बनी मोर मंडला कला।" } },
    { id: 1017, name: { en: "Heritage Temple Panel", hi: "विरासत मंदिर पैनल" }, category: "Painting", price: 2300, icon: "🛕",
      artisan: "Lakshmi Narayan", region: "Puri, Odisha",
      desc: { en: "A heritage-inspired painted panel with temple motifs, warm mineral colours and a handcrafted finish.", hi: "मंदिर आकृतियों, गर्म खनिज रंगों और हस्तनिर्मित फिनिश वाला विरासत से प्रेरित चित्रित पैनल।" } },
    { id: 1018, name: { en: "Terracotta Spice Jar", hi: "टेराकोटा मसाला जार" }, category: "Pottery", price: 890, icon: "🏺",
      artisan: "Shyam Lal", region: "Khurja, Uttar Pradesh",
      desc: { en: "A hand-thrown terracotta spice jar with a natural finish, designed for practical and beautiful kitchens.", hi: "प्राकृतिक फिनिश वाला हाथ से चाक पर बनाया गया टेराकोटा मसाला जार, सुंदर और उपयोगी रसोई के लिए।" } },
    { id: 1019, name: { en: "Ajrakh Block Print Scarf", hi: "अजरख ब्लॉक प्रिंट स्कार्फ" }, category: "Textiles & Weaving", price: 980, icon: "🧣",
      artisan: "Yusuf Khatri", region: "Ajrakhpur, Gujarat",
      desc: { en: "A soft cotton scarf printed with traditional Ajrakh blocks and plant-based colours by a master artisan.", hi: "मास्टर कारीगर द्वारा पारंपरिक अजरख ब्लॉक और वनस्पति रंगों से छपा मुलायम सूती स्कार्फ।" } },
    { id: 1020, name: { en: "Dhokra Horse Figurine", hi: "ढोकरा घोड़े की मूर्ति" }, category: "Metalwork", price: 1350, icon: "🐎",
      artisan: "Mangal Murmu", region: "Bastar, Chhattisgarh",
      desc: { en: "A sculptural Dhokra horse cast using the ancient lost-wax technique, with every surface finished by hand.", hi: "प्राचीन मोम-ढलाई तकनीक से बनी ढोकरा घोड़े की मूर्ति, जिसकी हर सतह हाथ से तैयार की गई है।" } },
    { id: 1021, name: { en: "Rosewood Serving Tray", hi: "शीशम लकड़ी सर्विंग ट्रे" }, category: "Woodwork", price: 1450, icon: "🪵",
      artisan: "Harish Kumar", region: "Saharanpur, Uttar Pradesh",
      desc: { en: "A sturdy rosewood serving tray with hand-carved edges and a food-safe natural polish.", hi: "हाथ से नक्काशीदार किनारों और प्राकृतिक पॉलिश वाली मजबूत शीशम की सर्विंग ट्रे।" } },
    { id: 1022, name: { en: "Kundan Sun Pendant", hi: "कुंदन सूर्य पेंडेंट" }, category: "Jewelry", price: 1600, icon: "📿",
      artisan: "Rekha Meena", region: "Jaipur, Rajasthan",
      desc: { en: "A bright Kundan sun pendant set by hand with traditional detail, made to add a small spark to everyday wear.", hi: "पारंपरिक बारीकी से हाथ से जड़ा हुआ चमकीला कुंदन सूर्य पेंडेंट, रोज़मर्रा के पहनावे में चमक जोड़ने के लिए।" } },
    { id: 1023, name: { en: "Hand-painted Leaf Bowl", hi: "हाथ से चित्रित पत्ती कटोरी" }, category: "Painting", price: 720, icon: "🍃",
      artisan: "Asha Devi", region: "Bhopal, Madhya Pradesh",
      desc: { en: "A small decorative bowl hand-painted with leaf motifs and natural colours, bringing a quiet folk accent to a room.", hi: "प्राकृतिक रंगों और पत्ती आकृतियों से हाथ से चित्रित छोटी सजावटी कटोरी, कमरे में लोक कला का सुंदर स्पर्श।" } },
    { id: 1024, name: { en: "Handwoven Jute Planter", hi: "हाथ से बुना जूट प्लांटर" }, category: "Textiles & Weaving", price: 540, icon: "🪴",
      artisan: "Maya Das", region: "Kolkata, West Bengal",
      desc: { en: "A sturdy handwoven jute planter made with natural fibre, bringing texture and warmth to indoor plants.", hi: "प्राकृतिक रेशे से बना मजबूत हाथ से बुना जूट प्लांटर, पौधों में सुंदर बनावट और गर्माहट जोड़ने के लिए।" } },
    { id: 1025, name: { en: "Hand-carved Mango Box", hi: "हाथ से नक्काशीदार आम की लकड़ी का डिब्बा" }, category: "Woodwork", price: 880, icon: "📦",
      artisan: "Ravi Singh", region: "Saharanpur, Uttar Pradesh",
      desc: { en: "A compact mango-wood keepsake box with floral carving, smoothed and finished by hand for everyday treasures.", hi: "फूलों की नक्काशी वाला आम की लकड़ी का छोटा डिब्बा, रोज़मर्रा की खास चीज़ों के लिए हाथ से तैयार किया गया।" } },
    { id: 1026, name: { en: "Meenakari Lotus Earrings", hi: "मीनाकारी कमल बालियां" }, category: "Jewelry", price: 1280, icon: "💠",
      artisan: "Neha Sharma", region: "Jaipur, Rajasthan",
      desc: { en: "Delicate lotus earrings finished with colourful Meenakari enamel work and a light, comfortable handcrafted form.", hi: "रंगीन मीनाकारी इनेमल काम से सजी नाज़ुक कमल बालियां, हल्की और आरामदायक हस्तनिर्मित डिजाइन के साथ।" } },
    { id: 1027, name: { en: "Bell Metal Candle Holder", hi: "बेल मेटल कैंडल होल्डर" }, category: "Metalwork", price: 1050, icon: "🕯️",
      artisan: "Bikash Karmakar", region: "Bastar, Chhattisgarh",
      desc: { en: "A warm bell-metal candle holder cast and polished by hand, designed to make evening spaces feel welcoming.", hi: "हाथ से ढाला और चमकाया गया गर्म बेल मेटल कैंडल होल्डर, शाम के कमरे को सुकून देने के लिए।" } },
    { id: 1028, name: { en: "Blue Glaze Breakfast Plate", hi: "नीली चमक वाली नाश्ते की प्लेट" }, category: "Pottery", price: 640, icon: "🍽️",
      artisan: "Farida Begum", region: "Khurja, Uttar Pradesh",
      desc: { en: "A cheerful ceramic breakfast plate with a hand-painted blue glaze, made for relaxed everyday meals.", hi: "आराम से रोज़मर्रा के भोजन के लिए हाथ से चित्रित नीली चमक वाली आनंदमयी सिरेमिक नाश्ते की प्लेट।" } },
    { id: 1029, name: { en: "Pattachitra Krishna Panel", hi: "पट्टचित्र कृष्ण पैनल" }, category: "Painting", price: 2100, icon: "🎭",
      artisan: "Gouri Maharana", region: "Raghurajpur, Odisha",
      desc: { en: "A detailed Pattachitra panel depicting Krishna, painted with traditional natural colours and fine ornamental lines.", hi: "पारंपरिक प्राकृतिक रंगों और बारीक सजावटी रेखाओं से बनी कृष्ण को दर्शाती विस्तृत पट्टचित्र कला।" } },
    { id: 1030, name: { en: "Handmade Coconut Shell Bowl", hi: "हस्तनिर्मित नारियल खोल कटोरी" }, category: "Handicrafts", price: 460, icon: "🥥",
      artisan: "Suresh Nair", region: "Kochi, Kerala",
      desc: { en: "A polished coconut-shell bowl finished with natural oil, giving sustainable materials a beautiful everyday purpose.", hi: "प्राकृतिक तेल से तैयार चमकदार नारियल खोल की कटोरी, टिकाऊ सामग्री को सुंदर रोज़मर्रा का उपयोग देती है।" } }
  ];

  const state = {
    lang: localStorage.getItem("artisanai_lang") || "en",
    cart: JSON.parse(localStorage.getItem("artisanai_cart") || "[]"),
    orders: JSON.parse(localStorage.getItem("artisanai_orders") || "[]"),
    currentProductId: null
  };
  const categoryReferenceImages = {
    Pottery: [
      "assets/artisan-pottery.jpg",
      "assets/artisan-making-pottery.jpg",
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1576020799627-aeac74d58064?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1521133573892-e44906baee46?auto=format&fit=crop&w=900&q=80"
    ],
    Painting: ["assets/artisan-art.jpg", "assets/craft-a.jpg", "assets/craft-b.jpg", "assets/craft-c.jpg", "assets/craft-d.jpg"],
    "Textiles & Weaving": [
      "assets/artisan-textiles.jpg",
      "assets/saree-making-new.jpg",
      "assets/textile-making-new.jpg",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80"
    ],
    Jewelry: "assets/artisan-handwork.jpg",
    Woodwork: "assets/artisan-woodcraft.jpg",
    Metalwork: "assets/artisan-handwork.jpg",
    Handicrafts: "assets/artisan-handwork.jpg"
  };
  const imageReferenceProfiles = [
    { terms: ["bull", "cart"], categories: ["Pottery"], image: "/uploads/products/4505c5345efc3712-Screenshot_20260827-182907.jpg" },
    { terms: ["vase", "flower"], categories: ["Pottery"], image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80" },
    { terms: ["diya", "lamp", "candle", "light"], categories: ["Pottery", "Metalwork"], image: "https://images.unsplash.com/photo-1576020799627-aeac74d58064?auto=format&fit=crop&w=900&q=80" },
    { terms: ["cup", "mug", "tea", "coffee"], categories: ["Pottery"], image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80" },
    { terms: ["plate", "bowl", "jar", "spice"], categories: ["Pottery"], image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80" },
    { terms: ["madhubani"], categories: ["Painting"], image: "assets/artisan-art.jpg" },
    { terms: ["warli"], categories: ["Painting"], image: "assets/craft-a.jpg" },
    { terms: ["peacock", "mandala"], categories: ["Painting"], image: "assets/craft-d.jpg" },
    { terms: ["pattachitra", "canvas", "painting", "art"], categories: ["Painting"], image: "assets/craft-b.jpg" },
    { terms: ["saree", "sari", "handloom"], categories: ["Textiles & Weaving"], image: "assets/saree-making-new.jpg" },
    { terms: ["stole", "scarf", "ajrakh"], categories: ["Textiles & Weaving"], image: "assets/textile-making-new.jpg" },
    { terms: ["cushion", "embroidery", "embroidered"], categories: ["Textiles & Weaving"], image: "assets/artisan-textiles.jpg" },
    { terms: ["jute", "planter", "woven"], categories: ["Textiles & Weaving"], image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=900&q=80" },
    { terms: ["gown", "dress", "silk"], categories: ["Textiles & Weaving"], image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80" },
    { terms: ["chain", "chains", "necklace"], categories: ["Jewelry"], image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80" },
    { terms: ["earring", "earrings"], categories: ["Jewelry"], image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80" },
    { terms: ["pendant", "kundan"], categories: ["Jewelry"], image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=900&q=80" },
    { terms: ["brass", "lotus", "diya"], categories: ["Metalwork"], image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?auto=format&fit=crop&w=900&q=80" },
    { terms: ["dhokra", "horse", "figurine"], categories: ["Metalwork"], image: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=80" },
    { terms: ["bell metal", "bell", "candle holder"], categories: ["Metalwork"], image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80" }
  ];

  function getProductImage(product) {
    const productName = String(product.name?.en || product.name || "").trim().toLowerCase();
    const productDescription = String(product.desc?.en || product.description || "").toLowerCase();
    const searchableText = productName + " " + productDescription;
    const uploadedImage = String(product.image_url || "").replace(/^\/static\//, "/");
    const isPlaceholder = !uploadedImage || uploadedImage.endsWith("default-product.svg");
    if (!isPlaceholder) return uploadedImage;

    let bestReference;
    let bestScore = 0;
    imageReferenceProfiles.forEach((reference) => {
      const termScore = reference.terms.reduce((score, term) => score + (searchableText.includes(term) ? 3 : 0), 0);
      const categoryScore = reference.categories.includes(product.category) ? 1 : 0;
      if (termScore + categoryScore > bestScore) {
        bestScore = termScore + categoryScore;
        bestReference = reference;
      }
    });
    const categoryImages = categoryReferenceImages[product.category];
    const categoryImage = Array.isArray(categoryImages)
      ? categoryImages[Math.abs(Number(product.id) || 0) % categoryImages.length]
      : categoryImages;
    return bestReference?.image || categoryImage || "assets/artisan-handwork.jpg";
  }

  const API_URL = window.location.protocol === "file:"
    ? "http://127.0.0.1:5000"
    : window.location.port === "5500"
      ? `${window.location.protocol}//${window.location.hostname}:5000`
      : window.location.origin;

  const heroSlides = document.querySelectorAll(".hero-slide");
  const heroDots = document.querySelectorAll(".hero-slide-dots button");
  let activeHeroSlide = 0;
  let heroSlideTimer;
  function showHeroSlide(index) {
    activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === activeHeroSlide));
    heroDots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === activeHeroSlide));
  }
  function restartHeroSlideTimer() {
    clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => showHeroSlide(activeHeroSlide + 1), 5000);
  }
  document.getElementById("heroSlidePrev").addEventListener("click", () => { showHeroSlide(activeHeroSlide - 1); restartHeroSlideTimer(); });
  document.getElementById("heroSlideNext").addEventListener("click", () => { showHeroSlide(activeHeroSlide + 1); restartHeroSlideTimer(); });
  heroDots.forEach((dot) => dot.addEventListener("click", () => { showHeroSlide(Number(dot.dataset.slide)); restartHeroSlideTimer(); }));
  restartHeroSlideTimer();

  /* ---------------------------------------------------------
     2. NAVIGATION (SPA page switching)
     --------------------------------------------------------- */
  const pages = document.querySelectorAll(".page");
  const mainNav = document.getElementById("mainNav");
  const leftMenu = document.getElementById("leftMenu");
  const leftMenuBackdrop = document.getElementById("leftMenuBackdrop");
  const leftMenuToggle = document.getElementById("leftMenuToggle");
  const categorySlugs = {
    all: "all",
    Pottery: "pottery",
    "Textiles & Weaving": "textiles-weaving",
    Painting: "painting",
    Jewelry: "jewelry",
    Woodwork: "woodwork",
    Metalwork: "metalwork"
  };
  const categoriesBySlug = Object.fromEntries(Object.entries(categorySlugs).map(([category, slug]) => [slug, category]));

  function openCategory(category) {
    document.getElementById("marketSearch").value = "";
    document.getElementById("marketCategory").value = category;
    showPage("category-" + categorySlugs[category]);
    renderMarketGrid();
  }

  function closeLeftMenu() {
    leftMenu.setAttribute("hidden", "");
    leftMenuBackdrop.setAttribute("hidden", "");
    leftMenuToggle.setAttribute("aria-expanded", "false");
  }

  leftMenuToggle.addEventListener("click", () => {
    const isOpen = leftMenu.hasAttribute("hidden");
    leftMenu.toggleAttribute("hidden", !isOpen);
    leftMenuBackdrop.toggleAttribute("hidden", !isOpen);
    leftMenuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  document.getElementById("leftMenuClose").addEventListener("click", closeLeftMenu);
  leftMenuBackdrop.addEventListener("click", closeLeftMenu);
  leftMenu.addEventListener("click", (event) => {
    const category = event.target.closest("[data-side-category]");
    if (!category) return;
    openCategory(category.dataset.sideCategory);
    closeLeftMenu();
  });

  function showPage(id, opts) {
    opts = opts || {};
    const requestedId = id;
    const categoryMatch = /^category-(.+)$/.exec(id);
    if (categoryMatch && categoriesBySlug[categoryMatch[1]]) {
      document.getElementById("marketCategory").value = categoriesBySlug[categoryMatch[1]];
      document.getElementById("marketSearch").value = "";
      id = "marketplace";
    }
    const productMatch = /^product-details-(\d+)$/.exec(id);
    if (productMatch) {
      state.currentProductId = Number(productMatch[1]);
      id = "product-details";
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
      history.pushState(null, "", "#" + requestedId);
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (id === "cart") renderCart();
    if (id === "my-orders") renderOrders();
    if (id === "product-details" && state.currentProductId) renderProductDetail(state.currentProductId);
    if (id === "marketplace") updateCategoryResultLabel();
    closeLeftMenu();
    mainNav.classList.remove("open");
    document.getElementById("hamburgerBtn").setAttribute("aria-expanded", "false");
  }

  // Any element with data-target navigates
  document.body.addEventListener("click", (e) => {
    const categoryLink = e.target.closest("[data-category-link]");
    if (categoryLink) {
      e.preventDefault();
      openCategory(categoryLink.dataset.categoryLink);
      return;
    }
    const trigger = e.target.closest("[data-target]");
    if (!trigger) return;
    e.preventDefault();
    showPage(trigger.dataset.target);
  });

  const categoryMenuToggle = document.getElementById("categoryMenuToggle");
  const categoryMenu = document.getElementById("categoryMenu");
  if (categoryMenuToggle && categoryMenu) {
    categoryMenuToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = categoryMenu.hasAttribute("hidden");
      categoryMenu.toggleAttribute("hidden", !isOpen);
      categoryMenuToggle.setAttribute("aria-expanded", String(isOpen));
    });
    categoryMenu.addEventListener("click", (event) => {
      const categoryButton = event.target.closest("[data-category]");
      if (!categoryButton) return;
      categoryMenu.setAttribute("hidden", "");
      categoryMenuToggle.setAttribute("aria-expanded", "false");
      openCategory(categoryButton.dataset.category);
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".category-menu-wrap")) {
        categoryMenu.setAttribute("hidden", "");
        categoryMenuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "") || "landing";
    showPage(id, { skipHash: true });
  });

  /* ---------------------------------------------------------
     3. LANGUAGE TOGGLE (English / Hindi)
     --------------------------------------------------------- */
  function applyLanguage(lang) {
    state.lang = lang;
    localStorage.setItem("artisanai_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("data-lang", lang);
    document.getElementById("languageSelect").value = lang;

    document.querySelectorAll("[data-en]").forEach((el) => {
      // skip elements only used as containers for translation data (none currently)
      const text = el.dataset[lang] || el.dataset.en;
      if (text !== undefined) el.textContent = text;
    });
  }

  document.getElementById("languageSelect").addEventListener("change", (event) => {
    applyLanguage(event.target.value);
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
  uploadBox.addEventListener("click", () => productPhotoInput.click());
  uploadBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      productPhotoInput.click();
    }
  });
  productPhotoInput.addEventListener("change", () => {
    const file = productPhotoInput.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    document.getElementById("uploadPreviewWrap").innerHTML =
      '<img src="' + url + '" alt="Product preview">';
  });

  const describeByVoiceBtn = document.getElementById("describeByVoiceBtn");
  const voiceProductStatus = document.getElementById("voiceProductStatus");
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    describeByVoiceBtn.disabled = true;
    voiceProductStatus.textContent = "Voice input is not supported in this browser.";
  } else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "hi-IN";

    describeByVoiceBtn.addEventListener("click", () => {
      recognition.lang = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", mr: "mr-IN", kn: "kn-IN", gu: "gu-IN" }[state.lang] || "en-IN";
      voiceProductStatus.textContent = state.lang === "hi" ? "बोलना शुरू करें..." : "Listening... describe your product.";
      describeByVoiceBtn.classList.add("is-listening");
      describeByVoiceBtn.disabled = true;
      recognition.start();
    });

    recognition.addEventListener("result", async (event) => {
      const transcript = event.results[0][0].transcript.trim();
      document.getElementById("prodDesc").value = transcript;
      voiceProductStatus.textContent = state.lang === "hi" ? "AI आपके विवरण को बेहतर बना रहा है..." : "AI is polishing your description...";
      try {
        const response = await fetch(`${API_URL}/api/ai/describe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: document.getElementById("prodName").value.trim() || transcript,
            material: document.getElementById("prodMaterials").value.trim() || "traditional materials"
          })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "AI could not create a description");
        document.getElementById("prodDesc").value = data.description;
        voiceProductStatus.textContent = state.lang === "hi" ? "तैयार! AI विवरण जोड़ दिया गया है।" : "Done! AI description added.";
      } catch (error) {
        voiceProductStatus.textContent = error.message;
      }
    });

    recognition.addEventListener("error", (event) => {
      voiceProductStatus.textContent = event.error === "not-allowed"
        ? "Microphone permission is required for voice input."
        : "Could not hear that. Please try again.";
    });
    recognition.addEventListener("end", () => {
      describeByVoiceBtn.classList.remove("is-listening");
      describeByVoiceBtn.disabled = false;
    });
  }

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
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    const photo = productPhotoInput.files[0];
    if (photo) formData.append("image", photo);

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
      image_url: savedProduct.image_url || "",
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
    const selectedLanguages = Array.from(document.getElementById("genLang").selectedOptions).map((option) => option.value);
    const languages = selectedLanguages.length ? selectedLanguages : ["en", "hi"];
    const out = document.getElementById("catalogOutput");
    const craftText = craft.toLowerCase();
    const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[character]));
    const insights = craftText.includes("pottery") || craftText.includes("ceramic") || craftText.includes("clay")
      ? { process: "Shaped by hand, dried slowly and finished with a careful glaze or natural surface.", use: "Bring warmth and handmade character to shelves, tables and everyday rituals.", care: "Wipe gently with a soft, dry cloth. Handle with care and keep away from sudden temperature changes." }
      : craftText.includes("saree") || craftText.includes("textile") || craftText.includes("stole") || craftText.includes("scarf") || craftText.includes("cushion")
        ? { process: "Prepared with patient handwork and finished with detail that gives every thread its own character.", use: "A thoughtful piece for daily style, gifting or adding texture to a welcoming home.", care: "Store folded in a dry place. Prefer gentle hand washing or professional cleaning according to the material." }
        : craftText.includes("painting") || craftText.includes("art") || craftText.includes("canvas")
          ? { process: "Built layer by layer with expressive hand-painted detail, allowing the maker's style to remain visible.", use: "Add a story-led focal point to a living room, workspace or thoughtful gift collection.", care: "Keep away from direct sunlight and moisture. Dust lightly with a soft, dry cloth." }
          : { process: "Made slowly by hand with traditional techniques, careful finishing and the small variations that make it one of a kind.", use: "A meaningful addition to an everyday space or a thoughtful gift with a maker's story.", care: "Keep dry and clean gently with a soft cloth. Store safely when not in use." };
    const historyEn = craftText.includes("pottery") || craftText.includes("ceramic") || craftText.includes("clay")
      ? "Pottery has been part of everyday life across India for generations, from useful vessels and lamps to decorative forms. This piece carries that continuing tradition from " + region + ", where the maker transforms " + materials.toLowerCase() + " into an object shaped by hand and intended to be lived with."
      : craftText.includes("saree") || craftText.includes("textile") || craftText.includes("stole") || craftText.includes("scarf") || craftText.includes("weav")
        ? "India's textile traditions have been passed from one generation to the next through patient spinning, weaving, dyeing and handwork. This piece connects that living heritage in " + region + " with contemporary use, using " + materials.toLowerCase() + " and the maker's own careful interpretation."
        : craftText.includes("painting") || craftText.includes("art") || craftText.includes("canvas")
          ? "Folk and handmade art preserve the visual memory of communities through symbols, colour and stories. Inspired by the creative traditions of " + region + ", this work carries that history forward through the maker's hand, materials and personal expression."
          : "Handcrafted objects carry knowledge through generations: materials are selected locally, techniques are learned through practice and each maker adds a personal touch. This piece connects the craft traditions of " + region + " with present-day life through " + materials.toLowerCase() + ".";
    const historyHi = craftText.includes("pottery") || craftText.includes("ceramic") || craftText.includes("clay")
      ? "भारत में मिट्टी के बर्तन पीढ़ियों से रोज़मर्रा की ज़िंदगी का हिस्सा रहे हैं। " + region + " की इस परंपरा में कारीगर " + materials + " को हाथ से आकार देकर उपयोगी और सुंदर वस्तु बनाते हैं।"
      : craftText.includes("saree") || craftText.includes("textile") || craftText.includes("stole") || craftText.includes("scarf") || craftText.includes("weav")
        ? "भारत की वस्त्र परंपराएं कताई, बुनाई, रंगाई और हाथ के धैर्यपूर्ण काम से पीढ़ी-दर-पीढ़ी आगे बढ़ी हैं। " + region + " का यह उत्पाद " + materials + " और कारीगर की अपनी शैली से उस जीवित विरासत को आज के उपयोग से जोड़ता है।"
        : craftText.includes("painting") || craftText.includes("art") || craftText.includes("canvas")
          ? "लोक और हस्तनिर्मित कला रंगों, प्रतीकों और कहानियों के माध्यम से समुदायों की स्मृति को सहेजती है। " + region + " से प्रेरित यह कृति कारीगर की कल्पना और हाथ के काम से उस परंपरा को आगे बढ़ाती है।"
          : "हस्तनिर्मित वस्तुएं पीढ़ियों का ज्ञान अपने साथ रखती हैं। सामग्री का चुनाव, तकनीक का अभ्यास और कारीगर का व्यक्तिगत स्पर्श " + region + " की शिल्प परंपरा को आज की ज़िंदगी से जोड़ते हैं।";

    const en = {
      title: craft + " — Handcrafted in " + region,
      desc: "Discover this beautifully handcrafted " + craft.toLowerCase() + ", made in " + region + " using " + materials.toLowerCase() + ". Its story begins with the maker's history: " + historyEn + " This tradition continues through careful handwork, connecting the product's origin with the person who made it and the home it will now enter. " + insights.process + " Every piece carries the unique mark of the hands that made it, so no two are exactly alike. " + insights.use + " " + insights.care,
      history: historyEn,
      process: insights.process,
      use: insights.use,
      care: insights.care,
      tags: ["handmade", "artisan-made", region.split(",")[0].trim().toLowerCase(), craft.split(" ")[0].toLowerCase(), "traditional craft"]
    };
    const hi = {
      title: craft + " — " + region + " में हस्तनिर्मित",
      desc: "यह खूबसूरती से हाथ से बनाया गया " + craft + " है, जिसे " + region + " में " + materials + " का उपयोग करके तैयार किया गया है। इसकी कहानी कारीगर के इतिहास से शुरू होती है: " + historyHi + " यह परंपरा सावधानी से किए गए हाथ के काम में आगे बढ़ती है और उत्पाद की शुरुआत को उसे बनाने वाले व्यक्ति तथा उसके नए घर से जोड़ती है। पारंपरिक तकनीकों और धैर्यपूर्ण हाथ के काम से तैयार, हर बारीकी को ध्यान से पूरा किया गया है। हर उत्पाद उसे बनाने वाले हाथों की अनूठी छाप रखता है, इसलिए कोई भी दो उत्पाद बिल्कुल एक जैसे नहीं होते। इसे घर को सुंदर बनाने, रोज़मर्रा के उपयोग या किसी खास व्यक्ति को उपहार देने के लिए चुना जा सकता है। इसे सूखी और सुरक्षित जगह रखें और मुलायम कपड़े से धीरे साफ करें।",
      history: historyHi,
      process: "पारंपरिक तकनीकों और धैर्यपूर्ण हाथ के काम से तैयार, हर बारीकी को ध्यान से पूरा किया गया है।",
      use: "घर को सुंदर बनाने, रोज़मर्रा के उपयोग या किसी खास व्यक्ति को उपहार देने के लिए।",
      care: "इसे सूखी और सुरक्षित जगह रखें और मुलायम कपड़े से धीरे साफ करें।",
      tags: ["हस्तनिर्मित", "कारीगर-निर्मित", "पारंपरिक शिल्प"]
    };

    let html = "";
    if (languages.includes("en")) {
      html += '<div class="lang-block"><span class="lang-flag">English</span>' +
        "<h3>" + escapeHTML(en.title) + "</h3><p>" + escapeHTML(en.desc) + "</p>" +
        '<div class="catalog-facts"><div><strong>History and origin</strong><span>' + escapeHTML(en.history) + '</span></div><div><strong>Materials</strong><span>' + escapeHTML(materials) + '</span></div><div><strong>How it is made</strong><span>' + escapeHTML(en.process) + '</span></div><div><strong>Perfect for</strong><span>' + escapeHTML(en.use) + '</span></div><div><strong>Care</strong><span>' + escapeHTML(en.care) + '</span></div></div>' +
        '<div class="tag-row">' + en.tags.map((t) => '<span class="tag-chip">#' + t.replace(/\s+/g, "") + "</span>").join("") + "</div></div>";
    }
    if (languages.includes("hi")) {
      html += '<div class="lang-block"><span class="lang-flag">हिंदी</span>' +
        "<h3>" + escapeHTML(hi.title) + "</h3><p>" + escapeHTML(hi.desc) + "</p>" +
        '<div class="catalog-facts"><div><strong>इतिहास और उत्पत्ति</strong><span>' + escapeHTML(hi.history) + '</span></div><div><strong>सामग्री</strong><span>' + escapeHTML(materials) + '</span></div><div><strong>कैसे बनाया गया</strong><span>' + escapeHTML(hi.process) + '</span></div><div><strong>किसके लिए</strong><span>' + escapeHTML(hi.use) + '</span></div><div><strong>देखभाल</strong><span>' + escapeHTML(hi.care) + '</span></div></div>' +
        '<div class="tag-row">' + hi.tags.map((t) => '<span class="tag-chip">#' + t + "</span>").join("") + "</div></div>";
    }
    const additionalLanguages = {
      bn: "বাংলা", ta: "தமிழ்", te: "తెలుగు", mr: "मराठी", kn: "ಕನ್ನಡ", gu: "ગુજરાતી"
    };
    languages.filter((language) => additionalLanguages[language]).forEach((language) => {
      html += '<div class="lang-block"><span class="lang-flag">' + additionalLanguages[language] + '</span>' +
        '<h3>' + escapeHTML(en.title) + '</h3><p>' + escapeHTML(en.desc) + '</p>' +
        '<div class="catalog-facts"><div><strong>Materials</strong><span>' + escapeHTML(materials) + '</span></div><div><strong>History and origin</strong><span>' + escapeHTML(en.history) + '</span></div><div><strong>How it is made</strong><span>' + escapeHTML(en.process) + '</span></div><div><strong>Perfect for</strong><span>' + escapeHTML(en.use) + '</span></div><div><strong>Care</strong><span>' + escapeHTML(en.care) + '</span></div></div>' +
        '<div class="tag-row">' + en.tags.map((t) => '<span class="tag-chip">#' + t.replace(/\s+/g, "") + "</span>").join("") + "</div></div>";
    });
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

    const normalizeCategory = (category) => {
      const value = String(category || "Handicrafts").toLowerCase();
      if (value.includes("pottery") || value.includes("ceramic") || value.includes("clay")) return "Pottery";
      if (value.includes("textile") || value.includes("weav") || value.includes("embroid") || value.includes("saree")) return "Textiles & Weaving";
      if (value.includes("paint") || value.includes("art")) return "Painting";
      if (value.includes("jewel") || value.includes("chain") || value.includes("silver")) return "Jewelry";
      if (value.includes("wood") || value.includes("carv")) return "Woodwork";
      if (value.includes("metal") || value.includes("brass")) return "Metalwork";
      return "Handicrafts";
    };
    return (data.products || []).map(p => ({
      id: p.id,
      name: {
        en: p.name,
        hi: p.name
      },
      category: normalizeCategory(p.category),
      price: Number(p.price),
      image_url: p.image_url || "",
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
    const imageUrl = getProductImage(p);
    return (
      '<div class="product-card" data-product-id="' + p.id + '">' +
        '<div class="product-thumb"><span class="cat-chip">' + p.category + '</span><img src="' + imageUrl + '" alt="' + name + '"></div>' +
        '<div class="product-body">' +
          "<h3>" + name + "</h3>" +
          '<div class="product-artisan">' + p.artisan + " · " + p.region + "</div>" +
          '<div class="product-price-row">' +
            '<span class="product-price">₹' + p.price.toLocaleString("en-IN") + "</span>" +
            '<button type="button" class="mini-btn" data-view-product="' + p.id + '">' +
              (state.lang === "hi" ? "देखें" : "View") +
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
      : '<div class="empty-state">' + (state.lang === "hi" ? "कोई उत्पाद नहीं मिला।" : "No products found.") + "</div>";
    updateCategoryResultLabel();
  }

  function updateCategoryResultLabel() {
    const label = document.getElementById("categoryResultLabel");
    const category = document.getElementById("marketCategory").value;
    label.textContent = category === "all" ? "Showing all artisan products" : "Showing all " + category + " products";
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

  ["marketSearch", "marketCategory", "marketSort"].forEach((id) => {
    document.getElementById(id).addEventListener("input", renderMarketGrid);
  });
  document.getElementById("myCatalogSearch").addEventListener("input", renderMyCatalogGrid);
  document.getElementById("homeSearchBtn").addEventListener("click", () => {
    const query = document.getElementById("homeSearch").value.trim();
    document.getElementById("marketSearch").value = query;
    showPage("marketplace");
    renderMarketGrid();
  });
  document.getElementById("homeSearch").addEventListener("keydown", (event) => {
    if (event.key === "Enter") document.getElementById("homeSearchBtn").click();
  });
  const homeVoiceSearchBtn = document.getElementById("homeVoiceSearchBtn");
  const homeVoiceSearchStatus = document.getElementById("homeVoiceSearchStatus");
  const HomeSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (HomeSpeechRecognition) {
    const homeRecognition = new HomeSpeechRecognition();
    homeRecognition.continuous = false;
    homeRecognition.interimResults = false;
    homeVoiceSearchBtn.addEventListener("click", () => {
      homeRecognition.lang = { en: "en-IN", hi: "hi-IN", bn: "bn-IN", ta: "ta-IN", te: "te-IN", mr: "mr-IN", kn: "kn-IN", gu: "gu-IN" }[state.lang] || "en-IN";
      homeVoiceSearchBtn.classList.add("is-listening");
      homeVoiceSearchStatus.textContent = "Listening...";
      homeRecognition.start();
    });
    homeRecognition.addEventListener("result", (event) => {
      document.getElementById("homeSearch").value = event.results[0][0].transcript;
      document.getElementById("homeSearchBtn").click();
    });
    homeRecognition.addEventListener("error", (event) => {
      homeVoiceSearchStatus.textContent = event.error === "not-allowed" ? "Microphone permission is required." : "Voice search could not be completed.";
    });
    homeRecognition.addEventListener("end", () => {
      homeVoiceSearchBtn.classList.remove("is-listening");
      homeVoiceSearchStatus.textContent = "";
    });
  } else {
    homeVoiceSearchBtn.disabled = true;
    homeVoiceSearchBtn.title = "Voice search is not supported in this browser";
  }

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
          '<div class="detail-gallery-main"><img src="' + getProductImage(p) + '" alt="' + name + '"></div>' +
          '<div class="detail-thumbs"><span>' + p.icon + "</span><span>🧵</span><span>📦</span></div>" +
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


    document.getElementById("addToCartBtn").addEventListener("click", (event) => {
      event.stopPropagation();
      addToCart(p);
    });
    document.getElementById("buyNowBtn").addEventListener("click", (event) => {
      event.stopPropagation();
      state.cart = [{
        id: p.id,
        name: p.name.en,
        price: p.price,
        icon: p.icon,
        image_url: getProductImage(p),
        quantity: 1
      }];
      saveCart();
      showPage("cart");
      document.getElementById("buyerName").focus();
    });
  }

  function saveCart() {
    localStorage.setItem("artisanai_cart", JSON.stringify(state.cart));
    document.getElementById("cartCount").textContent = state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  function addToCart(product, showMessage) {
    const existing = state.cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1;
    else state.cart.push({ id: product.id, name: product.name.en, price: product.price, icon: product.icon, image_url: getProductImage(product), quantity: 1 });
    saveCart();
    if (showMessage !== false) {
      const button = document.getElementById("addToCartBtn");
      button.textContent = state.lang === "hi" ? "कार्ट में जोड़ा गया" : "Added to cart";
      setTimeout(() => renderProductDetail(product.id), 900);
    }
  }

  function renderCart() {
    const items = document.getElementById("cartItems");
    const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("cartTotal").textContent = "₹" + total.toLocaleString("en-IN");
    items.innerHTML = state.cart.length ? '<h2>' + (state.lang === "hi" ? "आपके उत्पाद" : "Your products") + "</h2>" + state.cart.map((item) =>
      '<div class="cart-item"><span class="cart-item-icon">' + (item.image_url ? '<img src="' + item.image_url + '" alt="' + item.name + '">' : item.icon) + '</span><div><strong>' + item.name + '</strong><span>₹' + item.price.toLocaleString("en-IN") + ' × ' + item.quantity + '</span></div><button class="mini-btn" type="button" data-remove-cart="' + item.id + '">×</button></div>'
    ).join("") : '<div class="empty-state">' + (state.lang === "hi" ? "आपका कार्ट खाली है।" : "Your cart is empty.") + '</div>';
    document.querySelector("#checkoutForm button[type=submit]").disabled = !state.cart.length;
  }

  document.getElementById("checkoutForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("checkoutStatus");
    status.textContent = "Placing order...";
    try {
      const response = await fetch(`${API_URL}/api/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name: document.getElementById("buyerName").value.trim(), phone: document.getElementById("buyerPhone").value.trim(), address: document.getElementById("buyerAddress").value.trim(), items: state.cart
      }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not place order");
      state.orders.unshift({
        id: data.order.id,
        status: data.order.status || "New",
        createdAt: new Date().toISOString(),
        total: data.order.amount,
        items: state.cart.map((item) => ({ ...item }))
      });
      localStorage.setItem("artisanai_orders", JSON.stringify(state.orders));
      state.cart = [];
      saveCart();
      event.target.reset();
      status.textContent = `Order ${data.order.id} placed successfully.`;
      renderCart();
    } catch (error) { status.textContent = error.message; }
  });

  function renderOrders() {
    const history = document.getElementById("orderHistory");
    if (!state.orders.length) {
      history.innerHTML = '<div class="empty-state"><p>' + (state.lang === "hi" ? "अभी तक कोई ऑर्डर नहीं है।" : "You have not placed any orders yet.") + '</p><button class="btn btn-primary" data-target="marketplace">' + (state.lang === "hi" ? "खरीदारी शुरू करें" : "Start shopping") + "</button></div>";
      return;
    }
    history.innerHTML = state.orders.map((order) =>
      '<article class="order-card"><div class="order-card-head"><div><strong>' + order.id + '</strong><span>' + new Date(order.createdAt).toLocaleDateString("en-IN") + '</span></div><b>' + (order.status || "New") + '</b></div><div class="order-products">' +
      order.items.map((item) => '<div class="order-product"><span class="order-product-image">' + (item.image_url ? '<img src="' + item.image_url + '" alt="' + item.name + '">' : item.icon) + '</span><div><strong>' + item.name + '</strong><span>₹' + Number(item.price).toLocaleString("en-IN") + ' × ' + item.quantity + '</span></div></div>').join("") +
      '</div><div class="order-total"><span>' + (state.lang === "hi" ? "कुल" : "Total") + '</span><strong>₹' + Number(order.total).toLocaleString("en-IN") + '</strong></div></article>'
    ).join("");
  }

  document.body.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-cart]");
    if (!removeButton) return;
    state.cart = state.cart.filter((item) => item.id !== Number(removeButton.dataset.removeCart));
    saveCart();
    renderCart();
  });

  document.body.addEventListener("click", (e) => {
    const viewBtn = e.target.closest("[data-view-product]");
    const card = e.target.closest("[data-product-id]");
    const id = viewBtn ? parseInt(viewBtn.dataset.viewProduct, 10)
             : card ? parseInt(card.dataset.productId, 10)
             : null;
    if (id) {
      state.currentProductId = id;
      showPage("product-details-" + id);
    }
  });

  /* ---------------------------------------------------------
     12. INIT
     --------------------------------------------------------- */
  async function init() {
    applyLanguage(state.lang);
    saveCart();

    const startId = location.hash.replace("#", "") || "landing";
    showPage(startId, { skipHash: true });

    const backendProducts = await loadProductsFromBackend();

    if (backendProducts.length > 0) {
      const backendIds = new Set(backendProducts.map((product) => product.id));
      PRODUCTS = backendProducts.concat(PRODUCTS.filter((product) => !backendIds.has(product.id)));
    }

    renderMarketGrid();
    renderMyCatalogGrid();
    renderDashboardRecent();
    if (state.currentProductId) renderProductDetail(state.currentProductId);
}

  document.addEventListener("DOMContentLoaded", init);

})();  