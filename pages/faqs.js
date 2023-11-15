import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Breadcrumb,
  Heading,
  SkeletonText,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import Layout from "../src/components/layout";
import Breadcrumbs from "nextjs-breadcrumbs";
import axios from "axios";

const FAQ = (props) => {
  const { faq: faqs, meta } = props;
  return (
    <Layout pagetitle={"Frequently Asked Questions"} meta={meta}>
      <Box
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        py={"24px"}
        mx={"auto"}
      >
        {/* <Breadcrumbs
          rootLabel="Home"
          labelsToUppercase
          listClassName="breadcrumb-list"
        /> */}
        <Stack spacing={"12px"}>
          <Heading fontSize={"lg"} textAlign={"center"}>
            Frequently Asked Questions
          </Heading>
          <Accordion allowMultiple mx={"-24px"} px={"24px"}>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    General
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <Stack spacing={"10px"} as={"section"} id={"general"}>
                  <p>
                    <strong>
                      Q : Dimana saya bisa melakukan pemesanan produk Golden
                      Rama Tours &amp; Travel?
                    </strong>
                  </p>
                  <p>
                    <strong>A:</strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Anda dapat melakukan pemesanan produk kami melalui website
                      Golden Rama{" "}
                    </span>
                    <a href="https://www.goldenrama.com/">
                      <span style={{ fontWeight: "normal" }}>disini</span>
                    </a>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}
                      , atau melalui Greta (Golden Rama Travel Assistant) di
                      aplikasi{" "}
                    </span>
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      <span style={{ fontWeight: "normal" }}>
                        Whatsapp Greta
                      </span>
                    </a>
                    <span style={{ fontWeight: "normal" }}>.&nbsp;</span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Anda juga dapat menghubungi Hotline tiket kami di (021)
                      2980 6000 ataupun datang ke Kantor pusat dan kantor cabang
                      Golden Rama Tours &amp; Travel terdekat. Alamat Kantor
                      pusat dan kantor cabang Golden Rama Tours &amp; Travel
                      dapat anda lihat{" "}
                    </span>
                    <a href="https://www.goldenrama.com/contact-us">
                      <span style={{ fontWeight: "normal" }}>disini</span>
                    </a>
                    <span style={{ fontWeight: "normal" }}>.&nbsp;</span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apakah saya bisa melakukan pemesanan tanpa menggunakan
                      email?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Anda dapat melakukan pemesanan secara langsung dengan
                      datang ke Kantor pusat dan kantor cabang Golden Rama Tours
                      &amp; Travel terdekat. Alamat Kantor pusat dan kantor
                      cabang Golden Rama Tours &amp; Travel dapat anda lihat{" "}
                    </span>
                    <a href="https://www.goldenrama.com/contact-us">
                      <span style={{ fontWeight: "normal" }}>disini</span>
                    </a>
                    <span style={{ fontWeight: "normal" }}>.&nbsp;</span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Metode pembayaran apa saja yang tersedia di Golden
                      Rama Tours &amp; Travel?
                    </strong>
                  </p>
                  <p>
                    <strong>A :</strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Anda dapat melakukan pembayaran dengan berbagai metode di
                      Golden Rama Tours &amp; Travel, baik melalui website
                      ataupun datang secara langsung ke Kantor Golden Rama Tours
                      &amp; Travel terdekat.&nbsp;
                    </span>
                  </p>
                  <p>
                    <strong>Transfer &amp; ATM</strong>
                  </p>
                  <ul>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        ATM Transfer (ATM Bersama / Prima/ Alto)
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        BCA Virtual Account
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        BNI Virtual Account
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        CIMB Virtual Account&nbsp;
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Mandiri Virtual Account
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Permata Virtual Account
                      </span>
                    </li>
                  </ul>
                  <p>&nbsp;</p>
                  <p>
                    <strong>Pembayaran Online</strong>
                  </p>
                  <ul>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>Octo Clicks</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>Go Pay</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>OVO&nbsp;</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>ShopeePay</span>
                    </li>
                  </ul>
                  <p>
                    <strong>Kartu Kredit</strong>
                  </p>
                  <ul>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        American Express
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Kartu Kredit (Visa &amp; Master)
                      </span>
                    </li>
                  </ul>
                  <p>
                    <strong>Cicilan Kartu Kredit min trx IDR 1.000.000</strong>
                  </p>
                  <p>
                    <strong>Cicilan 3 bulan</strong>
                  </p>
                  <ul>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>DBS</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>Mandiri</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Cicilan 6 bulan
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>BCA</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>CIMB</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>DBS</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>Mandiri</span>
                    </li>
                  </ul>
                  <p>
                    <strong>Cicilan 12 bulan</strong>
                  </p>
                  <ul>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>CIMB</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>DBS</span>
                    </li>
                  </ul>
                  <p>
                    <strong>Travel Privilege Card</strong>
                  </p>
                  <ul>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Travel Privilege Card
                      </span>
                    </li>
                  </ul>
                  <p>
                    <strong>Cicilan Tanpa Kartu Kredit</strong>
                  </p>
                  <ul>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Aku Laku (Tour)
                      </span>
                    </li>
                  </ul>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Bagaimana pembatasan usia dalam pemesanan produk di
                      Golden Rama Tours &amp; Travel ?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Pembatasan usia dalam pemesanan produk di Golden Rama
                      Tours &amp; Travel dengan ketentuan sebagai berikut :
                    </span>
                  </p>
                  <ul>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Usia di bawah 2 tahun termasuk kategori bayi
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Usia 2 - 11 tahun termasuk kategori anak
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Usia di atas 12 tahun termasuk kategori dewasa
                      </span>
                    </li>
                  </ul>
                  <p>
                    <br />
                    <br />
                  </p>
                  <p>
                    <strong>
                      Q: Apakah saya dapat mengajukan pembatalan, refund, dan
                      reschedule untuk semua produk yang saya beli di Golden
                      Rama?
                    </strong>
                  </p>
                  <p>
                    <strong>A :&nbsp;&nbsp;</strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Anda dapat mengajukan refund dan reschedule bergantung
                      pada kebijakan masing-masing produk yang telah anda pesan,
                      serta kebijakan dari maskapai/hotel/penyedia produk
                      terkait karena beberapa pemesanan memiliki kebijakan
                      non-refundable dan no-reschedule.
                    </span>
                  </p>
                  <p>
                    <br />
                    <br />
                  </p>
                  <p>
                    <strong>
                      Q : Dokumen apa saja yang harus saya siapkan untuk
                      pembatalan pemesanan di Golden Rama Tours and Travel ?
                    </strong>
                  </p>
                  <p>
                    <strong>A :&nbsp;&nbsp;</strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Anda perlu menyiapkan dokumen pendukung yang diperlukan
                      mengacu pada alasan pembatalan. Contohnya, jika
                      dikarenakan pembatalan maskapai, sertakan bukti informasi
                      pembatalan atau perubahan dari maskapai. Jika dikarenakan
                      sakit, bisa menunjukkan surat keterangan dari dokter yang
                      menginformasikan tidak bisa melakukan perjalanan. Jika ada
                      tamu atau penumpang yang meninggal dunia, menyertakan
                      surat keterangan kematian. Bisa atau tidaknya pengajuan
                      diterima tergantung dari kebijakan dari maskapai yang
                      berlaku.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>Q :&nbsp; </span>
                    <strong>
                      Jika saya mengajukan refund , kemana dana saya akan
                      dikembalikan ?
                    </strong>
                  </p>
                  <p>
                    <strong>A:</strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Pengembalian dana refund tergantung dari metode bayar yang
                      sebelumnya anda pilih pada saat pemesanan, informasi
                      detailnya sebagai berikut:
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>&nbsp;</span>
                  </p>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <p>
                            <strong>Metode Pembayaran</strong>
                          </p>
                        </td>
                        <td>
                          <p>
                            <strong>Pengembalian Dana</strong>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Kartu Kredit
                            </span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening Pemesan / Penumpang
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Kartu Debit
                            </span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening Pemesan / Penumpang
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Virtual Account
                            </span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening Pemesan / Penumpang
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>ATM</span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening Pemesan / Penumpang
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Transfer
                            </span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening Pemesan / Penumpang
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>Gopay</span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening Pemesan / Penumpang
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              ShopeePay
                            </span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening Pemesan / Penumpang
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Octo Clicks
                            </span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening atau Kartu Kredit Pemesan / Penumpang
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Akulaku&nbsp;
                            </span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Kembali ke Merchant
                            </span>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Travel Privilege Card
                            </span>
                          </p>
                        </td>
                        <td>
                          <p>
                            <span style={{ fontWeight: "normal" }}>
                              Rekening Travel
                            </span>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <p>&nbsp;</p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Downpayment (DP) untuk produk tour dikembalikan dalam
                      bentuk deposit yang akan bisa digunakan untuk pembelian
                      tour berikutnya.&nbsp;
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Kenapa dana refund yang saya terima tidak sesuai
                      dengan harga saat pemesanan?
                    </strong>
                  </p>
                  <p>
                    <strong>A:&nbsp;</strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Apabila anda mengajukan pembatalan atas pesanan anda, maka
                      pengembalian dana akan mengikuti ketentuan dari produk
                      yang anda beli.
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Apabila anda menggunakan promo atau voucher promo dan
                      mendapatkan potongan harga, maka pengembalian dana akan
                      dikurangi dengan penggunaan voucher ataupun promo.
                    </span>
                  </p>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Tour
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <Stack spacing={"10px"} as={"section"} id={"tour"}>
                  <p>
                    <strong>
                      Q : Pilihan paket tour apa saja yang tersedia di Golden
                      Rama Tours &amp; Travel?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Saat ini pilihan paket tour yang tersedia :&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Package Tour (Land Tour)&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Group Tour Series&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Incentives Tour
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>- Cruise Tour</span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apa perbedaan antara Package Tour, Group Tour Series
                      dan Incentives Tour?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Perbedaan yakni :
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Package Tour adalah paket tour yang umumnya&nbsp; pasti
                      berangkat dengan minimal 2 peserta tanpa didampingi oleh
                      Tour Leader.&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Group Tour Series merupakan Tipe perjalanan dimana Anda
                      akan digabungkan dalam satu grup perjalanan yang berisi
                      teman-teman baru selama perjalanan.&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Minimal pendaftaran : 1 orang (Minimal 1 grup berisi
                      dengan total 15 orang maka grup pasti berangkat).
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Incentives Tour dapat disebut juga dengan Private Tour
                      atau Corporate Tour, Anda dapat menentukan sendiri
                      destinasi, penerbangan hingga itinerary yang diinginkan.
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Minimal Pendaftaran : 15 Orang.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Pilihan destinasi tour apa saja yang tersedia di
                      Golden Rama Tours &amp; Travel?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Kami memiliki banyak sekali pilihan destinasi untuk
                      memenuhi kebutuhan perjalanan Anda.
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Afrika, Asia Tengah &amp; Sekitarnya
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Wisata Rohani
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Asia Tenggara &amp; Sekitarnya
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>- Japan</span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - China, Taiwan &amp; Sekitarnya
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Eropa &amp; Sekitarnya
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>- Eropa Barat</span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>- Korea</span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>- Australia</span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Selandia Baru
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - America &amp; Canada
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Indonesia (Domestik tour)
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      untuk pilihan tour lengkapnya Anda dapat temukan di
                      halaman website Golden Rama pada{" "}
                    </span>
                    <a href="https://www.goldenrama.com/tours">
                      <span style={{ fontWeight: "normal" }}>link ini</span>
                    </a>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Bagaimana cara memesan tour di Golden Rama Tours &amp;
                      Travel?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Anda dapat melakukan pemesanan tour dengan beberapa
                      cara yakni :
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Melakukan pemesanan di website Golden Rama pada{" "}
                    </span>
                    <a href="https://www.goldenrama.com/tours">
                      <span style={{ fontWeight: "normal" }}>link ini</span>
                    </a>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Menghubungi GRETA (Golden Rama E-travel Assistant) di{" "}
                    </span>
                    <a href="https://wa.me/6281511221133">
                      <span style={{ fontWeight: "normal" }}>link ini</span>
                    </a>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Menghubungi Hotline Tour kami di (021) 2963 1888&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Datang langsung ke kantor pusat atau cabang Golden rama
                      Tours yang tertera pada{" "}
                    </span>
                    <a href="https://www.goldenrama.com/contact-us">
                      <span style={{ fontWeight: "normal" }}>list ini</span>
                    </a>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Bagaimana cara melakukan pembayaran tour?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Setelah Anda melakukan pemesanan, untuk melakukan
                      pembayaran tour Anda dapat membayarkan Uang Muka
                      Pendaftaran (DP Non-refundable) besarnya biaya uang muka
                      tergantung destinasi yang Anda pilih dan Biaya Visa (jika
                      ada).&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Berdasarkan ketentuan dari kedutaan, biaya visa tetap
                      harus dibayarkan walaupun visa tidak disetujui oleh
                      Kedutaan dan jika terdapat biaya lain seperti biaya cetak
                      tiket dan biaya tour maka akan dibebankan kepada peserta
                      tour.&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Untuk pelunasan biaya tour paling lambat 14 hari sebelum
                      tanggal keberangkatan.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Mencakup atau termasuk biaya apa saja kah untuk harga
                      yang tertera?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Berikut keterangan,
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      FAVORITE TOUR / AMAZING TOUR / RELAXING TOUR&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Biaya tour termasuk :
                    </span>
                  </p>
                  <ol>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Tiket pesawat internasional kelas ekonomi
                        (non-refundable, non-endorsable, non-reroutable&nbsp;
                        berdasarkan harga tiket group atau harga promosi lainnya
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Akomodasi, menginap di hotel berbintang dengan ketentuan
                        02 (dua) orang dalam satu kamar (twin sharing). Jika
                        menginginkan satu kamar sendiri akan dikenakan tambahan
                        (Single Supplement).
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Bagasi Cuma-Cuma 1 potong dengan berat maksimum 20 kg
                        atau sesuai dengan peraturan penerbangan yang digunakan
                        dan 1 handbag kecil untuk dibawa ke kabin pesawat
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Makan (MP-Makan Pagi; MS-Makan Siang; MM-Makan Malam),
                        transportasi dan acara tour sesuai dengan jadwal acara
                        tour
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Tour leader dari Golden Rama Tours &amp; Travel
                      </span>
                    </li>
                  </ol>
                  <p>&nbsp;</p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Biaya tour tidak termasuk :
                    </span>
                  </p>
                  <ol>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Dokumen perjalanan (paspor, visa)
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Biaya PCR&nbsp;
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>PPN 1.1%</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Airport Tax International &amp; Fuel Surcharge&nbsp;
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Covid Certificate (Apabila diperlukan)
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Pengeluaran pribadi seperti: mini bar, room service,
                        telpon, laundry, tambahan makanan dan minuman di
                        restoran dll
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Tour tambahan (optional) yang mungkin diadakan selama
                        perjalanan.
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Biaya kelebihan berat barang-barang bawaan diatas 20kg
                        (excess baggage).
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Bea masuk bagi barang-barang yang dikenakan bea masuk
                        oleh duane di Jakarta maupun di negara-negara yang
                        dikunjungi.
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Tip untuk Pengemudi, Porter, Local guide dan Tour leader
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Biaya Single Supplement bagi peserta yang menempati 1
                        kamar
                      </span>
                    </li>
                  </ol>
                  <p>
                    <br />
                    <br />
                    <br />
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      SUPERSALE TOUR / EXPLORE TOUR&nbsp;
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Biaya tour termasuk :
                    </span>
                  </p>
                  <ol>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Tiket pesawat internasional kelas ekonomi
                        (non-refundable, non-endorsable, non-reroutable
                        berdasarkan harga tiket group atau harga promosi lainnya
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Airport Tax International &amp; Fuel Surcharge&nbsp;
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>PPN 1.1%</span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Akomodasi, menginap di hotel berbintang dengan ketentuan
                        02 (dua) orang dalam satu kamar (twin sharing). Jika
                        menginginkan satu kamar sendiri akan dikenakan tambahan
                        (Single Supplement).
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Bagasi Cuma-Cuma 1 potong dengan berat maksimum 20 kg
                        atau sesuai dengan peraturan penerbangan yang digunakan
                        dan 1 handbag kecil untuk dibawa ke kabin pesawat&nbsp;
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Makan (MP-Makan Pagi; MS-Makan Siang; MM-Makan Malam),
                        transportasi dan acara tour sesuai dengan jadwal acara
                        tour
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Tour leader dari Golden Rama Tours &amp; Travel
                      </span>
                    </li>
                  </ol>
                  <p>&nbsp;</p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Biaya tour tidak termasuk :
                    </span>
                  </p>
                  <ol>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Dokumen perjalanan (paspor dan visa)
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Pengeluaran pribadi seperti: mini bar, room service,
                        telpon, laundry, tambahan makanan dan minuman di
                        restoran dll
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Tour tambahan (optional) yang mungkin diadakan selama
                        perjalanan.
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Biaya kelebihan berat barang-barang bawaan diatas 20kg
                        (excess baggage).
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Bea masuk bagi barang-barang yang dikenakan bea masuk
                        oleh duane di Jakarta maupun di negara-negara yang
                        dikunjungi.
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Tip untuk Pengemudi, Porter, Local guide dan Tour leader
                      </span>
                    </li>
                    <li style={{ fontWeight: "normal" }}>
                      <span style={{ fontWeight: "normal" }}>
                        Biaya Single Supplement bagi peserta yang menempati 1
                        kamar sendiri
                      </span>
                    </li>
                  </ol>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Bagaimana jika saya ingin mengajukan pembatalan?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Pengajuan pembatalan dapat Anda lakukan dengan
                      menghubungi tour agent kami. Jika terjadi
                      pembatalan/pindah tanggal/pindah acara tour oleh peserta
                      sebelum tanggal keberangkatan maka biaya pembatalan akan
                      mengacu pada peraturan Golden Rama (Dapat dilihat di
                      website: www.golden-rama.com, Buku Tour, ataupun pada
                      Bukti Pembayaran Deposit/Invoice) berikut ketentuannya :
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - Setelah pendaftaran : Uang Muka pendaftaran (Non
                      Refundable)
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - 30-15 hari kalender sebelum tanggal keberangkatan : 50%
                      dari biaya tour
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - 14-07 hari kalender sebelum tanggal keberangkatan : 75%
                      dari biaya tour
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      - 06 hari kalender sebelum tanggal keberangkatan : 100%
                      dari biaya tour
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Apabila terjadi Force Majeur/Kondisi diluar kendali
                      (Bencana alam, Pemogokan, Kehilangan, Kerusakan,
                      Keterlambatan sarana angkutan/transportasi, dll) yang
                      dapat mempengaruhi acara tour menjadi berubah dan bersifat
                      non refundable (tidak ada pengembalian). Dan Harga tour
                      tidak termasuk segala pengeluaran tambahan yang disebabkan
                      oleh Force Majeur.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Jika visa saya di tolak oleh kedutaan, bagaimana
                      dengan biaya yang sudah saya bayarkan?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Bila permohonan visa ditolak sedangkan tiket
                      penerbangan sudah diterbitkan sebelum permohonan visa
                      disetujui, maka biaya visa tidak dapat dikembalikan. Ini
                      karena adanya tenggat waktu (
                    </span>
                    <em>
                      <span style={{ fontWeight: "normal" }}>time-limit</span>
                    </em>
                    <span style={{ fontWeight: "normal" }}>
                      ) yang ditentukan perusahaan penerbangan dalam hal
                      penerbitan tiket penerbangan. Dan dalam hal ini peserta
                      akan tetap dikenakan denda pembatalan dan administrasi
                      sesuai dengan kondisi terkait pihak penerbangan, hotel dan
                      agen di luar negeri.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apakah perjalanan saya bisa di-extend / diperpanjang?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Perihal extend adalah kebijakan dari masing masing
                      maskapai penerbangan, kami dapat membantu Anda untuk
                      mengajukan permohonan kepada maskapai, namun kondisi ini
                      tergantung pada availability seat dan hanya dapat
                      dilakukan setelah pelunasan DP.
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Silahkan menginformasikan tanggal kepulangan yang
                      diinginkan kepada tour agent kami, untuk dapat kami proses
                      perihal permohonan extend tersebut. Dan perlu diperhatikan
                      untuk biaya yang timbul dari proses extend ini akan
                      dibebankan ke pihak peserta.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apakah dapat dijelaskan untuk pilihan hotel dalam trip
                      ini?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Dalam Group Tour Series, kami memiliki beberapa tipe
                      program yakni :
                    </span>
                  </p>
                  <ol>
                    <li>
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        Amazing Tour : Premium Tour dengan Hotel *4 setara.
                      </span>
                    </li>
                    <li>
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        Relaxing Tour : Premium Tour dengan Hotel *4 setara.
                      </span>
                    </li>
                    <li>
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        Favorite Tour : Premium Tour dengan Hotel *4 setara.
                      </span>
                    </li>
                    <li>
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        Supersale Tour : Tour dengan harga terjangkau dengan
                        Hotel *3 &amp; *4 setara.
                      </span>
                    </li>
                    <li>
                      <span style={{ fontWeight: "normal" }}>
                        {" "}
                        Explore Tour : Tour dengan fokus explore City tour
                        dengan hotel *3 &amp; *4 setara.
                      </span>
                    </li>
                  </ol>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Untuk informasi detail list hotel lengkapnya, akan kami
                      informasikan seminggu sebelum keberangkatan.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Tipe kamar seperti apa yang akan saya tempati selama
                      tour?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Harga yang tertera di itinerary adalah dengan
                      ketentuan menginap di hotel *3/*4 untuk 02 (dua) orang
                      dalam satu kamar (twin sharing). Besar kamar dan tipe
                      tempat tidur disesuaikan dengan hotel yang sudah
                      ditentukan. Namun, ada beberapa negara yang memiliki tipe
                      kamar dengan standar kecil. Ada pula yang bertipe Ondol /
                      Tatami (kamar tidur tradisional pada negara tertentu).
                      Sebelum perjalanan berlangsung, tour agent kami akan
                      mengkonfirmasi kembali tipe kamar seperti apa yang akan
                      ditempati selama perjalanan.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apa saya bisa memesan 3 orang/tempat tidur dalam 1
                      kamar?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Anda bisa memesan dengan tipe kamar Triple Room/Twin
                      Share Room. Namun kami tidak menjamin Anda akan mendapat 3
                      tempat tidur yang terpisah, mengingat tempat tidur yang
                      didapat tergantung dari kondisi hotel yang ada dan peserta
                      tidak mendapat pengurangan biaya.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apakah saya bisa ikut group tour tapi saya daftar
                      untuk diri sendiri (1 orang)?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Jika Anda berencana mendaftar grup untuk seorang diri
                      maka Anda akan dikenakan biaya Single Supplement, yakni
                      biaya tambahan yang dikenakan kepada seorang wisatawan
                      karena menggunakan satu (1) kamar hotel untuk diri
                      sendiri/tidak berbagi dengan orang lain. Dan biaya Single
                      Supplement per program tour akan berbeda-beda. Silahkan
                      menginformasikan hal ini kepada tour agent kami saat
                      melakukan pemesanan nantinya.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apakah dapat dijelaskan untuk penerbangan yang akan
                      digunakan dalam trip ini?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Untuk penerbangan yang akan digunakan merupakan tiket
                      pesawat internasional kelas ekonomi (non-refundable,
                      non-endorsable, non-reroutable berdasarkan harga tiket
                      group atau harga promosi lainnya). Untuk detail kode
                      pesawat dan waktu penerbangan dapat dilihat pada dokumen
                      itinerary yang diberikan oleh tour agent kami.&nbsp;
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apakah tiket penerbangan saya selama tour bisa di
                      upgrade menjadi kelas bisnis?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Untuk pengajuan upgrade tiket penerbangan dapat kami
                      bantu buatkan permohonan ke pihak maskapai. Namun kami
                      tidak dapat menjamin ketersediaan tiket yang ada di
                      maskapai. Anda dapat menginformasikan kepada tour agent
                      kami saat melakukan pemesanan tour.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Biaya apakah &ldquo;Airport Tax International&nbsp;
                      &amp; Surcharge&rdquo;?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : International Airport Tax &amp; Surcharge adalah biaya
                      tambahan yang dibebankan pada waktu keberangkatan dan
                      menghubungkan setiap penumpang di bandara. Hal ini
                      dikenakan oleh pemerintah atau perusahaan manajemen
                      bandara dan biayanya ditujukan untuk pendanaan perbaikan
                      bandara besar atau ekspansi atau layanan bandara.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Tour ini rute perjalanannya seperti apa?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Itinerary lengkap dapat Anda lihat pada{" "}
                    </span>
                    <a href="https://www.goldenrama.com/tours/favorite-switzerland-jungfraujoch-bernina-panoramic-train">
                      <span style={{ fontWeight: "normal" }}>link ini</span>
                    </a>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}
                      , perlu diketahui jadwal tour tertera dapat berubah
                      sewaktu-waktu mengikuti kondisi yang memungkinkan dengan
                      tanpa mengurangi isi dalam acara tour tersebut.
                    </span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      Jika Anda memiliki pertanyaan mengenai tour tersebut,
                      silahkan menghubungi tour agent kami di hotline (021) 2963
                      1888 atau menghubungi GRETA (Golden Rama E-travel
                      Assistant) di{" "}
                    </span>
                    <a href="https://wa.me/6281511221133">
                      <span style={{ fontWeight: "normal" }}>link ini</span>
                    </a>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}
                      kami siap membantu untuk memenuhi kebutuhan perjalanan
                      tour Anda.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Bagaimana jika saya ingin memesan land tour nya saja
                      tidak dengan tiket pesawat?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Untuk pengajuan land tour bisa menghubungi tour agent
                      kami di (021) 2963 1888 atau menghubungi GRETA (Golden
                      Rama E-travel Assistant) di{" "}
                    </span>
                    <a href="https://wa.me/6281511221133">
                      <span style={{ fontWeight: "normal" }}>link ini</span>
                    </a>
                    <span style={{ fontWeight: "normal" }}>
                      {" "}
                      kami siap membantu untuk memenuhi kebutuhan perjalanan
                      tour Anda.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Dokumen apa saja yang harus dipersiapkan untuk bisa
                      ikut tour Golden Rama?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Anda harus menyiapkan dokumen Paspor, VISA (jika
                      diperlukan), Asuransi perjalanan, dan dokumen lain yang
                      diperlukan untuk masuk dalam suatu negara disesuaikan
                      dengan ketentuan negara masing-masing.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Paket tour yang saya inginkan tidak tersedia, apa yang
                      harus saya lakukan?
                    </strong>
                    <span style={{ fontWeight: "normal" }}>&nbsp;</span>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Jika paket tour dengan destinasi tertentu tidak
                      tersedia, Anda dapat menghubungi tour agent kami di
                      hotline (021) 2963 1888 atau menghubungi GRETA (Golden
                      Rama E-travel Assistant) di{" "}
                    </span>
                    <a href="https://wa.me/6281511221133">
                      <span style={{ fontWeight: "normal" }}>link ini</span>
                    </a>
                    <span style={{ fontWeight: "normal" }}>
                      &nbsp; kami siap membantu untuk memenuhi kebutuhan
                      perjalanan tour Anda.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Bagaimana jika tanggal perjalanan yang saya inginkan
                      belum tersedia?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Kami mohon maaf jika tanggal keberangkatan yang Anda
                      inginkan belum tersedia. Jika berkenan bolehkah kami minta
                      data email Anda? sehingga kami dapat mengingatkan kembali
                      saat tour dengan keberangkatan yang di inginkan sudah kami
                      terbitkan. (kami akan masukkan data email Anda ke dalam
                      daftar tunggu kami)
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Saya ingin melakukan perpindahan destinasi tour tetapi
                      saya sudah melakukan DP. Apakah bisa?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Hal ini dapat dilakukan, untuk melakukan perpindahan
                      destinasi tour Anda dapat menghubungi tour Agent kami di
                      Hotline 021-2963 1888 atau menghubungi GRETA (Golden Rama
                      E-travel Assistant) di{" "}
                    </span>
                    <a href="https://wa.me/6281511221133">
                      <span style={{ fontWeight: "normal" }}>link ini</span>
                    </a>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Berapa nominal tip yang harus dibayarkan?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Untuk biaya tip di setiap program tour berbeda-beda
                      tergantung dengan destinasi yang di pilih. Untuk informasi
                      lengkapnya akan diinformasikan kembali oleh tour Agent
                      kami sebelum keberangkatan.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Bagaimana dengan proses pembuatan visa untuk tour?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Untuk pengajuan visa akan kami bantu proses
                      pengajuannya ke kedutaan. Anda hanya perlu melengkapi
                      dokumen-dokumen yang dibutuhkan oleh kedutaan dan
                      membayarkan biaya pembuatannya. Perlu diketahui ada
                      beberapa kedutaan yang mengharuskan peserta untuk datang
                      ke kedutaan melakukan wawancara atau scan sidik jari. Anda
                      perlu mempersiapkan waktu disaat mendapatkan jadwal
                      wawancara tersebut. Untuk detailnya akan diinformasikan
                      oleh tour agent kami sebelum keberangkatan.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Apakah selama tour sudah disediakan makan siang dan
                      makan malam?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Untuk makanan selama perjalanan tour sudah termasuk
                      didalam tour, namun perlu diperhatikan kembali ada
                      beberapa tour yang makan siang/malam nya tidak lengkap
                      dalam sehari. Untuk detail makanan selama tour Anda dapat
                      melihat ke list itinerary yang diberikan atau bertanya
                      langsung ke tour Agent kami.
                    </span>
                  </p>
                  <p>&nbsp;</p>
                  <p>
                    <strong>
                      Q : Saya seorang vegan, apakah saya bisa ikut tour?
                    </strong>
                  </p>
                  <p>
                    <span style={{ fontWeight: "normal" }}>
                      A : Mengenai varian makanan yang akan disediakan kami
                      tidak bisa menginformasikannya di awal pemesanan tour.
                      Karena konfirmasi mengenai makanan selama tour baru
                      tersedia kira-kira H-1 atau bahkan ketika tour berjalan.
                      Jika Anda memiliki kebutuhan khusus/alergi terhadap
                      makanan, mohon informasikan perihal ini kepada tour agent
                      kami saat pemesanan tour nantinya.
                    </span>
                  </p>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Hotel
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <Stack spacing={"10px"} as={"section"} id={"hotel"}>
                  <p>
                    <strong>
                      Q: Bagaimana cara reservasi hotel di Golden Rama?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Cara reservasi hotel melalui golden rama dapat dilakukan
                    dengan berbagai cara diantaranya :
                  </p>
                  <ol>
                    <li>
                      Reservasi melalui Website
                      <a href="http://goldenrama.com/">disini</a> kemudian Anda
                      akan diarahkan menuju halaman utama website Golden Rama
                      lalu klik hotel dibagian navigasi. Isi destinasi Anda,
                      tanggal check in dan check
                    </li>
                  </ol>
                  <p>
                    out, jumlah tamu dan kamar, serta preferensi Anda seperti
                    peringkat bintang,
                  </p>
                  <p>
                    harga, dan pilihan untuk bayar di hotel, lalu ketuk Cari.
                    Pastikan semua sudah sesuai keinginanmu, lalu klik Cari
                    hotel. Jika sudah cocok dengan yang Anda cari, klik check
                    out, dan pilih metode pembayaran.
                  </p>
                  <ol start="2">
                    <li>
                      Greta (Golden Rama Travel Assistant) di aplikasi
                      <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                        {" "}
                        Whatsapp Greta
                      </a>
                      .
                    </li>
                    <li>Hotline service kami di (021) 2963 1900</li>
                    <li>
                      Mengunjungi Kantor pusat dan kantor cabang Golden Rama
                      Tours &amp; Travel terdekat. Alamat Kantor pusat dan
                      kantor cabang Golden Rama Tours &amp; Travel dapat Anda
                      lihat
                      <a href="https://www.goldenrama.com/contact-us">
                        {" "}
                        disini
                      </a>
                    </li>
                  </ol>
                  <p>
                    <strong>
                      Q: Bagaimana cara saya untuk mengetahui ketersediaan kamar
                      di hotel yang telah dipilih?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Anda dapat menemukan informasi ketersediaan kamar pada
                    halaman website pilihan kamar hotel. Jika kamar sudah tidak
                    tersedia, maka pilihan kamar tersebut tidak akan muncul.
                    Namun Anda juga bisa konfirmasi terlebih dahulu kepada kami
                    melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    atau Hotline kami di (021) 2963 1900
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana cara saya untuk melihat fasilitas apa saja
                      yang disediakan di dalam kamar dan hotel?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Jika Anda ingin mengetahui fasilitas hotel yang tersedia,
                    Anda perlu melakukan pencarian hotel terlebih dahulu di
                    halaman website Golden Rama kemudian pilih hotel yang
                    diinginkan untuk melihat detail Hotel
                  </p>
                  <p>
                    Di dalam detail hotel juga terdapat fasilitas kamar, tap
                    tidak semua kamar dalam satu hotel akan memiliki fasilitas
                    kamar yang sama. Anda dapat melihat fasilitas kamar dengan
                    membuka detail kamar hotel dan lihat sesuai tipe kamar
                  </p>
                  <p>
                    <strong>
                      Q: Apakah harga yang ditampilkan di website berlaku untuk
                      per orang atau per kamar?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Harga yang tertera di halaman website berlaku untuk harga
                    per kamar. Apabila hotel yang Anda pilih memiliki kapasitas
                    kamar untuk 2 (dua) tamu, maka harga yang ditampilkan sudah
                    termasuk untuk 2 (dua) tamu. Pilihlah kamar yang sesuai
                    dengan kapasitas jumlah tamu.
                  </p>
                  <p>
                    <strong>
                      Q: Apakah saya dapat memesan kamar untuk setengah hari?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Pada umumnya, harga yang ditentukan akan berlaku untuk 1
                    (satu) kamar hotel per 1 (satu) malam, sehingga harga yang
                    dikenakan akan tetap sama meskipun hanya digunakan selama
                    setengah hari. Akan tetapi, ada beberapa hotel yang memiliki
                    penawaran tipe kamar transit yang penggunaannya di bawah 1
                    (satu) malam. Pastikan Anda membaca keterangan pada detail
                    kamar sebelum memesan.
                  </p>
                  <p>
                    <strong>
                      Q: Apakah saya akan dikenai biaya tambahan jika saya dan
                      pasangan membawa bayi untuk menginap dikamar yang
                      berkapasitas maksimum 2 orang?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Beberapa hotel ada yang memperbolehkan hal tersebut, namun
                    kembali lagi kepada kebijakan setiap hotel mengenai aturan
                    bayi dan anak-anak. Dalam hal ini Anda sebaiknya menghubungi
                    hotel terkait untuk mendapatkan informasi lebih lengkap
                    ataupun melalui kami di
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    dan Layanan Hotline di (021) 2963 1900
                  </p>
                  <p>
                    <strong>
                      Q: Apakah pembayaran kartu kredit dapat dilakukan jika
                      terdapat perbedaan antara nama di kartu kredit dengan nama
                      tamu?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Saat Anda menggunakan kartu kredit yang berbeda nama dengan
                    nama tamu maka transaksi tetap dapat dilakukan. Hal ini
                    berlaku jika akan memesankan untuk orang lain. Namun
                    transaksi dapat dibatalkan jika ternyata penggunaan kartu
                    kredit tidak diketahui oleh pemilik.
                  </p>
                  <p>
                    <strong>
                      Q: Apakah saya dapat mengajukan permintaan khusus kepada
                      hotel? (misal kamar non smoking, view kamar, dll)
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Ketika memesan hotel, Anda dapat menginformasikan permintaan
                    tersebut pada kami yang akan kami sampaikan kepada pihak
                    Hotel. Namun, pengajuan permintaan khusus tidak selalu dapat
                    dipenuhi karena tergantung pada ketersediaan dan kebijakan
                    Hotel. Sekadar informasi, ada juga permintaan khusus yang
                    akan dikenakan biaya tambahan.
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana cara untuk mengajukan extra bed?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Untuk mengajukan extra bed Anda dapat menghubungi pihak
                    hotel melalui nomor telepon yang terdapat pada voucher untuk
                    mengecek ketersediaan nya. Anda mungkin akan dikenakan biaya
                    tambahan untuk Extra Bed sesuai kebijakan hotel.
                  </p>
                  <p>
                    Jika Anda membutuhkan bantuan untuk menghubungi pihak hotel,
                    silakan hubungi kami melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    dan Layanan Hotline di (021) 2963 1900
                  </p>
                  <p>
                    <strong>
                      Q: Dimanakah saya dapat menerima voucher hotel setelah
                      reservasi?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Anda dapat menerima voucher hotel otomatis setelah reservasi
                    melalui email dan pesan singkat Whatsapp. mohon melakukan
                    cek folder spam/junk di email Anda dan pastikan koneksi
                    internet Anda tetap terhubung. Namun jika Anda masih
                    terkendala, Anda dapat menghubungi kami melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    atau Hotline kami di (021) 2963 1900
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimanakah caranya mengubah reservasi yang sudah saya
                      buat? (permintaan reschedule atau ganti tipe kamar)
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Sebelum melakukan hal ini, mohon periksa kembali keterangan
                    di voucher hotel Anda, apakah memungkinkan untuk
                    memodifikasi reservasi. Hal ini biasanya akan disesuaikan
                    dengan tipe kamar yang dipilih, pastikan Anda sudah membaca
                    semua syarat dan ketentuan yang ada di setiap tipe kamar.
                    Setiap hotel memiliki kebijakan berbeda-beda mengenai aturan
                    ini dikarenakan ada kemungkinan selisih biaya yang timbul
                    akibat harga reservasi baru lebih tinggi dari reservasi awal
                    dan akan dibebankan kepada anda. Untuk info lebih lanjut
                    mengenai perubahan ini, silakan menghubungi kami melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    atau Hotline kami di (021) 2963 1900 dengan melampirkan
                    dokumen pendukung speti voucher dan tiket penerbangan.
                    Kemudian akan kami lakukan verifikasi terlebih dahulu
                    sebelum kami bantu untuk mengajukan permohonan Anda ke pihak
                    supplier atau hotel terkait. Apabila disetujui / diterima,
                    maka permintaan perubahan akan diproses sesuai dengan syarat
                    dan ketentuan yang berlaku
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana saya menemukan lokasi hotel yang dipesan?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Untuk lebih jelas mengenai alamat dan lokasi Hotel Anda
                    dapat menghubungi kami melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    dan Layanan Hotline di (021) 2963 1900
                  </p>
                  <p>
                    <br />
                    <br />
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana cara melakukan check in di hotel?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Untuk melakukan check in , Anda wajib menunjukkan Kartu
                    Identitas Diri (KTP, SIM, atau Paspor) dan voucher hotel
                    yang sudah dikirimkan melalui email dan Whatsapp
                  </p>
                  <p>
                    Khusus hotel berbasis syariah, jika Anda check in dengan
                    pasangan maka hotel akan meminta Anda untuk menunjukkan
                    bukti nikah sebagai syarat check in
                  </p>
                  <p>
                    Sebagai informasi tambahan beberapa hotel memiliki kebijakan
                    untuk memberikan Deposit atau Jaminan pada saat check in
                    untuk biaya tidak terduga. Untuk nominal deposit akan
                    mengikuti kebijakan hotel yang berlaku.
                  </p>
                  <p>
                    <strong>
                      Q: Apakah yang dapat saya lakukan apabila mengalami
                      kendala saat melakukan check in?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Jika Anda mengalami kendala saat check in mohon
                    diinformasikan kepada kami melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    dan Layanan Hotline di (021) 2963 1900
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana cara melakukan check in lebih awal dari waktu
                      yang telah ditentukan?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Sebelumnya kami informasikan kembali bahwa setiap hotel
                    memiliki kebijakan yang berbeda-beda, ada hotel yang
                    memperbolehkan <em>check in</em> lebih awal, pada umumnya
                    ketika hotel tidak dalam kondisi ramai atau ada kamar yang
                    tersedia di jam saat Anda <em>check in</em>. Namun, ada juga
                    hotel yang mengenakan biaya tambahan untuk <em>check in</em>{" "}
                    lebih awal. Oleh karena itu kami menyarankan Anda untuk
                    menghubungi hotel terkait sebelum jadwal <em>check in</em>{" "}
                    Anda. Selain itu Anda juga bisa menghubungi kami melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    atau Hotline kami di (021) 2963 1900
                  </p>
                  <p>
                    <strong>
                      Q: Apakah saya dapat melakukan check out diatas atau
                      melebihi waktu yang sudah ditentukan?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Kami informasikan bahwa setiap hotel memiliki ketentuan
                    masing-masing, Beberapa hotel ada yang memperbolehkan{" "}
                    <em>check out</em> di atas waktu yang ditentukan, pada
                    umumnya ketika hotel tidak terlalu ramai atau ada kamar yang
                    masih tersedia. Namun, ada juga hotel yang mengenakan biaya
                    tambahan untuk <em>check out</em> di atas waktu yang
                    ditentukan.
                  </p>
                  <p>
                    <strong>
                      Q: Apakah yang harus saya lakukan jika ada barang yang
                      tertinggal di kamar hotel dan saya sudah check out dari
                      kamar hotel?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Jika ada barang yang tertinggal di hotel, anda dapat
                    menghubungi pihak hotel melalui nomor telepon yang terdapat
                    pada voucher untuk dilakukan pengecekkan secara menyeluruh
                    di bagian kamar. Selain itu Anda dapat memberikan deskripsi
                    yang detil mengenai barang tersebut berikut dengan lokasi
                    terakhirnya untuk mempermudah pencarian.
                  </p>
                  <p>
                    Jika Anda membutuhkan bantuan untuk menghubungi pihak hotel,
                    silakan hubungi kami melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    dan Layanan Hotline di (021) 2963 1900
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana Proses Pemintaan Pembatalan dan Refund
                      (Pengembalian Dana) Reservasi Hotel?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Sebelum melakukan permintaan pembatalan dan refund atas
                    reservasi yang sudah dilakukan, dimohon agar anda dapat
                    menyertakan dokumen pendukung seperti surat opname dari
                    rumah sakit, tiket penerbangan baru, dan dokumen lain yang
                    dapat dijadikan bukti alasan pembatalan reservasi. Jika
                    dokumen sudah lengkap maka anda dapat menghubungi kami
                    melalui
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    dan Layanan Hotline di (021) 2963 1900 agar kami bantu
                    verifikasi dan mengajukan permohonan Anda ke pihak
                    supplier/hotel. Semua keputusan bisa atau tidaknya
                    permintaan pembatalan ditentukan dari kebijakan pihak
                    supplier / hotel terkait. Dan apabila pengajuan pembatalan
                    disetujui / diterima oleh pihak supplier/hotel, maka
                    pengembalian dana akan diproses sesuai dengan syarat dan
                    ketentuan yang berlaku.
                  </p>
                  <p>
                    <strong>
                      Q: Berapa lama proses refund atas voucher hotel?
                    </strong>
                  </p>
                  <p>A:</p>
                  <p>
                    Proses <em>refund</em> voucher hotel memerlukan waktu
                    sekitar 1-2 bulan dimulai dari keputusan persetujuan refund
                  </p>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Cruise
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <Stack spacing={"10px"} as={"section"} id={"cruise"}>
                  <p>
                    <strong>
                      Q : Bagaimana saya dapat melihat daftar harga Cruise?
                    </strong>
                  </p>
                  <p>A :&nbsp;</p>
                  <p>
                    Anda dapat melihat daftar produk Cruise
                    <a href="https://www.goldenrama.com/cruises">Disini</a>.
                    Ataupun datang ke Kantor pusat dan kantor cabang Golden Rama
                    Tours &amp; Travel terdekat. Alamat Kantor pusat dan kantor
                    cabang Golden Rama Tours &amp; Travel dapat anda lihat
                    <a href="https://www.goldenrama.com/contact-us">disini</a>.
                  </p>
                  <p>
                    <strong>
                      Q : Bagaimana saya mengetahui Jadwal keberangkatan/
                      ketersedian produk Cruise?
                    </strong>
                  </p>
                  <p>A :&nbsp;</p>
                  <p>
                    Anda dapat menghubungi kami di Greta (Golden Rama Travel
                    Assistant) di aplikasi
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>
                    .
                  </p>
                  <p>
                    <strong>Q : Apakah ada promo khusus Cruise?</strong>
                  </p>
                  <p>A :&nbsp;</p>
                  <p>
                    Untuk mengetahui info promo khusus Cruise Anda dapat
                    menghubungi kami di Greta (Golden Rama Travel Assistant) di
                    aplikasi
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>
                    .
                  </p>
                  <p>
                    Anda juga dapat menghubungi Hotline Cruise kami di (021)
                    2963 1888 ataupun datang ke Kantor pusat dan kantor cabang
                    Golden Rama Tours &amp; Travel terdekat. Alamat Kantor pusat
                    dan kantor cabang Golden Rama Tours &amp; Travel dapat anda
                    lihat
                    <a href="https://www.goldenrama.com/contact-us">disini</a>.
                  </p>
                  <p>
                    <br />
                    <br />
                    <br />
                  </p>
                  <p>
                    <strong>
                      Q : Bagaimana cara saya mengajukan proses refund Cruise?
                    </strong>
                  </p>
                  <p>A :&nbsp;</p>
                  <p>
                    Anda dapat menghubungi kami di Greta (Golden Rama Travel
                    Assistant) di aplikasi
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>
                    . Anda juga dapat menghubungi Hotline Cruise kami di (021)
                    2963 1888 ataupun datang ke Kantor pusat dan kantor cabang
                    Golden Rama Tours &amp; Travel terdekat. Alamat Kantor pusat
                    dan kantor cabang Golden Rama Tours &amp; Travel dapat anda
                    lihat
                    <a href="https://www.goldenrama.com/contact-us">disini</a>.
                  </p>
                  <p>
                    Golden Rama akan melakukan pengecheckan untuk produk cruise
                    yang di booking ke pihak Cruise line, Jika pengajuan refund
                    disetujui/ diterima oleh Cruise line maka dana akan diproses
                    refund. Dana refund akan dikirimkan setelah Golden Rama
                    menerima refund dari Cruise line.
                  </p>
                  <p>
                    <strong>
                      Q : Berapa dana yang akan Saya terima dari pengajuan
                      refund Cruise?
                    </strong>
                  </p>
                  <p>A :&nbsp;</p>
                  <p>
                    Untuk dana refund Cruise jumlah yang diterima bisa berbeda
                    tergantung dari kebijakan pihak Cruise line, alasan refund
                    Anda, dan jarak antara tanggal pengajuan refund dan tanggal
                    keberangkatan.
                  </p>
                  <p>Hal &ndash; Hal berikut yang tidak bisa di refund :</p>
                  <ul>
                    <li>&nbsp;Admin Fee IDR 500.000/pax</li>
                    <li>
                      &nbsp;Cruise dengan kode promo NRD (Non-Refundable
                      Deposit)
                    </li>
                  </ul>
                  <p>
                    <strong>
                      Q : Mengapa refund Cruise Saya tidak bisa diproses?
                    </strong>
                  </p>
                  <p>A :&nbsp;</p>
                  <p>
                    Berikut hal yang perlu diperhatikan alasan refund Cruise
                    Anda tidak dapat diproses:
                  </p>
                  <ul>
                    <li>Tiket Cruise Anda sudah digunakan</li>
                    <li>
                      Tiket Cruise Anda sudah dijadikan FCC (Future Cruise
                      Credit)
                    </li>
                  </ul>
                  <p>
                    <strong>
                      Q : Apakah Saya bisa mengajukan Reschedule Cruise?
                    </strong>
                  </p>
                  <p>A :</p>
                  <ul>
                    <li>
                      Golden Rama akan melakukan pengecheckan untuk produk
                      cruise yang dibooking
                    </li>
                    <li>
                      Apabila disetujui, ketersediaan reschedule bergantung pada
                      ketersediaan cabin dan harga Cruise di bookingan baru
                    </li>
                    <li>
                      Jika harga Cruise baru lebih tinggi dari harga Cruise
                      awal, Anda akan dikenakan selisih biayanya
                    </li>
                    <li>
                      Umumnya, hanya dapat mengganti tanggal sailing dan
                      category cabin, tergantung ketersediaan. Penggantian hanya
                      dapat dilakukan 1x di Cruise line yang sama
                    </li>
                    <li>
                      Setiap Cruise line memiliki batas waktu reschedule yang
                      berbeda. Untuk mengetahui lebih lanjut tentang kebijakan
                      tiap Cruise line, Team Cruise kami akan cek kepada pihak
                      Cruise line.
                    </li>
                  </ul>
                  <p>
                    <strong>
                      Q : Apakah bisa mengajukan reschedule setelah tanggal
                      sailing sudah lewat?
                    </strong>
                  </p>
                  <p>A :&nbsp;</p>
                  <p>
                    Tidak bisa. Karena masa berlaku Cruise hanya sailing date
                    yang telah ditetapkan.
                  </p>
                  <p>
                    <strong>
                      Q : Bagaimana jika sailing dibatalkan oleh pihak Cruise
                      line?
                    </strong>
                  </p>
                  <p>A :&nbsp;</p>
                  <p>
                    Jika sailing dibatalkan oleh pihak Cruise line, maka Anda
                    dapat mengajukan refund atau bisa juga dijadikan FCC (Future
                    Cruise Credit).
                  </p>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem border={0} pb={"12px"}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Heading fontSize={"md"} color={"brand.blue.400"} as={"h2"}>
                    Flights
                  </Heading>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel py={"16px"}>
                <Stack spacing={"10px"} as={"section"} id={"flight"}>
                  <p>
                    <strong>
                      Q : Bagaimana saya memesan tiket pesawat di Golden Rama
                      Tours &amp; Travel?
                    </strong>
                  </p>
                  <p>
                    <strong>A : </strong>
                  </p>
                  <p>
                    Anda dapat melakukan pemesanan tiket pesawat melalui website
                    Golden Rama{" "}
                    <a href="https://www.goldenrama.com/flights">disini</a> ,
                    atau melalui Greta (Golden Rama Travel Assistant) di
                    aplikasi{" "}
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>
                    .&nbsp;
                  </p>
                  <p>
                    Anda juga dapat menghubungi Hotline tiket kami di (021) 2963
                    1999 ataupun datang ke Kantor pusat dan kantor cabang Golden
                    Rama Tours &amp; Travel terdekat. Alamat Kantor pusat dan
                    kantor cabang Golden Rama Tours &amp; Travel dapat anda
                    lihat{" "}
                    <a href="https://www.goldenrama.com/contact-us">disini</a>
                    .&nbsp;
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana cara saya mengajukan refund dan reschedule
                      tiket pesawat?
                    </strong>
                  </p>
                  <p>
                    <strong>A : </strong>
                  </p>
                  <p>
                    Golden Rama akan membantu Anda mengajukan permohonan refund
                    dan tiket melalui Greta (Golden Rama Travel Assistant) di
                    aplikasi{" "}
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>
                    .&nbsp;
                  </p>
                  <p>
                    Anda juga dapat menghubungi Hotline tiket kami di (021) 2963
                    1999 ataupun datang ke Kantor pusat dan kantor cabang Golden
                    Rama Tours &amp; Travel terdekat. Alamat Kantor pusat dan
                    kantor cabang Golden Rama Tours &amp; Travel dapat anda
                    lihat{" "}
                    <a href="https://www.goldenrama.com/contact-us">disini</a>.
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana proses pengajuan refund tiket pesawat?
                    </strong>
                  </p>
                  <p>
                    <strong>A : </strong>
                  </p>
                  <p>
                    Golden rama akan melakukan pengecheckan terhadap kebijakan
                    dari kelas dan jenis tiket pesawat yang Anda beli. Beberapa
                    kelas tiket pesawat tidak dapat direfund ataupun
                    direschedule.&nbsp;
                  </p>
                  <p>
                    Golden rama akan membantu mengajukan persetujuan refund
                    terhadap maskapai terkait dan apabila disetujui maka dana
                    anda akan dikembalikan maximum 90 hari setelah pengajuan
                    refund disetujui oleh maskapai.&nbsp;
                  </p>
                  <p>
                    <br />
                    <br />
                  </p>
                  <p>
                    <strong>
                      Q : Dokumen apa saja yang harus saya siapkan untuk
                      pembatalan pemesanan di Golden Rama Tours and Travel ?
                    </strong>
                  </p>
                  <p>
                    <strong>A : </strong>
                  </p>
                  <p>
                    Anda perlu menyiapkan dokumen pendukung yang diperlukan
                    mengacu pada alasan pembatalan. Contohnya, jika dikarenakan
                    pembatalan maskapai, sertakan bukti informasi pembatalan
                    atau perubahan dari maskapai. Jika dikarenakan sakit, bisa
                    menunjukkan surat keterangan dari dokter yang
                    menginformasikan tidak bisa melakukan perjalanan. Jika ada
                    tamu atau penumpang yang meninggal dunia, menyertakan surat
                    keterangan kematian. Bisa atau tidaknya pengajuan diterima
                    tergantung dari kebijakan dari maskapai yang berlaku.
                  </p>
                  <p>
                    <strong>
                      Q: Berapa besar dana refund yang akan saya terima dari
                      pembatalan tiket pesawat saya ?
                    </strong>
                  </p>
                  <p>
                    <strong>A : </strong>
                  </p>
                  <p>
                    Besaran dana refund yang akan anda terima dari pembatalan
                    tiket pesawat bervariasi tergantung dari kebijakan pihak
                    maskapai, alasan pembatalan tiket pesawat anda yang disertai
                    bukti dan jarak antara tanggal pengajuan dan tanggal
                    keberangkatan.&nbsp;
                  </p>
                  <p>
                    Biaya administrasi saat pembelian tiket tidak dapat
                    direfund.&nbsp;
                  </p>
                  <p>
                    <strong>
                      Q: Bagaimana proses pengajuan reschedule tiket pesawat?
                    </strong>
                  </p>
                  <p>
                    <strong>A : </strong>
                  </p>
                  <p>
                    Golden rama akan melakukan pengecheckan terhadap kebijakan
                    dari kelas dan jenis tiket pesawat yang Anda beli. Beberapa
                    kelas tiket pesawat tidak dapat direfund ataupun
                    direschedule.&nbsp;
                  </p>
                  <p>
                    Golden rama akan membantu anda mengajukan persetujuan
                    reschedule terhadap maskapai terkait. Ketersediaan
                    reschedule tiket pesawat anda bergantung pada ketersediaan
                    kursi maskapai dan kebijakan maskapai. Apabila harga
                    penerbangan baru lebih tinggi dari harga tiket penerbangan
                    yang telah anda beli, maka anda akan dikenakan selisih harga
                    tiket.
                  </p>
                  <p>
                    Setiap maskapai juga memiliki batas waktu reschedule yang
                    berbeda.&nbsp;
                  </p>
                  <p>
                    <strong>
                      Q : Apakah saya bisa membatalkan salah satu rute
                      penerbangan untuk tiket pergi-pulang saya?
                    </strong>
                  </p>
                  <p>
                    <strong>A :</strong>
                  </p>
                  <p>
                    Bila anda ingin membatalkan salah satu rute dari tiket
                    pulang pergi akan mengacu pada kebijakan masing-masing
                    maskapai. Anda bisa menanyakan lebih lanjut perihal
                    kebijakan tersebut melalui Greta (Golden Rama Travel
                    Assistant) di aplikasi{" "}
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>
                    .&nbsp;
                  </p>
                  <p>&nbsp;Dengan senang hati kami akan membantu.</p>
                  <p>
                    <strong>
                      Q : Apabila tiket penerbangan saya berjumlah lebih dari
                      satu penumpang, apakah saya bisa membatalkan salah satu
                      penumpang saja?
                    </strong>
                  </p>
                  <p>
                    <strong>A :</strong>
                  </p>
                  <p>
                    Anda dapat mengajukan untuk pembatalan 1 (satu) penumpang
                    saja dan pembatalan ini mengikuti kebijakan dari maskapai.
                    Anda bisa menanyakan lebih lanjut perihal kebijakan tersebut
                    melalui Greta (Golden Rama Travel Assistant) di aplikasi{" "}
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>
                    .&nbsp;
                  </p>
                  <p>Dengan senang hati kami akan membantu.</p>
                  <p>
                    <strong>
                      Q : Apakah saya bisa mendapatkan pengembalian dana /
                      refund apabila terjadi perubahan atau pembatalan dari
                      maskapai?
                    </strong>
                  </p>
                  <p>
                    <strong>A:</strong>
                  </p>
                  <p>
                    Beberapa maskapai terkadang melakukan pembatalan atau
                    perubahan jadwal penerbangan secara sepihak, dan setiap
                    maskapai memiliki ketentuan berbeda mengenai keadaan ini.
                  </p>
                  <p>
                    Apabila hal ini terjadi, anda bisa menghubungi kami melalui
                    Greta (Golden Rama Travel Assistant) di aplikasi{" "}
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>
                    .&nbsp;
                  </p>
                  <p>Dengan senang hati kami akan membantu.</p>
                  <p>
                    <strong>
                      Q : Saya melakukan kesalahan saat menginput detail no
                      passport, apakah saya bisa mengganti detail nomor paspor
                      saya untuk tiket penerbangan internasional ?
                    </strong>
                  </p>
                  <p>
                    <strong>A :</strong>
                  </p>
                  <p>
                    Apabila anda melakukan kesalahan saat memasukan detail nomor
                    passport, anda bisa mengajukan perubahan nomor data paspor
                    penumpang dengan cara menghubungi kami melalui Greta (Golden
                    Rama Travel Assistant) di aplikasi{" "}
                    <a href="https://api.whatsapp.com/send/?phone=6281511221133&amp;text&amp;type=phone_number&amp;app_absent=0">
                      Whatsapp Greta
                    </a>{" "}
                    dengan menyertakan bukti dengan menunjukkan halaman awal
                    Paspor penumpang yang ingin dilakukan perubahan data paspor.
                  </p>
                  <p>Dengan senang hati kami akan membantu.</p>
                  <p>
                    Untuk perubahan detail nama ataupun keterangan lainnya akan
                    disesuaikan dengan kebijakan masing masing maskapai.
                  </p>
                </Stack>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Stack>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async (ctx) => {
  const getFaq = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL_API}/faqs`
      );
      return Promise.resolve(response.data.data);
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const faq = [
    {
      category: "general",
      question: "Question",
      answer: "Answer",
    },
  ];
  // const faq = await getFaq();

  return {
    props: {
      faq,
      meta: {
        title: "Frequently Asked Questions",
      },
    },
    revalidate: 10,
  };
};

export default FAQ;
