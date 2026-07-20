/**
 * Fixed ambient backdrop for the public site: drifting aurora blobs + a fine
 * film-grain overlay. Pure CSS animation (transforms/opacity only), so it stays
 * a Server Component and honours reduced-motion via globals. Rendered once in
 * the root layout behind all content.
 */
export function AuroraBackground() {
  return (
    <>
      <div aria-hidden className="aurora">
        <div
          className="aurora-blob animate-aurora-1 left-[-10%] top-[-8%] h-[42vw] w-[42vw]"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, var(--color-primary-100), transparent 70%)",
          }}
        />
        <div
          className="aurora-blob animate-aurora-2 right-[-12%] top-[10%] h-[38vw] w-[38vw]"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, var(--color-primary-200), transparent 70%)",
          }}
        />
        <div
          className="aurora-blob animate-aurora-3 bottom-[-15%] left-[25%] h-[40vw] w-[40vw] opacity-40"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--color-primary-500), transparent 70%)",
          }}
        />
      </div>
      <div aria-hidden className="grain" />
    </>
  );
}

export default AuroraBackground;
