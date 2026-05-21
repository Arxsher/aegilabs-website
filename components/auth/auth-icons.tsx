export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.63 3 8.56 7.16 9.95.53.1.72-.23.72-.51v-1.8c-2.91.64-3.53-1.4-3.53-1.4-.48-1.21-1.17-1.53-1.17-1.53-.95-.65.08-.64.08-.64 1.05.08 1.61 1.08 1.61 1.08.94 1.6 2.46 1.14 3.06.87.1-.68.37-1.14.67-1.4-2.33-.27-4.78-1.17-4.78-5.19 0-1.15.41-2.08 1.08-2.82-.11-.27-.47-1.34.1-2.78 0 0 .88-.28 2.89 1.07A9.94 9.94 0 0 1 12 6.55c.89 0 1.78.12 2.62.35 2-1.35 2.88-1.07 2.88-1.07.58 1.44.22 2.51.11 2.78.67.74 1.08 1.67 1.08 2.82 0 4.03-2.45 4.91-4.79 5.18.38.33.72.97.72 1.96v2.87c0 .28.19.62.73.51A10.51 10.51 0 0 0 22.5 12c0-5.8-4.7-10.5-10.5-10.5z" />
    </svg>
  );
}

export function getClerkErrorMessage(error: unknown) {
  if (typeof error === "object" && error && "errors" in error) {
    const clerkError = error as { errors?: Array<{ longMessage?: string; message?: string }> };
    return clerkError.errors?.[0]?.longMessage ?? clerkError.errors?.[0]?.message ?? "Something went wrong.";
  }

  return error instanceof Error ? error.message : "Something went wrong.";
}
