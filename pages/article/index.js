import {
  AspectRatio,
  Box,
  Center,
  LinkBox,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import NextLink from "next/link";
import Layout from "../../src/components/layout";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { format } from "date-fns";
import { getArticles } from "../../src/services/article.service";
import { useInfiniteQuery } from "@tanstack/react-query";

const Article = ({ meta }) => {
  const { isFetchingNextPage, fetchNextPage, hasNextPage, isLoading, data } =
    useInfiniteQuery(
      ["getMedias"],
      ({ pageParam = 1 }) => getArticles({ pageParam: pageParam }),
      {
        getNextPageParam: (lastpage) => {
          try {
            if (lastpage) {
              if (lastpage.meta.pagination.pageCount === 0) return undefined;
              if (
                lastpage.meta.pagination.page !==
                lastpage.meta.pagination.pageCount
              ) {
                return lastpage.meta.pagination.page + 1;
              } else return undefined;
            }
          } catch (error) {
            console.error(error);
            return undefined;
          }
        },
      }
    );
  return (
    <Layout type="nested" pagetitle="Artikel" meta={meta}>
      <Box py="24px">
        <Text color="neutral.text.high" fontFamily="heading" fontWeight="bold">
          Golden Stories
        </Text>
        <Text color="neutral.text.medium" fontSize="sm">
          Mari melihat lihat cerita menarik mengenai travel
        </Text>
      </Box>
      <Box bg="brand.blue.100" mx="-24px" px="24px" py="24px">
        {!isLoading ? (
          <SimpleGrid columns={[1, 1, 2, 3]} gap="24px">
            {data.pages.map((group, i) =>
              group.data.map((item, i) => (
                <NextLink key={i} href={`/article/${item.attributes.slug}`}>
                  <a rel="canonical">
                    <LinkBox borderRadius="12px" bg="white" overflow="clip">
                      <AspectRatio position="relative" ratio={366 / 148}>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item?.attributes.thumbnail.data?.attributes.url}`}
                          alt="unsplash"
                          layout="fill"
                        />
                      </AspectRatio>
                      <Box p="16px">
                        <Text color="neutral.text.high" fontWeight="bold">
                          {item.attributes.title}
                        </Text>
                      </Box>
                    </LinkBox>
                  </a>
                </NextLink>
              ))
            )}
          </SimpleGrid>
        ) : (
          <SimpleGrid columns={[1, 1, 2, 3]} gap="24px">
            {Array.from({ length: 3 }).map((_, i) => (
              // <NextLink key={i} href={`/article/${i}`}>
              <a key={i}>
                <LinkBox borderRadius="12px" bg="white" overflow="clip">
                  <AspectRatio position="relative" ratio={366 / 148}>
                    <Skeleton isLoaded={true}>
                      {/* <Image
                          src="/png/unsplash_mSESwdMZr-A.png"
                          alt="unsplash"
                          layout="fill"
                        /> */}
                    </Skeleton>
                  </AspectRatio>
                  <Box p="16px">
                    <SkeletonText
                      isLoaded={true}
                      noOfLines={3}
                      spacing={2}
                      minH="1rem"
                    >
                      <Text fontSize="xs">
                        {/* {format(new Date(), "dd MMMM yyyy, HH:mm")} */}
                      </Text>
                      <Text color="neutral.text.high" fontWeight="bold">
                        {/* Pernah Dijadikan Lokasi Syuting Drama Korea,
                        Tempat-tempat Ini Kini Jadi Destinasi Wisata */}
                      </Text>
                    </SkeletonText>
                  </Box>
                </LinkBox>
              </a>
              // </NextLink>
            ))}
          </SimpleGrid>
        )}
        <Center>
          <CustomOrangeFullWidthButton
            maxW="container.sm"
            hidden={!hasNextPage}
            onClick={fetchNextPage}
            isLoading={isFetchingNextPage}
          >
            Lihat Lebih Banyak
          </CustomOrangeFullWidthButton>
        </Center>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Artikel",
      },
    },
  };
};

export default Article;
