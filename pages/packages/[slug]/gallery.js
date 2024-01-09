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
import { getPackageDetail } from "../../../src/services/package.service";

const PackagesGallery = () => {
  const router = useRouter();
  const { query } = router;
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const packages = useQuery(["getPackageDetail", query.slug], async () => {
    return Promise.resolve(getPackageDetail(query.slug));
  });
  return (
    <Layout type={"nested"} pagetitle={packages?.data?.title || "Semua Foto"}>
      <Container maxWidth={{ lg: "container.lg", xl: "container.xl" }} px={0}>
        <Box py={"24px"}>
          <Skeleton isLoaded={!packages.isLoading} minHeight="24px">
            <Text
              color="neutral.text.high"
              fontSize={{ base: "2xl", md: "3xl" }}
              fontFamily="heading"
              fontWeight="semibold"
              lineHeight={1.2}
              pb="2px"
            >
              {packages?.data?.title}
            </Text>
          </Skeleton>
          <Skeleton isLoaded={!packages.isLoading}>
            <Text fontSize={"xs"}>{packages.data?.destination}</Text>
          </Skeleton>
        </Box>
        <CustomDivider />
        <Box py={"24px"}>
          <Heading fontSize={"md"}>Semua Foto Package</Heading>
          <Text fontSize={{ base: "xs", md: "sm" }}>
            {packages.data?.pictures?.length ?? 0} Foto Tersedia{" "}
          </Text>
        </Box>
        <SimpleGrid pb={"24px"} gap={"12px"} columns={[1]}>
          {packages.data?.pictures ? (
            packages.data?.pictures?.map((item, index) => (
              <Image
                objectFit={"contain"}
                alt={item.title}
                key={index}
                src={`${BASE_URL}${item.url}`}
                width={360}
                height={240}
              />
            ))
          ) : (
            <>
              {Array.from({ length: 8 }).map((item, index) => (
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

export default PackagesGallery;

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
