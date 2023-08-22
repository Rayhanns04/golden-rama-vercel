import { useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Grid,
  GridItem,
  HStack,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik, useFormikContext } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getOrderByOrderNumber,
  updateOrder,
} from "../../../src/services/order.service";
import { uploadFiles } from "../../../src/services/file.service";
import Layout from "../../../src/components/layout";
import ListDetail from "../../../src/components/list-detail";
import { CustomFilterButton } from "../../../src/components/button";
import { CustomOrangeFullWidthButton } from "../../../src/components/button";
import { CustomTags } from "../../../src/components/tags";
import DateIcon from "../../../public/svg/icons/date.svg";
import UserMultipleIcon from "../../../public/svg/icons/user-multiple.svg";
import UserPlusIcon from "../../../public/svg/icons/user-plus.svg";
import AirlineIcon from "../../../public/svg/icons/airline-outline.svg";
import ChevronLeftDarkIcon from "../../../public/svg/icons/chevron-left-dark.svg";
import { getPaxFaresName, getCountryName } from "../../../src/helpers";
import { format } from "date-fns";

const UploadOrderDocs = () => {
  const router = useRouter();
  const toast = useToast({
    duration: 3000,
    isClosable: true,
  });
  const { id } = router.query;

  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");

  const { data: order, isLoading } = useQuery(
    ["getOrderByOrderNumber", id],
    () => getOrderByOrderNumber(id)
  );

  const { mutateAsync: uploadFilesMutation } = useMutation(uploadFiles);
  const { mutateAsync: updateOrderMutation } = useMutation(updateOrder, {
    onSuccess: () => {
      toast({
        title: "Upload berhasil",
        status: "success",
      });
      router.push(`/order-histories/${id}`);
    },
    onError: () => {
      toast({
        title: "Upload gagal",
        status: "error",
      });
    },
  });

  const handleSubmit = (values) => {
    return new Promise(async (resolve, reject) => {
      try {
        const responseFiles = await uploadFiles(values.docs);
        const response = await updateOrderMutation({
          id: order.id,
          data: { docs: responseFiles.map((file) => file.id) },
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  const LowerSection = () => {
    const { isSubmitting, values } = useFormikContext();
    const isDisabled = values?.docs?.every((doc) => typeof doc === "string");
    return (
      <Box pt="16px" pb="24px">
        <CustomOrangeFullWidthButton
          disabled={isDisabled}
          isLoading={isSubmitting}
          type="submit"
        >
          Upload Semua Dokumen
        </CustomOrangeFullWidthButton>
      </Box>
    );
  };

  return (
    <Layout
      pagetitle="On Progress Booking"
      metatitle="On Progress Booking"
      type="nested"
    >
      <Formik
        onSubmit={handleSubmit}
        initialValues={{ docs: order?.traveler.map(() => "") || [] }}
        enableReinitialize
      >
        {(props) => (
          <Form>
            <Grid
              templateColumns={{ md: "repeat(3,1fr)" }}
              columnGap="calc(20px + 24px)"
              maxW={{ lg: "container.lg", xl: "container.xl" }}
              mx="auto"
              py={{ md: "24px" }}
            >
              <GridItem colSpan={{ md: 2 }} order={isLargerThan768 ? -1 : 1}>
                <Box py="24px">
                  <Text
                    color="neutral.text.high"
                    fontFamily="heading"
                    fontSize={{ base: "md", md: "lg", lg: "xl" }}
                    fontWeight="bold"
                  >
                    Dokumen Tamu
                  </Text>
                  <Text fontSize={{ base: "sm", md: "md" }}>
                    Pastikan data anda sesuai dan harap upload dokumen untuk
                    semua tamu
                  </Text>
                </Box>
                <Stack spacing={0} mx="-24px" py="24px">
                  {order?.traveler.map((trav, index) => (
                    <ListItemTraveler
                      key={index}
                      traveler={trav}
                      index={index}
                    />
                  ))}
                </Stack>
              </GridItem>
              <GridItem>
                <Box
                  position={{ base: "static", md: "sticky" }}
                  top={24}
                  spacing="16px"
                >
                  <Box
                    bg="brand.blue.100"
                    mx={{ base: "-24px", md: 0 }}
                    px="24px"
                    py="24px"
                    borderRadius={{ md: "12px" }}
                  >
                    <Card card={order?.card} />
                  </Box>
                  {isLargerThan768 && <LowerSection />}
                </Box>
              </GridItem>
            </Grid>
            <Box
              hidden={isLargerThan768}
              position="sticky"
              bottom={0}
              bg="white"
              borderTop="1px solid #e9e9e9"
            >
              <LowerSection />
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

const Card = ({ card }) => {
  return (
    <Box bg="white" borderRadius="12px" px="16px" py="14px">
      <Stack pb="16px" borderBottom="1px dashed #f1f1f1">
        <HStack spacing="8px">
          {card?.tags?.map((tag) => (
            <CustomTags
              key={tag}
              textOverflow="ellipsis"
              overflow="hidden"
              whiteSpace="nowrap"
              fontSize="xs"
            >
              {tag}
            </CustomTags>
          ))}
          <Text flexShrink={0} color="neutral.text.high" fontWeight="bold">
            {card?.title}
          </Text>
        </HStack>
        <Text fontSize="xs">{card?.subtitle}</Text>
      </Stack>
      <Stack pt="16px" spacing="16px">
        <Text color="neutral.text.high" fontSize="sm" fontWeight="bold">
          {card?.name}
        </Text>
        {card?.details.map((detail, index) => (
          <HStack key={index} spacing="6px">
            {detail.type === "date" ? (
              <DateIcon />
            ) : detail.type === "people" ? (
              <UserMultipleIcon />
            ) : (
              <AirlineIcon />
            )}
            <Text fontSize="xs">{detail.text}</Text>
            {detail.tag && (
              <Tag
                color="brand.orange.500"
                bg="brand.orange.100"
                size="sm"
                fontSize="xs"
              >
                {detail.tag}
              </Tag>
            )}
          </HStack>
        ))}
      </Stack>
    </Box>
  );
};

const ListItemTraveler = ({ traveler, index }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <HStack
        onClick={onOpen}
        justifyContent="space-between"
        cursor="pointer"
        p="24px"
        borderBottom="1px solid #F2F2F2"
        borderRadius={{ md: "12px" }}
        transition="background-color 0.2s"
        _hover={{ bg: "gray.100" }}
      >
        <HStack spacing="16px">
          <UserPlusIcon />
          <Box>
            <Text
              color="neutral.text.high"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="bold"
              textTransform="uppercase"
            >
              {traveler.first_name} {traveler.last_name}
            </Text>
            <Text
              color="neutral.text.medium"
              fontSize={{ base: "sm", md: "md" }}
            >
              Dokumen Traveler {getPaxFaresName(traveler.paxType)}
            </Text>
          </Box>
        </HStack>
        <ChevronLeftDarkIcon />
      </HStack>
      <ModalTraveler
        isOpen={isOpen}
        onClose={onClose}
        traveler={traveler}
        index={index}
      />
    </>
  );
};

const ModalTraveler = ({ traveler, isOpen, onClose, index }) => {
  const inputRef = useRef();
  const { errors, setFieldValue, values } = useFormikContext();
  const listDetail = [
    {
      title: `Informasi Penumpang (${getPaxFaresName(traveler.paxType)})`,
      details: [
        {
          label: "Nama Lengkap",
          value: `${traveler.title} ${traveler.first_name} ${traveler.last_name}`,
        },
        { label: "Kewarganegaraan", value: getCountryName(traveler.country) },
        {
          label: "Tanggal Lahir",
          value: format(new Date(traveler.dob), "dd MMMM yyyy"),
        },
      ],
    },
    {
      details: [
        { label: "Nomor Passport", value: traveler.docs.cardNum },
        {
          label: "Negara Penerbit",
          value: getCountryName(traveler.docs.cardIssuePlace),
        },
        {
          label: "Tanggal Habis Berlaku",
          value: format(
            new Date(
              traveler.docs.cardExpired.year,
              traveler.docs.cardExpired.month,
              traveler.docs.cardExpired.day
            ),
            "dd MMMM yyyy"
          ),
        },
      ],
    },
  ];
  return (
    <CustomFilterButton
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Dokumen"
      notrounded
      footer="Simpan"
    >
      <ListDetail details={listDetail} />
      <Box py="24px">
        <Text color="neutral.text.high" fontFamily="heading" fontWeight="bold">
          Dokumen
        </Text>
        <Text fontSize="sm">Pastikan dokumen yang diupload benar</Text>
      </Box>
      <FormControl id={`docs.${index}`}>
        <FormLabel fontSize="sm">Passport</FormLabel>
        <InputGroup>
          <input
            ref={inputRef}
            type="file"
            onChange={(e) => {
              setFieldValue(`docs.${index}`, e.target.files[0]);
            }}
            style={{ display: "none" }}
          />
          <Input
            placeholder={values.docs?.[index]?.name || "Upload Passport"}
            onClick={() => inputRef.current.click()}
            variant="filled"
          />
          <InputRightElement mx="17px">
            <Text fontSize="sm" fontWeight="bold" color="brand.blue.400">
              Pilih
            </Text>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{errors.docs}</FormErrorMessage>
      </FormControl>
    </CustomFilterButton>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {
      meta: {
        title: "On Progress Booking",
      },
    },
  };
};

export default UploadOrderDocs;
