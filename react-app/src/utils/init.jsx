export const INITUSER =
  import.meta.env.MODE === "development"
    ? {
        username: "admin",
        email: "admin@admin.com",
        password: "admin123",
      }
    : { username: "", email: "", password: "" }
