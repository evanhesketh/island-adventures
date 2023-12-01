export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/availability",
    "/location",
    "/photos",
    "/rates",
    "/rental-agreement",
    "/rental-guide",
    "/reviews",
    "/contact",
    "/admin"
  ],
};


// import { getToken } from "next-auth/jwt";
// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   callbacks: {
//     async authorized({ token, req }) {
//       const session = await getToken({
//         req,
//         secret: process.env.NEXTAUTH_SECRET,
//         cookieName:
//           process.env.NODE_ENV === "production"
//             ? "__Secure-next-auth.session-token"
//             : "next-auth.session-token",
//       });
//       const pathname = req.nextUrl.pathname;
//       const isAuth = !!session;

//       console.log("session=", session)
//       console.log("token=", token);
//       console.log("pathname=", pathname);
//       console.log("isAuth=", isAuth);

//       const protectedRoutes = [
//         "/availability",
//         "/location",
//         "/photos",
//         "/rates",
//         "/rental-agreement",
//         "/rental-guide",
//         "/reviews",
//         "/contact",
//         "/admin",
//       ];

//       if (!isAuth && protectedRoutes.some((route) => pathname === route)) {
//         return false;
//       }
//       return true;
//     },
//   },
// });