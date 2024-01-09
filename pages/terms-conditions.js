/* eslint-disable react/no-unescaped-entities */
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  ListItem,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import Layout from "../src/components/layout";

const TermsAndConditions = ({ meta }) => {
  return (
    <Layout pagetitle={"Terms and Conditions"} meta={meta}>
      <Box
        maxW={{ lg: "container.lg", xl: "container.xl" }}
        mx={"auto"}
        py={"24px"}
      >
        <Box>
          <Heading fontSize={"xl"}>Syarat dan Ketentuan</Heading>
        </Box>

        <Text textAlign={"center"}>&nbsp;</Text>

        <Box>
          www.goldenrama.com (untuk selanjutnya disebut “Web”) dimiliki dan
          dioperasikan oleh PT Golden Rama Express (untuk selanjutnya disebut
          “Perusahaan”). Web merupakan layanan yang memberikan informasi secara
          umum dan khusus kepada masyarakat yang menggunakan jasa dan/atau
          mengakses Web (untuk selanjutnya disebut “Pelanggan”) dan menjadi aset
          Perusahaan yang terpenting adalah menjaga hubungan Perusahaan dengan
          Pelanggan, demikian berkaitan dengan informasi-informasi pribadi yang
          Pelanggan berikan (untuk selanjutnya disebut “Data Pribadi”).
          Berkaitan dengan Data Pribadi tersebut, berikut Perusahaan jelaskan
          bagaimana pengumpulan, penggunaan, serta pemrosesan informasi yang
          Perusahaan kumpulkan tentang Data Pribadi yang dapat diidentifikasi
          secara pribadi terkait dengan layanan yang tersedia melalui Web.
        </Box>

        <Box>&nbsp;</Box>

        <Box>
          Dengan memberikan dan memasukan Data Pribadi ke dalam Web, Pelanggan
          secara sadar telah setuju untuk memberikan Data Pribadi kepada
          Perusahaan untuk digunakan demi kepentingan dan tujuan Pelanggan dalam
          menggunakan Web. Persetujuan yang diberikan Pelanggan dimaksud
          merupakan persetujuan yang diberikan secara tegas yang disampaikan
          secara elektronik.
        </Box>

        <Box>&nbsp;</Box>

        <Box>
          Kami tidak dapat menjamin bahwa harga pemesanan yang tertera dalam
          situs ini tidak akan terdapat gangguan atau kesalahan sistem yang
          menyebabkan harga pemesanan tersebut tidak akurat atau tidak sesuai
          dengan harga yang wajar dan menyebabkan ada kekeliruan pengguna saat
          melakukan pemesanan dengan harga tidak wajar tersebut, dan jika hal
          tersebut terjadi dan pengguna sudah melakukan pembayaran, maka kami
          tetap berhak untuk melakukan pembatalan sepihak dan hanya menjamin
          pengembalian dana (refund) kepada pengguna situs ini.
        </Box>

        <Box>&nbsp;</Box>

        <Accordion allowMultiple={true} allowToggle mx="-24px">
          {/* begin third party */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Penyedia Layanan Perjalanan Pihak Ketiga
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Pelanggan dapat terikat oleh syarat dan ketentuan yang
                diberlakukan oleh penyedia layanan perjalanan, di mana
                Perusahaan bertindak sebagai agen penyedia jasa, termasuk
                kondisi pengangkutan, pengembalian dan pembatalan penerbangan,
                dan lain-lain.
              </Box>

              <Box>&nbsp;</Box>

              <Box>
                Perusahaan tidak bertanggung jawab atas klaim terhadap tidak
                terpenuhinya atau ketidakpuasan akan produk dan jasa yang dibeli
                oleh Perusahaan atas nama Pelanggan dari penyedia pihak ketiga
                dan distributor, seperti maskapai penerbangan, hotel, Golden
                Rama Tour, perusahaan asuransi, dan entitas lainnya. Perlu
                Pelanggan ketahui bahwa sewaktu-waktu perusahaan penerbangan
                dan/atau penyedia jasa perjalanan layanan membuat reservasi
                lebih banyak dari tempat yang tersedia, atau menjadwal ulang
                penerbangan. Berkaitan dengan hal tersebut, Perusahaan tidak
                bertanggung jawab oleh hal-hal atau kebijakan yang sewaktu-waktu
                diterapkan oleh pihak ketiga.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end third party */}
          {/* begin privacy policy */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Kebijakan Privasi
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Perusahaan menjamin terlindunginya privasi Pelanggan. Silahkan
                klik link di bawah ini untuk meninjau Kebijakan Privasi
                Perusahaan saat ini, yang juga mengatur penggunaan Web oleh
                Pelanggan, untuk memahami kebijakan Perusahaan: Kebijakan
                Privasi.
              </Box>

              <Box>&nbsp;</Box>

              <Box>
                Seluruh syarat dan ketentuan mengenai perlindungan Data Pribadi
                Pelanggan akan tunduk dan diatur berdasarkan Kebijakan Privasi
                Perusahaan di atas.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end privacy policy */}
          {/* begin usage policy */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Penggunaan Situs
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Perusahaan memiliki kuasa untuk mengontrol akses ke Web dan
                memiliki hak penuh untuk sewaktu-waktu mengubah, memodifikasi,
                mengganti, menukar, menahan atau menghapus; untuk kepentingan
                keamanan atau dalam keadaan mendesak atau force majeure; tanpa
                pemberitahuan sebelumnya; serta memiliki kewajiban untuk
                mengganti kerugian atau membayar kompensasi kepada Pelanggan.
                Selain hal tersebut, perlu Pelanggan perhatikan beberapa
                ketentuan berikut ini:
                <UnorderedList>
                  <ListItem>
                    Pelanggan hanya dapat menggunakan Web untuk melakukan
                    kegiatan yang legal dan sah menurut peraturan
                    perundang-undangan yang berlaku di Indonesia dalam hal
                    membuat pemesanan atau bertransaksi untuk diri sendiri dan
                    atau orang lain yang memiliki kuasa untuk bertindak secara
                    legal di mata hukum;
                  </ListItem>
                  <ListItem>
                    Anak di bawah usia 18 tahun tidak memenuhi syarat untuk
                    menggunakan layanan apapun di Web Perusahaan;
                  </ListItem>
                  <ListItem>
                    Pelanggan dapat mengunduh salinan isi konten Web untuk
                    keperluan pribadi;
                  </ListItem>
                  <ListItem>
                    Pelanggan tidak boleh menghapus atau menghilangkan merek
                    dagang, hak cipta, atau identitas kepemilikan lainnya;
                  </ListItem>
                  <ListItem>
                    Pelanggan tidak diperkenankan mengunduh, menyalin ulang,
                    memodifikasi, menjual, memasarkan, atau mendistribusikan
                    salah satu bagian atau seluruh konten yang ada di Web tanpa
                    persetujuan tertulis dari Perusahaan.
                  </ListItem>
                </UnorderedList>
              </Box>

              <Box>&nbsp;</Box>

              <Box>
                Pelanggan juga tidak diperkenankan untuk:
                <UnorderedList>
                  <ListItem>
                    Mengunggah, mengirim, atau mendistribusikan informasi apapun
                    di Web yang merupakan konten vulgar, merusak, illegal,
                    bersifat menghina, dan melanggar hak orang lain;
                  </ListItem>
                  <ListItem>
                    Melakukan percobaan pemalsuan atau penipuan dalam membuat
                    pemesanan dan melakukan transaksi keuangan tak berizin;
                  </ListItem>
                  <ListItem>
                    Menggunakan dalam bentuk apapun: perangkat lunak, peralatan
                    atau melakukan percobaan pengunggahan file dengan data
                    perusak dan/atau mengandung virus yang akan mengganggu
                    operasional atau fungsi dari Web, atau merusak tatanan
                    tampilan Web secara keseluruhan;
                  </ListItem>
                  <ListItem>
                    Perusahaan memegang hak penuh untuk menolak akses menuju Web
                    dan/atau membatalkan pemesanan kapan saja dan dimana saja,
                    jika ada pengguna yang mencoba untuk melanggar batas
                    ketentuan yang telah ditetapkan dalam kebijakan ini
                  </ListItem>
                </UnorderedList>
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end usage policy */}
          {/* begin guarantee */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Tidak Ada Penjaminan
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Anda dengan ini menyatakan sepakat dan setuju bahwa sejauh mana
                diizinkan oleh peraturan yang berlaku:
              </Box>

              <OrderedList>
                <ListItem>
                  Jasa dan konten dari situs ini disediakan dengan ketentuan
                  “sebagaimana adanya” dan “sebagaimana tersedia”. Kami dengan
                  ini menyatakan dengan tegas bahwa kami tidak melakukan
                  penjaminan atau garansi apapun baik secara tegas maupun
                  tersirat, sehubungan dengan dapat diperdagangkan suatu produk
                  atau jasa, atau kesiapan suatu produk dan jasa yang kami
                  sediakan untuk suatu tujuan tertentu dan terhadap pelanggaran
                  yang berlaku;
                </ListItem>
                <ListItem>
                  Kami tidak menjamin bahwa (i) fungsi dan jasa yang disediakan
                  dari situs ini akan bebas dari gangguan atau kesalahan apapun
                  termasuk keamanan dari situs inI; (ii) kelalaian akan
                  diperbaiki; atau (iii) situs ini atau server yang menyediakan
                  jasa bebas dari virus atau komponen membahayakan;
                </ListItem>
                <ListItem>
                  Kami tidak menjamin mengenai ketepatan, keaslian, integritas
                  atau kualitas dari konten, situs atau sumber yang ada pada dan
                  dari situs, termasuk, namun tidak terbatas pada penjaminan
                  konten, situs atau sumber yang bebas dari bahan yang dapat
                  menyerang, tidak senonoh, atau dapat diperdebatkan;
                </ListItem>
                <ListItem>
                  Tiap bahan yang diunduh atau diperoleh melalui penggunaan jasa
                  ini adalah tanggungjawab dan risiko anda sendiri. Anda akan
                  bertanggungjawab sepenuhnya terhadap kerusakan sistem komputer
                  atau kehilangan data yang diakibatkan dari pengunduhan materi
                  yang ada.
                </ListItem>
              </OrderedList>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end guarantee */}
          {/* begin limitation of liability */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Pembatasan Pertanggungjawaban
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Kami tidak akan bertanggungjawab terhadap kerusakan dari
                penggunaan Situs ini baik secara langsung maupun tidak langsung,
                baik khusus atau tambahan sebagai penggunaan Situs ini atau
                penggunaan dari tautan yang ada pada Situs walaupun kami telah
                diberitahu mengenai kemungkinan kerugian atau kerusakan yang
                dapat terjadi. Perbaikan yang dapat diberikan pada anda adalah
                pemberhentian dari penggunaan Situs ini.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end limitation of liability */}
          {/* begin price */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Harga
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Kecuali secara tegas dinyatakan, semua harga di Situs ini sudah
                termasuk pajak pertambahan nilai (PPN). Anda wajib membayar
                penuh jumlah yang tertera.
              </Box>

              <Box>&nbsp;</Box>

              <Box>
                Semua harga produk dan layanan yang tertera dapat berubah
                tergantung dari ketersediaan tempat&nbsp; yang dinyatakan oleh
                penyedia, dan harga tersebut belum final sampai produk dan
                layanan yang bersangkutan terbayar penuh. Untuk beberapa
                pemesanan, Anda akan diminta untuk membayar biaya
                pemesanan/booking fee. Beberapa pajak bandara bukan bersifat
                prabayar, jadi Anda harus membayar ketika diperlukan. Beberapa
                maskapai penerbangan atau penyedia layanan perjalanan telah
                memperkenalkan biaya bahan bakar yang mungkin tidak tertera
                dalam harga yang ditunjukkan dan akan menjadi biaya tambahan.
                Untuk layanan perjalanan seperti tiket pesawat, harga, kondisi
                tarif, dan kelas dapat berubah sewaktu-waktu tanpa
                pemberitahuan. Pembatasan routing dan kondisi khusus lainnya
                mungkin berlaku.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end price */}
          {/* begin additional hotel price */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Biaya Tambahan Hotel
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <UnorderedList>
                <ListItem>
                  Harap diketahui bahwa semua harga untuk reservasi hotel yang
                  diberikan melalui Situs kami ("Harga Hotel") berdasarkan pada
                  pilihan Anda, seperti untuk periode tinggal yang diminta dan
                  jumlah tamu, kecuali ditentukan lain. Tarif reservasi kamar
                  hotel dikutip per kamar dan per malam. Anda bertanggung jawab
                  untuk memverifikasi apakah pilihan dan permintaan Anda atau
                  layanan tambahan apa pun tercermin dalam harga yang
                  ditampilkan di Situs (seperti Informasi Hotel disediakan
                  sebelum konfirmasi pemesanan final) dan/atau dalam konfirmasi
                  email kupon. Tarif hotel resor dan biaya wajib lainnya (lihat
                  keterangan di bawah) dan pajak setempat, wisata, atau beban
                  hunian (jika ada) akan dibayar oleh Anda, dan umumnya tidak
                  diperhitungkan dalam Harga Hotel kecuali dinyatakan lain. Anda
                  bertanggung jawab untuk memverifikasi setiap penjelasan atau
                  kebijakan yang disediakan oleh hotel di Situs. Asuransi apa
                  pun tidak termasuk dalam harga, kecuali dinyatakan lain.
                  Standar reservasi kamar hotel adalah untuk satu hingga dua
                  tamu; biaya tambahan umumnya akan diperlukan untuk tempat
                  tidur tambahan. Hotel dapat menolak untuk menerima tamu
                  tambahan jika tidak diberitahukan sebelumnya.
                </ListItem>
                <ListItem>
                  Harap diketahui bahwa beberapa hotel dapat membebani Anda
                  biaya resor, tetapi mungkin memerlukan beban tambahan (atau
                  sejenisnya) untuk menggunakan layanan tertentu. Biaya resor
                  umumnya tidak termasuk dalam Harga Hotel; detail selengkapnya
                  akan dicantumkan dalam deskripsi hotel di Situs. Anda mungkin
                  juga akan dibebankan secara langsung oleh hotel untuk produk
                  dan layanan termasuk namun tidak terbatas pada: biaya tambahan
                  energi, biaya penanganan bagasi, biaya pengiriman surat kabar,
                  biaya keamanan dalam kamar, biaya perjalanan/wisata, atau
                  biaya untuk membersihkan kamar. Praktik menambahkan beban
                  hotel tambahan berada di luar kendali Golden Rama.
                </ListItem>
                <ListItem>
                  Pengeluaran insidental opsional dan beban pemakaian pribadi
                  (seperti yang dikeluarkan selama tinggal di Hotel) umunya
                  tidak termasuk dalam Harga Hotel. Beban tersebut termasuk
                  namun tidak terbatas pada: biaya parkir, biaya minibar di
                  dalam kamar, biaya telepon, layanan kamar, biaya makanan dan
                  minuman, biaya makan malam (gala) khusus, sewa film/film
                  sesuai permintaan (on-demand), dan biaya penggunaan Internet.
                  Selama puncak musim liburan tertentu, beberapa hotel mungkin
                  membuat makan malam spesial yang diwajibkan (seperti untuk
                  Tahun Baru, Natal, Tahun Baru Cina dan acara lainnya). Beban
                  tersebut tidak termasuk dalam tarif kamar, tapi akan
                  ditampilkan pada formulir pemesanan. Harap merujuk ke detail
                  selanjutnya yang tertera di bawah "Informasi Hotel",
                  "Persyaratan Pemesanan", "Kebijakan Pembatalan" atau judul
                  serupa di Situs. Jika Anda tidak yakin apakah ada atau tidak
                  ada beban yang dimasukkan dalam tarif, harap hubungi tim
                  layanan pelanggan kami untuk mengklarifikasi.
                </ListItem>
                <ListItem>
                  Beberapa hotel tertentu dapat menambahkan biaya untuk
                  transportasi atau perpindahan. Hal ini merupakan praktik yang
                  jamak untuk bepergian antar pulau (seperti Maladewa), agar
                  supaya mencapai hotel. Transportasi tersebut selalu diatur
                  oleh hotel, dan ditawarkan oleh atau atas nama hotel, yang
                  bertanggung jawab terhadap layanan transportasi. Anda setuju
                  bahwa Golden Rama tidak mengatur transportasi apa pun dan
                  tidak bertanggung jawab untuk layanan transportasi tersebut.
                  Anda menyetujui bahwa Golden Rama tidak bertanggung jawab atas
                  kualitas, keselamatan, frekuensi atau tingkat layanan jasa
                  transportasi, dan terhadap setiap kerugian atau kerusakan yang
                  mungkin diakibatkan dari penggunaan layanan transportasi
                  tersebut.
                </ListItem>
                <ListItem>
                  Dalam beberapa yurisdiksi, hotel mungkin diwajibkan untuk
                  memungut pajak hunian atau pajak kota setempat dari tamu
                  secara langsung. Otoritas pemerintah juga dapat menyatakan
                  pajak tambahan dan dapat mewajibkan hotel untuk memungut pajak
                  tersebut secara langsung. Anda setuju untuk membayar setiap
                  dan semua pajak/beban ke hotel secara langsung setelah keluar
                  hotel (checkout), kecuali ditentukan lain. Ketika Anda tidak
                  yakin, harap cek dengan hotel atau Layanan Pelanggan Golden
                  Rama mengenai biaya tambahan apa pun yang mungkin dicantumkan
                  dalam Harga Hotel.
                </ListItem>
              </UnorderedList>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end additional hotel price */}
          {/* start currency */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Mata Uang
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Pembayaran dilakukan dalam mata uang rupiah, dengan jumlah
                sesuai dengan yang tertera tanpa penanggungan biaya bank atau
                biaya lainnya oleh Golden Rama.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end currency */}
          {/* start cancellation */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Pembatalan
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Sehubungan dengan pembatalan yang dilakukan pengguna, maka Situs
                mungkin akan dapat menahan atau mengambil bagian dari jumlah
                yang dibayarkan untuk mengganti biaya yang telah dikeluarkan
                sehubungan dengan pembatalan yang terjadi. Pengguna diharapkan
                membaca dan mengerti syarat dan ketentuan yang ada pada hotel,
                maskapai penerbangan, dan agen travel.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end cancellation */}
          {/* start refund */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Ganti Rugi
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Pengguna bersedia membebaskan Golden Rama (karyawan, direktur,
                pemasok, anak perusahaan, usaha patungan, dan mitra hukum) dari
                setiap klaim atau permintaan, termasuk biaya pengacara yang
                wajar, dari dan terhadap semua kerugian dan biaya yang timbul
                dari pelanggaran syarat dan kondisi atau segala kegiatan yang
                terkait dengan account pengguna / keanggotaan karena tindakan
                kelalaian atau kesalahan.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end refund */}
          {/* start special request */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Permintaan Khusus
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Dalam hal terdapat permintaan khusus sehubungan dengan pemesanan
                (contohnya kamar boleh digunakan untuk merokok, bantuan kursi
                roda, perubahan nama, perubahan tanggal, perubahan penulisan
                nama, dan lain-lain), maka pengguna dapat menghubungi langsung
                maskapai penerbangan, hotel, atau agen travel yang ada, dan
                permintaan tersebut akan berdasarkan ketersediaan dan peraturan
                maskapai, hotel, Kereta Api Indonesia atau agen travel yang ada
                (sebagaimana berlaku).
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end special request */}
          {/* start order changes */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Perubahan Pemesanan dan Pembelian
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Harap dicatat bahwa persyaratan dan kondisi untuk perubahan
                reservasi dan pembelian bervariasi untuk setiap produk dan
                layanan. Anda TIDAK dapat mengubah pesanan atau pembelian secara
                online di Situs.
              </Box>

              <Box>&nbsp;</Box>

              <Box>
                Anda dapat mengubah pesanan atau pembelian dengan menghubungi
                kantor kami di (021) 2980 6000. Bila anda ingin mengubah
                reservasi, permintaan perubahan harus diajukan setidaknya tujuh
                (7) hari sebelum perjalanan atau layanan dimulai dan dapat
                dikenakan biaya administrasi yang Anda tanggung penuh. Harap
                dicatat bahwa perubahan tiket pesawat yang telah dikonfirmasi
                tidak dapat dilakukan.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end order changes */}
          {/* start product condition */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Syarat dan Kondisi Produk dan Layanan
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Produk dan layanan tertentu memiliki syarat dan kondisi khusus
                yang berlaku di samping Syarat dan Kondisi ini. Penting bagi
                Anda untuk mendapatkan dan membaca syarat dan ketentuan yang
                berlaku bagi produk-produk dan layanan tersebut karena adanya
                kemungkinan pengecualian atau pembatasan tanggung jawab, dan
                syarat dan ketentuan lainnya, termasuk pembatasan pada perubahan
                atau pembatalan.
              </Box>

              <Box>&nbsp;</Box>

              <Box>
                Beberapa persyaratan dan ketentuan untuk produk dan jasa
                tertentu dapat mencakup syarat dan kondisi yang tertera pada
                layar Anda dan bagian manapun dari Situs. Bila ada syarat dan
                kondisi untuk produk atau jasa tertentu yang tidak sesuai dengan
                dan Syarat dan Ketentuan ini, persyaratan dan kondisi untuk
                produk atau jasa tertentu itulah yang berlaku.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end product condition */}
          {/* start docs */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Paspor, Visa dan Informasi Kesehatan
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Banyak negara mewajibkan warga negara asing untuk mempunyai
                paspor yang berlaku setidaknya enam (6) bulan. Informasi ini
                serta informasi terkait lainnya yang diberikan oleh Golden Rama
                atau afiliasi lainnya, dan setiap link dalam Situs diberikan
                dengan itikad baik, dan harus diperlakukan sebagai pedoman saja.
                Paspor, visa (termasuk setiap dan semua visa transit) dan
                persyaratan kesehatan merupakan tanggung jawab dari setiap
                wisatawan. Setiap wisatawan bertanggung jawab untuk memastikan
                bahwa dokumentasi perjalanan yang dimiliki adalah benar. Golden
                Rama berhak untuk menolak setiap pemesanan atau pembelian dengan
                alasan apapun dan tidak bertanggung jawab atas kerugian,
                kerusakan atau kompensasi. Dalam peristiwa seperti itu, Golden
                Rama akan mengembalikan semua uang Anda yang digunakan dalam
                pembelian.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end docs */}
          {/* start force majeure */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Force Majeure
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Golden Rama tidak bertanggung jawab atas segala kegagalan
                transaksi yang mengakibatkan kerugian di pihak Pengguna yang
                diakibatkan karena Force Majeure. Kondisi yang dikategorikan
                sebagai Force Majeure adalah bencana alam (banjir, gempa bumi),
                epidemik, kerusuhan, pernyataan perang, perang, embargo,
                perubahan peraturan yang berlaku, petir, angin topan, mogok
                buruh, demonstrasi, kebangkrutan maskapai, dan sebagainya.
              </Box>

              <Box>&nbsp;</Box>

              <Box>
                Jika dalam kasus Force Majeure, Golden Rama tidak dapat
                memproses pesanan Anda, Golden Rama tidak akan bertanggung jawab
                atas kerugian yang disebabkan dengan cara apapun.
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end force majeure */}
          {/* start secrets */}
          <AccordionItem border="none">
            <AccordionButton justifyContent="space-between" px="24px" py="24px">
              <Heading fontSize={"md"} color="brand.blue.400">
                Modifikasi dan Perubahan Ketentuan Kerahasiaan
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel px="24px">
              <Box>&nbsp;</Box>

              <Box>
                Sewaktu-waktu Golden Rama mungkin merevisi Ketentuan Kerahasiaan
                ini untuk mencerminkan perubahan pada hukum, praktik kami dalam
                pengumpulan dan penggunaan Data Pribadi, fitur Situs kami, atau
                berbagai kemajuan teknologi. Bila kami membuat revisi yang
                mengubah cara kami mengumpulkan atau menggunakan Data Pribadi
                Anda, perubahan-perubahan tersebut akan dinyatakan pada
                Ketentuan Kerahasiaan ini dan pada bagian awal Kebijakan Privasi
                akan tertera tanggal efektif berlaku. Karena itu, Anda harus
                meninjau Ketentuan Kerahasiaan ini secara berkala, sehingga Anda
                mendapatkan informasi terbaru mengenai kebijakan dan praktik
                terkini kami. Golden Rama juga akan dengan jelas menampilkan
                perubahan materi semacam itu sebelum mengimplementasikan
                perubahan
              </Box>

              <Box>&nbsp;</Box>
            </AccordionPanel>
          </AccordionItem>
          {/* end secrets */}
        </Accordion>
      </Box>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Term & Conditions",
      },
    },
  };
};

export default TermsAndConditions;
