import { ReactNode } from 'react';

export default async function LocaleLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  return (
    <html lang={params.locale}>
      <body>{props.children}</body>
    </html>
  );
}
