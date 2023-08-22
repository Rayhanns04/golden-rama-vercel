import { useEffect } from "react";
import {
  AspectRatio,
  Box,
  Button,
  Container,
  HStack,
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
  getAllArticlesByType,
  getArticleDetailBySlug,
  getLatestArticleDetail,
} from "../../src/services/article.service";
import moment from "moment";
import Link from "next/link";
import { ShareItem } from "../../src/components/card";

const ArticleDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: article,
    isLoading,
    error,
  } = useQuery(["getArticleDetailBySlug", slug], () =>
    getArticleDetailBySlug(slug)
  );

  useEffect(() => {
    if (error?.code === "NOT_FOUND") {
      const redirectToLatestArticle = async () => {
        const latestArticle = await getLatestArticleDetail();
        router.push(`/article/${latestArticle.slug}`);
      };
      redirectToLatestArticle();
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps
  console.log(article);

  const handleShare = () => {
    navigator.canShare &&
      navigator.share &&
      navigator
        .share({ url, title, text })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
  };
  return (
    <Layout
      type="nested"
      pagetitle={`${article?.title || "Golden Rama"} - Detail Artikel`}
      meta={{
        title: article?.metatitle,
        description: article?.metadescription,
        keyword: article?.metakeyword,
      }}
      jsonLD={{
        "@type": "Article",
        headline: article?.title,
        image: [
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${article?.thumbnail.data.attributes.url}`,
        ],
        datePublished: article?.createdAt,
        dateModified: article?.updatedAt,
      }}
    >
      <Container maxW="container.xl" px={0} py="24px">
        <Stack pb="24px">
          <Skeleton isLoaded={!isLoading}>
            {/* <Text
              as="h1"
              color="neutral.text.high"
              fontFamily="heading"
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              fontWeight="bold"
            >
              {article?.title}
            </Text> */}
          </Skeleton>
          <Skeleton isLoaded={!isLoading}>
            <Text
              as="h1"
              color="neutral.text.low"
              fontWeight="thin"
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
            >
              {moment(article?.createdAt).format("DD MMMM YYYY, HH:mm")} WIB
            </Text>
            <Text
              as="h1"
              color="neutral.text.low"
              fontWeight="thin"
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
            >
              {article?.author || "Golden Rama Author"}
            </Text>
          </Skeleton>
        </Stack>
        <AspectRatio
          ratio={414 / 275}
          mx={{ base: "-24px", lg: 0 }}
          borderRadius={{ base: 0, lg: "12px" }}
          mb="24px"
          overflow="clip"
        >
          <Skeleton isLoaded={!isLoading}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/${article?.thumbnail.data.attributes.url}`}
              alt="photo"
              layout="fill"
              objectFit="cover"
            />
          </Skeleton>
        </AspectRatio>
        <SkeletonText isLoaded={!isLoading} noOfLines={10}>
          <Box dangerouslySetInnerHTML={{ __html: article?.description }} />
          {/* create a section for tags */}
          <Box>
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
              {article?.tags?.data?.length > 0 &&
                article?.tags?.data?.map((tag, index) => {
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
          {/* section for share */}
          {/* <Box>
            <Text
              as="h1"
              color="neutral.text.high"
              fontFamily="heading"
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
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
                <ShareItem path={`/article/${slug}`} />
              </Skeleton>
            </Text>
          </Box> */}
        </SkeletonText>
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const articles = await getAllArticlesByType("article");
  const paths = articles.map((article) => ({
    params: { slug: article.attributes.slug },
  }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const article = await getArticleDetailBySlug(slug);
  return {
    props: {
      meta: {
        title: article?.metatitle,
        description: article?.metadescription,
        keyword: article?.metakeyword,
        image: `${process.env.NEXT_PUBLIC_BACKEND_URL}/${article?.thumbnail.data.attributes.url}`,
      },
    },
    revalidate: 10,
  };
};

export default ArticleDetail;
