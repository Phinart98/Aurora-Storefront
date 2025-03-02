export default defineNuxtConfig({
  target: "server",

  head: {
    title: process.env.STORE_NAME,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: process.env.STORE_FAVICON_URL,
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css",
      },
    ],
  },

  runtimeConfig: {
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
      cloudinaryStoreFolder: process.env.CLOUDINARY_STORE_FOLDER,
      storeName: process.env.STORE_NAME,
      logoUrl: process.env.STORE_LOGO_URL,
      faviconUrl: process.env.STORE_FAVICON_URL,
      storePrefix: process.env.STORE_PREFIX,
      storeTheme: process.env.STORE_THEME,
      storePhone: process.env.STORE_PHONE_NUMBER,
    },
  },

  css: [
    "~/assets/css/tailwind.css",
    "~/assets/css/themes.css",
    "bootstrap-icons/font/bootstrap-icons.css",
  ],

  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-vuefire",
    "@nuxtjs/cloudinary",
    "nuxt-gtag",
  ],

  plugins: ["~/plugins/toast.client.ts"],

  vuefire: {
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },

  gtag: {
    id: process.env.GOOGLE_ANALYTICS_ID,
  },

  compatibilityDate: "2025-02-05",
});
