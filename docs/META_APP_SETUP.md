# Meta App Setup Guide for WeGoViral

To connect your Instagram account to WeGoViral, you need to create a Meta App and obtain the necessary credentials. Follow these steps:

## 1. Create a Meta App
1. Go to the [Meta for Developers](https://developers.facebook.com/) portal and log in.
2. Click **My Apps** -> **Create App**.
3. Select **Other** -> **Consumer** (or Business if you have a business verification).
4. Give your app a name (e.g., "WeGoViral") and click **Create App**.

## 2. Add Products
1. In the App Dashboard, click **Add Product** in the left sidebar.
2. Add **Instagram Graph API**.
3. Add **Facebook Login**.

## 3. Obtain Credentials
1. Go to **Settings** -> **Basic** in the left sidebar.
2. Copy the **App ID** and **App Secret**.
3. Add these to your `.env` file in the `backend` folder:
   ```env
   FACEBOOK_APP_ID=your_app_id
   FACEBOOK_APP_SECRET=your_app_secret
   ```

## 4. Configure Redirect URI
1. Go to **Facebook Login** -> **Settings**.
2. In the **Valid OAuth Redirect URIs** field, add:
   `http://localhost:3000/settings` (or the URL of your Settings page).
3. Click **Save Changes**.
4. Update your `.env`:
   ```env
   FACEBOOK_REDIRECT_URI=http://localhost:3000/settings
   ```

## 5. Permissions (Important)
During the "Connect Instagram" flow, the following permissions are required:
- `instagram_basic`
- `instagram_manage_messages`
- `instagram_manage_comments`
- `pages_show_list`
- `pages_read_engagement`

> [!NOTE]  
> While in "Development Mode", only users added as Roles (Admins/Testers) in your Meta App can connect their accounts.

## 6. Configure Webhooks (For Real-time Triggers)
1. Go to **Instagram Graph API** -> **Webhooks**.
2. Select **Instagram** from the dropdown.
3. Click **Subscribe to this object**.
4. **Callback URL**: `https://your-domain.ngrok-free.app/api/webhooks/instagram` (Use `ngrok` for local development).
5. **Verify Token**: Choose a secret string and add it to `.env`:
   ```env
   INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_secret_string
   ```
6. Subscribe to `comments` and `mentions` fields.
