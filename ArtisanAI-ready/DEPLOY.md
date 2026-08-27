# Publish ArtisanAI

## 1. Upload the project

Create a GitHub repository and upload the complete `ArtisanAI` folder. Do not upload Twilio secrets.

## 2. Deploy on Render

1. Open https://render.com and sign in with GitHub.
2. Choose **New +** > **Blueprint**.
3. Select the repository containing this project.
4. Render reads `render.yaml` and creates the web service.
5. Enter the three Twilio values when Render asks for them.

The service starts with `gunicorn --chdir backend app:app` and serves both the frontend and backend from one URL.

## 3. Share the link

After deployment, click **Open** in Render. Copy the HTTPS URL, such as `https://artisanai-xxxx.onrender.com`, and send that real URL to friends.

## Important

- The `xxxx` in the example is a placeholder. Use the exact URL shown by Render.
- SQLite data on free hosting may be reset when the service is redeployed or restarted. For permanent product data, use a hosted PostgreSQL database or a paid persistent disk.
- Real OTP SMS requires valid Twilio credentials and a Twilio phone number. Trial accounts may require recipient verification.
