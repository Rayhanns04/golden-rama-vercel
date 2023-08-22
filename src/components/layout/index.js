import { Container, useToast } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect } from "react";
import Footer from "../footer";
import Header from "../header";
import AltHeader from "../altheader";
import BottomNavbar from "../bottom-navbar";
import NestedHeader from "../nestedheader";
import Script from "next/script";
import BgHeader from "../bgheader";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "../../services/account.service";
import { logoutData } from "../../state/auth/auth.slice";
import { signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";

const Layout = ({
  pagetitle,
  pagedescription,
  children,
  nofixedheader = false,
  bgheader,
  bgoption,
  hideBottomBar,
  type = "default",
  meta = {},
  jsonLD = {},
  isHotels,
  isTour,
  ...props
}) => {
  const title =
    (meta?.title || pagetitle ? `${meta?.title || pagetitle} | ` : "") +
    "Golden Rama Tours and Travel";
  const router = useRouter();
  const toast = useToast();
  const dispatch = useDispatch();
  const { jwt, isLoggedIn, user } = useSelector((s) => s.authReducer);
  const profileData = useQuery(["getProfile"], async () => {
    try {
      if (user) {
        const response = await getMe(jwt);
        return response;
      }
    } catch (error) {
      console.log(isLoggedIn, "isLoggedIn");
      if (isLoggedIn) {
        dispatch(logoutData());
        toast({
          title: "Login Expired",
          description: "Ups, Kamu perlu login ulang terlebih dahulu",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
        signOut({ callbackUrl: `/auth?redirect=${router.asPath}` });
        return Promise.reject(error);
      }
    }
  });
  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M35329D');`}
      </Script>
      <Script id="ld" type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          author: [
            {
              "@type": "Organization",
              name: "Golden Rama Tours and Travel",
              url: "https://www.goldenrama.com",
            },
          ],
          ...jsonLD,
        })}
      </Script>
      <Header hidden={type !== "default"} nofixedheader={nofixedheader} />
      <AltHeader
        hidden={type !== "alt"}
        nofixedheader={nofixedheader}
        pagedescription={pagedescription}
        pagetitle={pagetitle}
        bgheader={bgheader}
      />
      <BgHeader
        hidden={type !== "bg"}
        nofixedheader={nofixedheader}
        pagedescription={pagedescription}
        pagetitle={pagetitle}
        bgheader={bgheader}
        bgoption={bgoption}
      />
      <NestedHeader
        {...props}
        hidden={type !== "nested"}
        nofixedheader={nofixedheader}
        pagetitle={pagetitle}
        isHotels={isHotels}
        isTour={isTour}
      />
      <Container bg={"white"} as={"main"} maxW={"full"} px={"24px"}>
        {children ?? ""}
      </Container>
      <Footer />
      <BottomNavbar hide={hideBottomBar} />
      {/* <noscript
        dangerouslySetInnerHTML={{
          __html: (
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-M35329D"
              height="0"
              width="0"
              style="display:none;visibility:hidden"
            ></iframe>
          ),
        }}
      /> */}
    </>
  );
};

export default Layout;
