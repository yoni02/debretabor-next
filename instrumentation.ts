export async function register() {
  // Skip the Edge runtime — DB operations require Node.js
  if (process.env.NEXT_RUNTIME === 'edge') return;

  try {
    const { seedSundayLiturgies } = await import('./lib/seed-sundays');
    await seedSundayLiturgies();
  } catch (err) {
    console.error('[instrumentation] seed failed:', err);
  }
}
