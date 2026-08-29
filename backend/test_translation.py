import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app import app


def test_supported_languages_translate_common_terms():
    client = app.test_client()

    expected = {
        "hi": "होम",
        "ta": "முகப்பு",
        "te": "హోమ్",
        "ml": "ഹോം",
        "bn": "হোম",
        "gu": "હોમ",
        "mr": "मुख्यपृष्ठ",
        "kn": "ಹೋಮ್",
        "ur": "ہوم",
    }

    for lang, translation in expected.items():
        response = client.post(
            "/api/translate",
            json={"text": "Home", "target_language": lang},
        )
        assert response.status_code == 200, f"Unexpected status for {lang}: {response.data}"
        payload = response.get_json()
        assert payload["translated_text"] == translation, (
            f"Translation for {lang} was {payload['translated_text']!r}, expected {translation!r}"
        )


def test_product_whatsapp_contact_link_is_generated():
    client = app.test_client()
    with client.session_transaction() as session:
        session["artisan_phone"] = "+919876543210"

    create_response = client.post(
        "/api/products",
        json={
            "name": "Brass Bowl",
            "description": "Handcrafted brass bowl",
            "category": "Handcraft",
            "price": 850,
        },
    )
    assert create_response.status_code == 201, create_response.get_data(as_text=True)
    product_id = create_response.get_json()["product"]["id"]

    response = client.get(f"/api/products/{product_id}/whatsapp")
    assert response.status_code == 200, response.get_data(as_text=True)
    payload = response.get_json()
    assert payload["whatsapp_number"] == "919876543210"
    assert payload["message"]
    assert "wa.me" in payload["url"]
