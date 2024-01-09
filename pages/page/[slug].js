import { Box, SkeletonText } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../src/components/layout";
import {
  getAllArticlesByType,
  getArticleDetailBySlug,
} from "../../src/services/article.service";

const CustomPageDetail = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { data: page, isLoading } = useQuery(
    ["getArticleDetailBySlug", slug],
    () => getArticleDetailBySlug(slug)
  );
  return (
    <Layout
      type="nested"
      pagetitle={page?.title}
      meta={{
        title: page?.metatitle,
        description: page?.metadescription,
        keyword: page?.metakeyword,
      }}
    >
      <SkeletonText isLoaded={!isLoading} noOfLines={10}>
        <Box
          minH="67vh"
          dangerouslySetInnerHTML={{ __html: page?.description }}
        />
      </SkeletonText>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const pages = await getAllArticlesByType("page");
  const paths = pages.map((page) => ({
    params: { slug: page.attributes.slug },
  }));
  return { paths, fallback: true };
};

export const getStaticProps = async ({ params }) => {
  const page = await getArticleDetailBySlug(params.slug);
  return {
    props: {
      meta: {
        title: page?.metatitle,
        description: page?.metadescription,
        keyword: page?.metakeyword,
      },
    },
    revalidate: 10,
  };
};

export default CustomPageDetail;
