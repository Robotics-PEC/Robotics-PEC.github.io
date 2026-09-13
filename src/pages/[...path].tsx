// pages/[...path].tsx
import { GetServerSideProps } from "next";

export default function ProxyPage() {
  // This component never actually renders —
  // getServerSideProps always either redirects or returns notFound.
  return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req, res } = context;
  const pathname = req.url ?? "/";

  const upstreamUrl = `https://robotics-pec.github.io${pathname}`;

  try {
    const upstreamRes = await fetch(upstreamUrl);

    if (upstreamRes.ok) {
      const body = await upstreamRes.text();
      const contentType = upstreamRes.headers.get("content-type") ?? "text/html";
      res.setHeader("content-type", contentType);
      res.write(body);
      res.end();
      return { props: {} };
    }
  } catch (error) {
    // fall through to notFound
  }

  return { notFound: true };
};