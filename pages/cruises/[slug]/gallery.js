import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { CustomDivider } from "../../../src/components/divider";
import Layout from "../../../src/components/layout";
import { getCruiseDetail } from "../../../src/services/cruise.service";

const CruiseGallery = () => {
  const router = useRouter();
  const { query } = router;
  const cruise = useQuery(["getCruiseDetail", query.slug], async () => {
    return Promise.resolve(getCruiseDetail(query.slug));
  });
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  return (
    <Layout
      type={"nested"}
      metatitle={cruise?.data && `Gallery | ${cruise?.data.title}`}
      pagetitle={"Semua Foto"}
    >
      <Container maxWidth={{ lg: "container.lg", xl: "container.xl" }} px={0}>
        <Box py={"24px"}>
          <Skeleton isLoaded={!cruise.isLoading} minHeight="24px">
            <Text
              color="neutral.text.high"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontFamily="heading"
              fontWeight="semibold"
              lineHeight={1.2}
              pb="2px"
            >
              {cruise?.data?.title}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!cruise.isLoading}>
            <Text fontSize={"xs"}>{cruise.data?.destination}</Text>
          </Skeleton>
        </Box>
        <CustomDivider />
        <Box py={"24px"}>
          <Heading fontSize={"md"}>Semua Foto Cruise</Heading>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            {cruise.data?.pictures?.length ?? 0} Foto Tersedia{" "}
          </Text>
        </Box>
        <SimpleGrid pb={"24px"} gap={"12px"} columns={[1]}>
          {cruise.data?.pictures ? (
            cruise.data?.pictures?.map((item, index) => (
              <Image
                objectFit={"contain"}
                alt={item}
                key={index}
                src={`${BASE_URL}${item.url}`}
                width={360}
                height={240}
              />
            ))
          ) : (
            <>
              {cruise.isError &&
                Array.from({ length: 3 }).map((item, index) => (
                  <Image
                    objectFit={"contain"}
                    alt={item}
                    key={index}
                    src={"https://dummyimage.com/360x240"}
                    width={360}
                    height={240}
                  />
                ))}
            </>
          )}
        </SimpleGrid>
      </Container>
    </Layout>
  );
};

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      data: null,
      meta: {
        title: "Semua Foto",
      },
    },
  };
};

export default CruiseGallery;
