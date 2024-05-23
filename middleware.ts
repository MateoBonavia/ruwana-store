import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/cart(/.*)?", // Protege el carrito y todas las subrutas del carrito
  "/api/trpc(/.*)?", // Protege las rutas de API que quieras proteger
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// const isProtectedRoute = createRouteMatcher([
//   "/((?!api/products).*)",
//   "/((?!api/collections).*)",
//   "/(.*)",
// ]);
