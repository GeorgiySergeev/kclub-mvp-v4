export default async function Page(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  return (
    <main>
      <h1>Product Core Booted</h1>
      <p>Locale: {params.locale}</p>
    </main>
  );
}
