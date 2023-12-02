import { useEffect } from "react";
import {
  Box,
  Container,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../src/components/layout";
import { getAllArticlesByType } from "../../src/services/article.service";
import {
  getArticlePromoDetailBySlug,
  getLatestArticlePromoDetail,
} from "../../src/services/promo.service";

const ArticleDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  const {
    data: article,
    isLoading,
    error,
  } = useQuery(["getArticlePromoDetailBySlug", slug], () =>
    getArticlePromoDetailBySlug(slug)
  );

  useEffect(() => {
    if (error?.code === "NOT_FOUND") {
      const redirectToLatestArticlePromo = async () => {
        const latestArticlePromo = await getLatestArticlePromoDetail();
        router.push(`/promo-detail/${latestArticlePromo.slug}`);
      };
      redirectToLatestArticlePromo();
    }
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Layout
      type="nested"
      pagetitle={article?.title || "Detail Promo"}
      meta={{
        title: article?.metatitle,
        description: article?.metadescription,
        keyword: article?.metakeyword,
      }}
    >
      <Container maxW="container.xl" px={0} py="24px">
        <SkeletonText isLoaded={!isLoading} noOfLines={10}>
          <Box dangerouslySetInnerHTML={{ __html: article?.description }} />
        </SkeletonText>
      </Container>
    </Layout>
  );
};

// export const getStaticPaths = async () => {
//   const promos = await getAllArticlesByType("promo");
//   const paths = promos.map((promo) => ({
//     params: { slug: promo.attributes.slug },
//   }));
//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps = async (ctx) => {
//   const { slug } = ctx.params;
//   const article = await getArticlePromoDetailBySlug(slug);
//   return {
//     props: {
//       meta: {
//         title: article?.title,
//         description: article?.description,
//       },
//     },
//     revalidate: 10,
//   };
// };

export const getServerSideProps = async (ctx) => {
  try {
    const { slug } = ctx.params;
    const article = await getArticlePromoDetailBySlug(slug);

    return {
      props: {
        meta: {
          title: article?.title,
          description: article?.description,
        },
      },
    };
  } catch (error) {
    console.error(error);
    // Handle errors as needed
    return {
      notFound: true,
    };
  }
};


export default ArticleDetail;
