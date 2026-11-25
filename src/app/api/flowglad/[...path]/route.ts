// /api/flowglad/[...path]/route.ts
// The @flowglad/nextjs package is no longer published on npm, so the live
// billing proxy is disabled. The client (src/lib/flowglad.ts) falls back to
// its built-in simulation when this route is unavailable.
import { NextResponse } from 'next/server';

const unavailable = () =>
  NextResponse.json(
    { error: 'FlowGlad billing unavailable; running in demo simulation mode' },
    { status: 503 }
  );

export { unavailable as GET, unavailable as POST };
