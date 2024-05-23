import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/((?!$|_next|favicon.ico).*)"]);

// const isProtectedRoute = createRouteMatcher([
//   "/((?!api/products).*)",
//   "/((?!api/collections).*)",
//   "/(.*)",
// ]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
