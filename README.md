# Aurora Storefront

Welcome to Aurora Storefront – a minimal Nuxt-based product storefront project. This project allows users to browse a menu of products and manage their shopping cart, while admins can easily add, update, and delete products. With integrated image management through Cloudinary, every product's image is handled securely from upload to deletion.

> IMPORTANT NOTICE:  
> **Firebase Configuration Warning:** This project originally included a Firebase configuration that was added quickly for demonstration purposes (merely updating the API key and database URL). In order to use it, you must completely overhaul the Firebase configuration in your `nuxt.config.js` file. Do not simply update the API key and database URL—you need to replace the entire Firebase configuration with the one Firebase gives you.


## Table of Contents

- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Production](#production)
- [Cloudinary Integration](#cloudinary-integration)
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
```
FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
FIREBASE_DATABASE_URL=YOUR_FIREBASE_DATABASE_URL
CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET
CLOUDINARY_UPLOAD_PRESET=YOUR_CLOUDINARY_UPLOAD_PRESET
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

## Themes
The project supports multiple themes (default, fashion, electronics, luxury, dark, nature). Adjust the global theme in app.vue using the useTheme composable:

```vue
<script setup>
import { useTheme } from '~/composables/useTheme'
const { theme, setTheme } = useTheme()
// Change theme: 'default', 'fashion', 'electronics', 'luxury', 'dark', 'nature'
setTheme('default')
</script>
```

Themes are defined in assets/css/themes.css and control key color variables throughout the app.

## Admin Panel
Access the admin panel at /admin:

Admin Login: You can log in using the credentials specified in the .env file.
CRUD Operations: Admins can add, update, and delete products. When products are deleted or updated (with a new image), the corresponding images are handled on Cloudinary automatically.
Security: A middleware (middleware/admin.js) and the AdminLogin.vue component are used to control access.


Happy coding and enjoy building with Aurora Storefront!
