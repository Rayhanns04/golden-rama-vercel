import { Box, Flex, HStack, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Formik, Form } from "formik";
import Layout from "../../src/components/layout";
import { FormVisa } from "../../src/components/form";
import ChevronLeftDarkIcon from "../../public/svg/icons/chevron-left-dark.svg";

const Visa = ({ meta }) => {
  const router = useRouter();
  const initialValues = {
    destination: "",
  };

  const handleSubmit = (values) => {
    return new Promise(async (resolve) => {
      await new Promise((r) => setTimeout(r, 1000));
      router.push(`/visa/${values.destination}`);
      resolve();
    });
  };

  const menus = [
    {
      title: "Negara Bebas Visa",
      type: "free",
    },
    {
      title: "Visa Saat Kedatangan",
      type: "arrival",
    },
    {
      title:
        "Untuk Negara Yang Tidak Tercantum Didalam Daftar Diatas Harap Hubungi via GRETA",
      type: "not-processed",
    },
  ];

  return (
    <Layout
      pagetitle={"Dokumen & Visa"}
      type={"alt"}
      bgheader={"/svg/visa/header-bg.svg"}
      meta={meta}
      hideBottomBar
    >
      <Flex flexDir="column" gap="24px">
        <Box
          w="full"
          mx="auto"
          maxW={{ base: "container.lg", lg: "container.xl" }}
          py="24px"
        >
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            <Form>
              <FormVisa />
            </Form>
          </Formik>
        </Box>
        <Box mx="-24px" bg="brand.blue.100" h="8px" />
        <Box
          w="full"
          mx="auto"
          maxW={{ base: "container.lg", lg: "container.xl" }}
        >
          <Stack py="24px" spacing="8px">
            <Text
              color="neutral.text.high"
              fontFamily="heading"
              fontWeight="bold"
            >
              Tentang Passport dan Visa
            </Text>
            <Text fontSize="sm">
              Lihat beberapa pertanyaan yang sering ditanyakan orang lain untuk
              membantumu.
            </Text>
          </Stack>
          <Stack spacing={0}>
            {menus.map((menu, index) => (
              <HStack
                key={index}
                justifyContent="space-between"
                cursor="pointer"
                p="24px"
                mx={{ base: "-24px!", lg: 0 }}
                rounded={{ lg: "md" }}
                color="brand.blue.400"
                transition="all 0.2s"
                onClick={() => {
                  if (menu.type === "not-processed") {
                    //redirect blank page to whatsapp
                    window.open(
                      "https://api.whatsapp.com/send/?phone=6281511221133&text&type=phone_number&app_absent=0",
                      "_blank"
                    );
                  } else {
                    router.push({
                      pathname: "/visa/info",
                      query: { type: menu.type },
                    });
                  }
                }}
                _hover={{ bg: "brand.blue.100" }}
              >
                <Text fontFamily="heading" fontWeight="bold">
                  {menu.title}
                </Text>
                <ChevronLeftDarkIcon />
              </HStack>
            ))}
          </Stack>
        </Box>
      </Flex>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Dokumen & Visa",
      },
    },
  };
};

export default Visa;
