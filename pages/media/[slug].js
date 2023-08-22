import { useEffect } from "react";
import {
  AspectRatio,
  Box,
  Container,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../src/components/layout";
import {
  getAllMedias,
  getMediaDetailBySlug,
  getLatestMediaDetail,
} from "../../src/services/media.service";
import moment from "moment";
import Link from "next/link";
import { ShareItem } from "../../src/components/card";

const MediaDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: media,
    isLoading,
    error,
  } = useQuery(["getMediaDetailBySlug", slug], () =>
    getMediaDetailBySlug(slug)
  );

  useEffect(() => {
    if (error?.code === "NOT_FOUND") {
      const redirectToLatestMedia = async () => {
        const latestMedia = await getLatestMediaDetail();
        router.push(`/media/${latestMedia.slug}`);
      };
      redirectToLatestMedia();
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Layout
      type="nested"
      pagetitle={`${media?.title || "Golden Rama"} - Detail Media`}
      meta={{
        title: media?.metatitle,
        description: media?.metadescription,
        keyword: media?.metakeyword,
      }}
      jsonLD={{
        "@type": "Media",
        headline: media?.title,
        image: [
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${media?.thumbnail.data.attributes.url}`,
        ],
        datePublished: media?.createdAt,
        dateModified: media?.updatedAt,
      }}
    >
      <Container maxW="container.xl" px={0} py="24px">
        <Stack spacing="6px">
          <Skeleton isLoaded={!isLoading}>
            <Text
              as="h1"
              color="neutral.text.low"
              fontWeight="thin"
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
            >
              {moment(media?.createdAt).format("DD MMMM YYYY, HH:mm")} WIB
            </Text>
            <Text
              as="h1"
              color="neutral.text.low"
              fontWeight="thin"
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
            >
              {media?.author || "Golden Rama Author"}
            </Text>
          </Skeleton>
        </Stack>
        <AspectRatio
          ratio={414 / 275}
          mx={{ base: "-24px", lg: 0 }}
          borderRadius={{ base: 0, lg: "12px" }}
          my="24px"
          overflow="clip"
        >
          <Skeleton isLoaded={!isLoading}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${media?.thumbnail.data.attributes.url}`}
              alt="photo"
              layout="fill"
              objectFit="cover"
            />
          </Skeleton>
        </AspectRatio>
        <SkeletonText isLoaded={!isLoading} noOfLines={10}>
          <Box dangerouslySetInnerHTML={{ __html: media?.description }} />
          <Box my={5}>
            <Text
              fontSize={20}
              color="neutral.text.high"
              fontFamily="heading"
              fontWeight="bold"
              mb="10px"
            >
              Tag Terkait
            </Text>
            <Text
              as="h1"
              color="neutral.text.low"
              fontWeight="thin"
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              mx="5px"
            >
              {media?.tags?.data?.length > 0 &&
                media?.tags?.data?.map((tag, index) => {
                  return (
                    <Text
                      key={index}
                      border="1px solid"
                      borderRadius="12px"
                      px="8px"
                      py="2px"
                      as="span"
                      fontSize="sm"
                      color="primary.500"
                      mr="10px"
                    >
                      {tag.attributes.name}
                    </Text>
                  );
                })}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize={20}
              color="neutral.text.high"
              fontFamily="heading"
              fontWeight="bold"
              mt="20px"
              mb="10px"
            >
              Bagikan Berita
            </Text>
            <Text
              as="h1"
              color="neutral.text.low"
              fontWeight="thin"
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              mx="5px"
            >
              <Skeleton isLoaded={!isLoading}>
                <ShareItem path={`/media/${slug}`} />
              </Skeleton>
            </Text>
          </Box>
        </SkeletonText>
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const medias = await getAllMedias();
  const paths = medias.map((media) => ({
    params: { slug: media.attributes.slug },
  }));
  return { paths, fallback: true };
};

export const getStaticProps = async ({ params }) => {
  const media = await getMediaDetailBySlug(params.slug);
  return {
    props: {
      meta: {
        title: media?.metatitle,
        description: media?.metadescription,
        keyword: media?.metakeyword,
        image: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${media?.thumbnail.data.attributes.url}`,
      },
    },
    revalidate: 10,
  };
};

export default MediaDetail;
