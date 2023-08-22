import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Center,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import Layout from "../../src/components/layout";
import { CustomOrangeFullWidthButton } from "../../src/components/button";
import Mail from "../../public/svg/icons/mail.svg";

const Invoice = () => {
  const detail = {
    items: [
      { t: "Waktu Pemesanan", s: "2 Juli 2022, 12.30 PM" },
      { t: "Airline Booking Code (PNR)", s: "XDVN8G" },
      { t: "Transaction ID", s: "INV-08152022" },
      { t: "Produk", s: "1 Penerbangan" },
    ],
  };
  const price_detail = {
    title: "Rincian Harga",
    items: [
      {
        title: "Tiket Penerbangan 1 - Lion Air",
        items: [
          { t: "Dewasa (x2)", s: "6.505.208" },
          { t: "Pajak", p: "Gratis" },
        ],
      },
      {
        title: "Tiket Penerbangan 2 - Singapore Airlines",
        items: [
          { t: "Dewasa (x2)", s: "8.318.562" },
          { t: "Pajak", p: "Gratis" },
        ],
      },
      { t: "Total Pembayaran", s: "14.823.768", b: true },
    ],
  };
  const contact_detail = {
    title: "Rincian Kontak",
    items: [
      { t: "Nama Lengkap", s: "Sophi Nuraeni" },
      { t: "Email", s: "sophinuraeni199@gmail.com" },
      { t: "Nomor Telepon", s: "081223679574" },
    ],
  };
  const [isETicket, setIsETicket] = useState(false);
  return (
    <Layout type="nested" pagetitle="Detail Pesanan" hideBottomBar>
      {isETicket ? (
        <Box bg="brand.blue.100" mx="-24px" px="24px">
          <Stack py="24px" borderBottom="1px dashed #9E9E9E">
            <Text fontSize="lg" fontWeight="semibold">
              E-Ticket
            </Text>
            <Text color="neutral.text.medium">
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Velit officia consequat duis.
            </Text>
          </Stack>
          {Array.from({ length: 2 }).map((_, index) => (
            <Stack key={index} py="24px" borderBottom="1px dashed #9E9E9E">
              <Stack spacing={0.75}>
                <Text color="neutral.text.medium">Penumpang {index + 1}</Text>
                <Text fontWeight="semibold" textTransform="uppercase">
                  sophi nuraeni
                </Text>
              </Stack>
              <Accordion allowToggle>
                {["departure", "destination"].map((type, index) => (
                  <AccordionItem key={index} border="none">
                    <AccordionButton px={0}>
                      <Box
                        flex="1"
                        color="brand.blue.400"
                        fontWeight="semibold"
                        textAlign="left"
                      >
                        Penerbangan {type === "departure" ? "Pergi" : "Pulang"}
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <HStack
                        justifyContent="space-between"
                        w="full"
                        p={"16px"}
                        gap={"16px"}
                        borderTopRadius={"12px"}
                        bg={"white"}
                      >
                        <Stack textTransform="uppercase">
                          {[
                            { t: "passenger", s: "sophi nuraeni" },
                            { t: "airline booking code (pnr)", s: "xdvn8g" },
                          ].map((item, index) => (
                            <Stack key={index} spacing={0.75}>
                              <Text
                                color="brand.blue.400"
                                fontSize="xs"
                                fontWeight="semibold"
                              >
                                {item.t}
                              </Text>
                              <Text>{item.s}</Text>
                            </Stack>
                          ))}
                        </Stack>
                        <Image
                          src="/png/qr-code.png"
                          alt="qr-code"
                          width={141}
                          height={129}
                          objectFit="contain"
                        />
                      </HStack>
                      <Box
                        as={"section"}
                        position={"relative"}
                        w="full"
                        p={"16px"}
                        borderTop={"1px"}
                        borderTopColor={"gray.200"}
                        borderTopStyle={"dashed"}
                        borderBottomRadius={"12px"}
                        bg={"white"}
                      >
                        {[{ left: "-8px" }, { right: "-8px" }].map(
                          (item, index) => (
                            <Box
                              {...item}
                              key={index}
                              position="absolute"
                              top={"-8px"}
                              bg={"brand.blue.100"}
                              w={"16px"}
                              h={"16px"}
                              borderRadius="full"
                            />
                          )
                        )}
                        <HStack
                          justifyContent="space-between"
                          position="relative"
                          py="16px"
                          borderBottom="1px dashed #9E9E9E"
                        >
                          {[
                            {
                              c: "SIN",
                              r: "Singapura",
                              d: { a: "8 Jul 22 ", b: "• 13.45" },
                            },
                            { l: true },
                            {
                              c: "CGK",
                              r: "Jakarta",
                              d: { a: "9 Jul 22 ", b: "• 16.30" },
                            },
                          ].map((item, index) =>
                            item.l ? (
                              <Center
                                key={index}
                                position="absolute"
                                insetX={0}
                                top="36px"
                              >
                                <Box
                                  position="relative"
                                  borderTop="1px dashed #9E9E9E"
                                  w="33%"
                                >
                                  {["left", "right"].map((item, index) => (
                                    <Box
                                      key={index}
                                      position="absolute"
                                      bottom="-7px"
                                      {...{ [item]: "-4px" }}
                                      bg={"brand.blue.400"}
                                      w={"16px"}
                                      h={"16px"}
                                      border={"5px solid #F0F4F5"}
                                      borderRadius="full"
                                    />
                                  ))}
                                </Box>
                              </Center>
                            ) : (
                              <Stack
                                key={index}
                                alignItems={index > 0 ? "end" : "start"}
                              >
                                <Stack spacing={0.5}>
                                  <Text
                                    color="brand.blue.400"
                                    fontSize="xl"
                                    fontWeight="semibold"
                                  >
                                    {item.c}
                                  </Text>
                                  <Text color="neutral.text.medium">
                                    {item.r}
                                  </Text>
                                </Stack>
                                <Text fontSize="lg">
                                  {item.d.a}
                                  <Text as="span" fontWeight="semibold">
                                    {item.d.b}
                                  </Text>
                                </Text>
                              </Stack>
                            )
                          )}
                        </HStack>
                        {[
                          [
                            { t: "pesawat", s: "BATIK AIR" },
                            { t: "kode pesawat", s: "JT201" },
                            { t: "boarding time", s: "13:45" },
                          ],
                          [
                            { t: "terminal", s: "1" },
                            { t: "seat", s: "15 G" },
                            { t: "bagasi", s: "20 Kg" },
                          ],
                        ].map((list, index) => (
                          <HStack
                            key={index}
                            justifyContent="space-between"
                            py="16px"
                            borderBottom={
                              index === 0 ? "1px dashed #9E9E9E" : "none"
                            }
                          >
                            {list.map((item, i) => (
                              <Stack key={i} flexBasis="33%">
                                <Text
                                  color="brand.blue.400"
                                  fontSize="xx-small"
                                  fontWeight="semibold"
                                  textTransform="uppercase"
                                >
                                  {item.t}
                                </Text>
                                <Text>{item.s}</Text>
                              </Stack>
                            ))}
                          </HStack>
                        ))}
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </Stack>
          ))}
        </Box>
      ) : (
        <>
          <Box bg={"brand.blue.100"} mx={"-24px"} p={"24px"}>
            <Badge
              variant="unstyled"
              fontWeight="regular"
              textTransform="none"
              bg="brand.orange.400"
              mb="24px"
              color="white"
            >
              Round Trip
            </Badge>
            <Accordion allowToggle>
              {["departure", "destination"].map((type, index) => (
                <AccordionItem key={index} border="none">
                  <AccordionButton px={0}>
                    <Box
                      flex="1"
                      color="brand.blue.400"
                      fontWeight="semibold"
                      textAlign="left"
                    >
                      Penerbangan {type === "departure" ? "Pergi" : "Pulang"}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Stack bg="white" px="16px" py="14px" borderRadius="8px">
                      <Text fontWeight="semibold" pb="12px">
                        Indonesia (CGK) - Singapura (SIN)
                      </Text>
                      <Stack pt="12px" borderTop="1px dashed #9E9E9E">
                        {[
                          {
                            i: `/svg/flights/${type}.svg`,
                            t: "Batik Air • JT210 ",
                          },
                          {
                            i: "/svg/flights/date.svg",
                            t: "8 Juli, 13.45 - 16.30",
                          },
                          {
                            i: "/svg/flights/people.svg",
                            t: "1 Dewasa, Ekonomi",
                          },
                        ].map((item, index) => (
                          <HStack key={index}>
                            <Image
                              src={item.i}
                              alt={item.i}
                              width={20}
                              height={20}
                            />
                            <Text fontSize="sm" color="neutral.text.medium">
                              {item.t}
                            </Text>
                          </HStack>
                        ))}
                      </Stack>
                    </Stack>
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
          <Box as="section">
            <Details data={detail} />
            <Box mx="-24px" h="8px" bg="brand.blue.100" />
            <Details data={price_detail} />
            <Box mx="-24px" h="8px" bg="brand.blue.100" />
            <Details data={contact_detail} />
            <Text color="neutral.text.medium">
              Tidak menerima e-ticket dan invoice, kirim ulang ke email
            </Text>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              p="15px"
              mb="24px"
              bg="brand.blue.100"
              borderRadius="4px"
            >
              <HStack>
                <Mail />
                <Text>sophinuraeni199@gmail.com</Text>
              </HStack>
              <Text fontWeight="semibold" color="brand.blue.400">
                Kirim
              </Text>
            </HStack>
          </Box>
          <HStack
            borderTop="1px solid #9E9E9E"
            justifyContent="space-between"
            alignItems="end"
          >
            <CustomOrangeFullWidthButton
              isoutlined
              onClick={() => setIsETicket(true)}
            >
              E-Tiket
            </CustomOrangeFullWidthButton>
            <CustomOrangeFullWidthButton>
              Lihat Pesanan
            </CustomOrangeFullWidthButton>
          </HStack>
        </>
      )}
    </Layout>
  );
};

export default Invoice;

const Details = ({ data }) => {
  return (
    <Stack py="24px" lineHeight="19.6px" color="neutral.text.medium">
      {data.title && (
        <Box pb="16px" borderBottom="1px dashed #9E9E9E">
          <Text fontSize="lg" fontWeight="semibold">
            {data.title}
          </Text>
        </Box>
      )}
      {data.items.map((item, index) =>
        item.title ? (
          <Box key={index} pb="12px" borderBottom="1px dashed #9E9E9E">
            <Text fontWeight="semibold" color="brand.blue.400" pb="8px">
              {item.title}
            </Text>
            {item.items.map((i, ind) => (
              <HStack
                key={ind}
                alignItems="center"
                justifyContent="space-between"
              >
                <Text>{i.t}</Text>
                <Text fontWeight={item.b ? "semibold" : "normal"}>{i.s}</Text>
              </HStack>
            ))}
          </Box>
        ) : (
          <HStack
            key={index}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text>{item.t}</Text>
            <Text fontWeight={item.b ? "semibold" : "normal"}>{item.s}</Text>
          </HStack>
        )
      )}
    </Stack>
  );
};
