import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import Layout from "../../src/components/layout";
import { getCountries } from "../../src/services/country.service";
import { getRequirementByCountryCode } from "../../src/services/requirement.service";
import MailIcon from "../../public/svg/icons/mail.svg";
import PhoneIcon from "../../public/svg/icons/phone.svg";

const CheckVisa = () => {
  const router = useRouter();
  const { destination } = router.query;
  const { data: requirement } = useQuery(
    ["requirement", destination],
    () => getRequirementByCountryCode(destination),
    {
      enabled: !!destination,
    }
  );
  return (
    <Layout type="nested" pagetitle="Cek Passport dan Visa">
      <Box
        maxW={{ md: "container.lg", lg: "container.xl" }}
        mx="auto"
        pt="24px"
        pb="32px"
      >
        <Heading color="brand.blue.400" fontSize="2xl" fontWeight="bold">
          Persyaratan untuk Pergi ke{" "}
          {requirement?.attributes.country.data.attributes.name}
        </Heading>
        <Text fontSize="xs">Dokumen, Visa, Passport</Text>
      </Box>
      <Accordion
        allowToggle
        allowMultiple={true}
        mx="-24px"
        bg="brand.blue.100"
      >
        <Stack
          py="8px"
          maxW={{ md: "container.lg", lg: "container.xl" }}
          mx="auto"
          spacing="8px"
        >
          <AccordionItem bg="white" rounded={{ md: "md" }} border="none">
            <AccordionButton p="24px" justifyContent="space-between">
              <Box textAlign="left">
                <Heading color="brand.blue.400" fontSize="lg" fontWeight="bold">
                  VISA
                </Heading>
                <Text fontSize="sm">Visa dibutuhkan</Text>
              </Box>
              <AccordionIcon color="brand.blue.400" />
            </AccordionButton>
            <AccordionPanel px="48px" pb="24px">
              <ReactMarkdown>
                {requirement?.attributes.visa.replaceAll(
                  `/uploads`,
                  `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads`
                )}
              </ReactMarkdown>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem bg="white" border="none">
            <AccordionButton p="24px" justifyContent="space-between">
              <Box textAlign="left">
                <Heading color="brand.blue.400" fontSize="lg" fontWeight="bold">
                  PASSPORT
                </Heading>
                <Text fontSize="sm">Passport Dibutuhkan</Text>
              </Box>
              <AccordionIcon color="brand.blue.400" />
            </AccordionButton>
            <AccordionPanel px="48px" pb="24px">
              <ReactMarkdown>
                {requirement?.attributes.passport ||
                  `Proses    : 
Paspor Biasa (1-2 minggu)
Rp. 1.100.000 + PPN 1.1% (pembayaran dimuka) 

Paspor Elektronik / Chip (1-2 minggu)
Rp. 1.800.000 + PPN 1,1% (pembayaran dimuka)

Paspor Biasa Kilat (4-7 hari kerja)
Rp. 1.600.000 + PPN 1,1% (pembayaran dimuka) 

Paspor Elektronik/Chip Kilat (4-7 hari kerja)
Rp. 2.500.000 + PPN 1,1% (pembayaran dimuka)

Dewasa ( > 17 Th )                
1. KTP (copy)                        
2. Kartu Keluarga (copy)                           
3. Akte Lahir    (copy)                        
4. Akte Nikah    (copy)                        
5. Surat WNI / SKBRI (utk WNI)                
6. Surat Ganti Nama (utk WNI)                
7. Ijasah SMU / pendidikan terakhir (untuk Pribumi)                
8. Sponsor dari Perusahaan (jika karyawan/i)        
9. Paspor (Asli)
10. NPWP (Jika buat baru)

Anak ( 0 – 16 Th )
1. KTP Ayah & Ibu (copy)
2. Paspor Ayah & Ibu
3. Akte Lahir Anak & Ayah / Ibu
4. Kartu Keluarga (copy)
5. Akte Nikah Ortu (copy)
6. Surat WNI / SKBRI Ortu
7. Surat Ganti Nama Ortu
8. Paspor (Asli)

Note :
* u/ PNS : Harus melampirkan SK Pengangkatan, Kartu Pegawai & Surat Ijin dari Atasan
* u/ Anak : Ayah & Ibu harus mendampingi saat datang ke imigrasi 
* Saat pengambilan foto & sidik jari semua berkas asli WAJIB dibawa

`}
              </ReactMarkdown>
            </AccordionPanel>
          </AccordionItem>
          <Box bg="white" rounded={{ md: "md" }} p="24px">
            <Heading color="brand.blue.400" fontSize="lg" fontWeight="bold">
              HUBUNGI KAMI
            </Heading>
            <Text fontSize="sm">
              Informasi lebih lanjut dapat menghubungi kami di:
            </Text>
            <Stack py="24px" spacing="16px">
              <HStack spacing="6px">
                <MailIcon />
                <Text fontSize="sm">contact.us@goldenrama.com</Text>
              </HStack>
              <HStack spacing="6px">
                <PhoneIcon />
                <Text fontSize="sm">(021) 2963 1988</Text>
              </HStack>
            </Stack>
          </Box>
        </Stack>
      </Accordion>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const countries = await getCountries("", {
    withRequirements: true,
  });
  const paths = countries.map((country) => {
    return {
      params: {
        destination: country.attributes.isoCode2,
      },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Cek Passport dan Visa",
      },
    },
  };
};

export default CheckVisa;
