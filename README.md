# Aurora Storefront

Welcome to Aurora Storefront – a minimal Nuxt-based product storefront project. This project allows users to browse a menu of products and manage their shopping cart, while admins can easily add, update, and delete products. With integrated image management through Cloudinary, every product's image is handled securely from upload to deletion.


## Table of Contents

- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Production](#production)
- [Firebase Configuration](#firebase-configuration)
- [Cloudinary Integration](#cloudinary-integration)
- [Google Analytics Configuration](#google-analytics-configuration)
- [Themes](#themes)
- [Admin Panel](#admin-panel)


## Setup & Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Phinart98/Cuisine-Storefront.git
   ```

2. **Navigate to the project directory:**
   ```bash
    cd Cuisine-Storefront
```

3. **Install dependencies:**
Choose one of the following package managers:

npm:
```bash
npm install
```

pnpm:
```bash
pnpm install
```

yarn:
```bash
yarn install
```

bun:
 ```bash
bun install
```

## Environment Variables
Create a .env file in the project root with the following content. Replace placeholder values with your actual credentials:
```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=your_database_url
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_PREFIX=${STORE_PREFIX}

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
CLOUDINARY_UPLOAD_PRESET=your_preset
CLOUDINARY_STORE_FOLDER=${STORE_PREFIX}

# ---- We change the following for every store deployment ---- #
# Google Analytics
GOOGLE_ANALYTICS_ID=your_gtag_id

# Store Configuration
STORE_NAME=your_store_name
STORE_THEME=default
STORE_PREFIX=aurora
STORE_LOGO_URL=your_logo_url
STORE_FAVICON_URL=your_favicon_url

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

## Development
To run the development server:
```bash
npm run dev
```

Then visit http://localhost:3000 in your browser.

## Production
Build the Project
To generate a production build:
```bash
npm run build
```

## Firebase Configuration
This project is designed to make it easy to have multiple free deployments on a free platform like Vercel. Each store deployment requires its own Firebase project configuration. Set up your Firebase project and add the configuration values to your environment variables:

1. Create a new Firebase project in the Firebase Console
2. Enable Realtime Database
3. Get your project configuration from Project Settings
4. Add all Firebase configuration values to your environment variables

The project uses environment variables for complete Firebase configuration, making it secure and flexible for multiple deployments.


## Preview the Production Build
To preview your production build locally:
```bash
npm run preview
```

## Cloudinary Integration
This project integrates with Cloudinary to handle product images. The key points are:

Uploading: When a new product is added or its image is updated, the image is uploaded to Cloudinary using an unsigned upload preset.
Updating: Before updating a product's image, the existing image (if any) is deleted using a secure API call.
Deleting: When deleting a product, its associated image is removed from Cloudinary using a custom API endpoint (/api/deleteImage) that generates a secure signature.
Consult the Nuxt Cloudinary documentation for further details.

## Analytics Configuration
Each store deployment can track its analytics independently:

1. Create a Google Analytics 4 property
2. Get your Measurement ID (starts with G-)
3. Add it to your environment variables as GOOGLE_ANALYTICS_ID

The analytics will automatically track page views and events for your specific store deployment, giving you isolated data for each store instance.

## Themes
The project supports multiple themes (default, fashion, electronics, luxury, dark, nature). Adjust the global theme in app.vue using the useTheme composable:

## Themes
The project supports multiple themes (default, fashion, electronics, luxury, dark, nature). Each store deployment can have its own theme set through environment variables:

```bash
STORE_THEME=default  # Options: default, fashion, electronics, luxury, dark, nature
```

Themes are defined in assets/css/themes.css and control key color variables throughout the app. Free free to  customize and extend the themes as needed.

## Admin Panel
Access the admin panel at /admin:

Admin Login: You can log in using the credentials specified in the .env file.
CRUD Operations: Admins can add, update, and delete products. When products are deleted or updated (with a new image), the corresponding images are handled on Cloudinary automatically.
Security: A middleware (middleware/admin.js) and the AdminLogin.vue component are used to control access.


Happy coding and enjoy building with Aurora Storefront!
