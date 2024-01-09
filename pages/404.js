import React from "react";
import { ErrorPage } from "../src/components/card";
import Layout from "../src/components/layout";
import { getProductCategoryList } from "../src/services/product_category.service";

const NotFound = (props) => {
  const { products } = props.data;
  console.log("🚀 ~ file: 404.js:8 ~ NotFound ~ products", products);
  return (
    <Layout>
      <ErrorPage
        products={products}
        errorCode={404}
        errorMessage={"Error Not Found"}
      />
    </Layout>
  );
};

export const getStaticProps = async (ctx) => {
  return {
    props: {
      data: { products: await getProductCategoryList() },
    },
    revalidate: 10,
  };
};

export default NotFound;
