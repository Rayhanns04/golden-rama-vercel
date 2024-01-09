import { useRef } from "react";
import { useRouter } from "next/router";
import {
  Alert,
  AlertIcon,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import _ from "lodash";
import { useSelector } from "react-redux";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { uploadFile } from "../../src/services/file.service";
import { postMoment } from "../../src/services/tour.service";
import Layout from "../../src/components/layout";
import CustomCalendar from "../../src/components/calendar";
import { SelectForm } from "../../src/components/person";
import { CustomDropdown } from "../../src/components/dropdown";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import { getToursQuery } from "../../src/services/tour.service";
import date from "../../src/helpers/date";

const UploadGallery = () => {
  const queryClient = useQueryClient();
  const inputRef = useRef(null);
  const router = useRouter();
  const toast = useToast({
    isClosable: true,
    variant: "subtle",
  });
  const { user } = useSelector((s) => s.authReducer);
  const { tour, slug } = router.query;

  const { mutateAsync: imageMutation } = useMutation(uploadFile);
  const { mutateAsync: momentMutation } = useMutation(postMoment, {
    onSuccess: (data) => {
      queryClient.invalidateQueries([
        "getTourMomentsBySlug",
        data.attributes.slug,
      ]);
      toast({
        title: "Moment-mu berhasil terupload!",
        status: "success",
      });
      router.push(`/tours/${data.attributes.slug}/gallery`);
    },
  });

  const initialValues = {
    photo: "",
    title: "",
    description: "",
    tour:
      tour && slug
        ? {
            value: slug,
            label: tour,
          }
        : "",
    location: "",
    departure: "",
  };

  const handleSubmit = (values, actions) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { photo, tour, ...rest } = values;
        const responseImage = photo && (await imageMutation(values.photo));
        if (!responseImage) return reject(responseImage);
        const response = await momentMutation({
          data: {
            ...rest,
            tour: tour?.label,
            slug: tour?.value,
            image: responseImage.id,
            customerDetail: user?.id,
          },
        });
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  };

  const _getTourOptions = (inputValue, callback) => {
    getToursQuery(inputValue).then((tours) => {
      const options = tours.map((tour) => ({
        value: tour.slug,
        label: tour.name,
      }));
      callback(options);
    });
  };
  const getTourOptions = _.debounce(_getTourOptions, 500);
  return (
    <Layout type={"nested"} metatitle={"Upload Foto"} pagetitle={"Upload Foto"}>
      <Container maxWidth="container.sm" px={0}>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, isSubmitting, setFieldValue, values }) => (
            <Form>
              <Stack spacing={4}>
                <Field name="photo">
                  {({ field, form }) => (
                    <FormControl id="photo">
                      <FormLabel fontSize="sm">Foto</FormLabel>
                      <InputGroup>
                        <input
                          ref={inputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            form.setFieldValue("photo", e.target.files[0]);
                          }}
                          style={{ display: "none" }}
                        />
                        <Input
                          placeholder={form.values.photo?.name || "File.jpg"}
                          onClick={() => inputRef.current.click()}
                          variant="filled"
                        />
                        <InputRightElement mx="17px">
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color="brand.blue.400"
                          >
                            Pilih
                          </Text>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.photo}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="title">
                  {({ field, form }) => (
                    <FormControl id="title" isRequired>
                      <FormLabel fontSize="sm">Judul Foto</FormLabel>
                      <InputGroup>
                        <Input {...field} type="text" variant="filled" />
                      </InputGroup>
                      <FormErrorMessage>{errors.title}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="description">
                  {({ field, form }) => (
                    <FormControl id="description">
                      <FormLabel fontSize="sm">
                        Deskripsi Pendek (Caption)
                      </FormLabel>
                      <InputGroup>
                        <Textarea {...field} variant="filled" />
                      </InputGroup>
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <FormControl id="tour-slug" isRequired>
                  <FormLabel fontSize="sm">Nama Tour</FormLabel>
                  <AsyncSelect
                    isReadOnly={tour && slug}
                    defaultOptions
                    loadOptions={getTourOptions}
                    variant="filled"
                    value={values.tour}
                    onChange={(newValue) => {
                      setFieldValue("tour", newValue);
                    }}
                  />
                  <FormErrorMessage>{errors.tour}</FormErrorMessage>
                </FormControl>
                <Field name="location">
                  {({ field, form }) => (
                    <FormControl id="location" isRequired>
                      <FormLabel fontSize="sm">Location</FormLabel>
                      <SelectForm
                        isRequired
                        form={form}
                        field={field}
                        name="location"
                        placeholder="Lokasi"
                      />
                      <FormErrorMessage>{errors.location}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="departure">
                  {({ field, form }) => (
                    <FormControl id="departure" isRequired>
                      <FormLabel fontSize="sm">Departure Date</FormLabel>
                      <CustomDropdown
                        title={"Pilih Tanggal Keberangkatan"}
                        placeholder={"Tanggal Keberangkatan"}
                        value={
                          typeof form.values.departure === "object"
                            ? date(
                                new Date(form.values.departure),
                                "dd MMMM yyyy"
                              )
                            : form.values.departure
                        }
                      >
                        <Stack spacing={5} py={5}>
                          <CustomCalendar
                            value={form.values.departure}
                            onChange={(date) => {
                              form.setFieldValue("departure", date, false);
                            }}
                          />
                        </Stack>
                      </CustomDropdown>
                      <FormErrorMessage>{errors.departure}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <CustomOrangeFullWidthButton
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="Loading"
                >
                  Upload Foto
                </CustomOrangeFullWidthButton>
              </Stack>
            </Form>
          )}
        </Formik>
      </Container>
    </Layout>
  );
};

export default UploadGallery;
