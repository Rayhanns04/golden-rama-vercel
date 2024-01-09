import "../styles/globals.scss";
import { ChakraProvider } from "@chakra-ui/react";
import "swiper/css/bundle";
import Head from "next/head";
import { Fonts, theme } from "../src/theme";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store, persistor } from "../src/state";
import { PersistGate } from "redux-persist/integration/react";
import CSSReset from "../src/components/css-reset";
// import "react-calendar/dist/Calendar.css";
import "nextjs-breadcrumbs/dist/index.css";
import TagManager from "react-gtm-module";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import ErrorBoundary from "../src/components/error-boundary";
import _ from "lodash";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    TagManager.initialize({ gtmId: "GTM-M35329D" });
  }, []);
  const meta = pageProps.meta;
  const title =
    (meta?.title ? `${meta?.title} | ` : "") + "Golden Rama Tours and Travel";

  return (
    <>
      <Head>
        <title>{title}</title>
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        {/* <!-- Primary Meta Tags --> */}
        <meta name="title" content={title} />
        <meta
          name="description"
          content={
            _.escape(meta?.description) ||
            "Golden Rama Tours & Travel adalah travel agent terdepan di Indonesia yang telah berdiri sejak 1971. Dengan kantor - kantor cabang yang tersebar di Indonesia dan situs goldenrama.com, kami hadir untuk menjadi pintu gerbang Anda menuju destinasi yang luar biasa."
          }
        />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://goldenrama.com/" />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={
            _.escape(meta?.description) ||
            "Golden Rama Tours & Travel adalah travel agent terdepan di Indonesia yang telah berdiri sejak 1971. Dengan kantor - kantor cabang yang tersebar di Indonesia dan situs goldenrama.com, kami hadir untuk menjadi pintu gerbang Anda menuju destinasi yang luar biasa."
          }
        />
        <meta
          property="og:image"
          content={
            meta?.image ||
            "https://www.goldenrama.com/data/img/program/gr-homepage-999.png"
          }
        />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://goldenrama.com/" />
        <meta property="twitter:title" content={title} />
        <meta
          property="twitter:description"
          content={
            _.escape(meta?.description) ||
            "Golden Rama Tours & Travel adalah travel agent terdepan di Indonesia yang telah berdiri sejak 1971. Dengan kantor - kantor cabang yang tersebar di Indonesia dan situs goldenrama.com, kami hadir untuk menjadi pintu gerbang Anda menuju destinasi yang luar biasa."
          }
        />
        <meta
          property="twitter:image"
          content={
            meta?.image ||
            "https://www.goldenrama.com/data/img/program/gr-homepage-999.png"
          }
        />
        <meta
          name="keywords"
          content={meta?.keyword || "tour, flight, travel"}
          key="keywords"
        />
        <meta
          name="facebook-domain-verification"
          content="8sf94gjtdxfqwcg7ogupi29o3b01bw"
        />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:3683651,hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        ></script> */}

      </Head>

      <SessionProvider session={pageProps.session}>
        <ChakraProvider theme={theme} resetCSS={false}>
          <Fonts />
          <QueryClientProvider
            client={
              new QueryClient({
                defaultOptions: {
                  queries: {
                    refetchOnWindowFocus: false,
                  },
                },
              })
            }
          >
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <ErrorBoundary>
                  <Component {...pageProps} />
                </ErrorBoundary>
              </PersistGate>
            </Provider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
          <CSSReset />
        </ChakraProvider>
      </SessionProvider>
    </>
  );
}

export default MyApp;
