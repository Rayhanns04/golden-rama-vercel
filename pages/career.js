import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  Center,
  Container,
  Heading,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import Layout from "../src/components/layout";
import ChevronLeftDarkIcon from "../public/svg/icons/chevron-left-dark.svg";
import LinkedinDarkIcon from "../public/svg/socmeds/linkedin-dark.svg";

const Career = ({ meta }) => {
  return (
    <Layout pagetitle="Career" meta={meta}>
      <Center
        mx="-24px"
        bgImage="url('/png/bg-career.png')"
        bgRepeat="no-repeat"
        bgSize="cover"
        bgPosition="center"
        minH="414px"
      >
        <Container
          position="relative"
          maxW={{ md: "container.lg", lg: "container.xl" }}
          px="24px"
        >
          <Text
            color="white"
            fontFamily="heading"
            fontSize="xl"
            fontWeight="bold"
            mb="24px"
          >
            Mulai Career Anda dengan Golden Rama
          </Text>
          <Text color="neutral.color.line.secondary" fontSize="sm" mb="50px">
            Gabung dengan kami untuk meningkatkan kemamuanmu
          </Text>
          <Button
            as={Link}
            href="https://www.linkedin.com/company/pt-golden-rama-express/"
            target="_blank"
            rel="noopener noreferrer"
            w="full"
            bg="white"
            flexDir="row"
            justifyContent="space-between"
            size="lg"
          >
            <HStack spacing="16px">
              <LinkedinDarkIcon />
              <Text color="neutral.text.high" fontSize="xl" fontWeight="bold">
                Cari di Linkedin
              </Text>
            </HStack>
            <ChevronLeftDarkIcon />
          </Button>
        </Container>
      </Center>
      <Container
        maxW={{ md: "container.lg", lg: "container.xl" }}
        px={0}
        py="32px"
      >
        <Heading
          color="brand.blue.400"
          fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
          fontWeight="bold"
          textTransform="uppercase"
          mb="50px"
        >
          INFORMASI PEKERJAAN DI GOLDEN RAMA
        </Heading>
        <Accordion allowToggle allowMultiple={true} mx="-24px">
          <AccordionItem bg="white" rounded={{ md: "md" }} border="none">
            <AccordionButton p="24px" justifyContent="space-between">
              <Heading color="brand.blue.400" fontSize="lg" fontWeight="bold">
                CRM Manager
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text fontSize="sm" as="div">
                <ReactMarkdown>{`**Job Description**
             
&nbsp;

Responsible for managing Golden Rama Tours & Travels CRM ensuring the company can make the most out of marketing opportunities it offers.

&nbsp;

**Duties of a CRM Manager include:**

&nbsp;

 - Planning and delivering CRM strategies across the company encouraging customer retention and customer loyalty.
 - Deciding on the CRM platform structure and architecture ensures it works seamlessly across the organization and captures all required information at key points in the customer life cycle.
 - Manage Golden Rama Tours & Travel database include others brand
 - Customer journey mapping analyzing touch points with the organization and maximizing commercial opportunities.
 - Working closely with all departments to ensure the CRM works effectively for all aspects of the company.
 - Analyzing data to inform business development and campaigns
 - Driving CRM initiatives and overseeing execution of campaigns
 - Acting as a liaison between the IT and CRM team to identify consumer segments to be targeted for campaigns
 - Partnering with different stakeholders to keep them informed about upcoming data management initiatives
 - Maintaining and improving data management processes and accuracy
 - Monitor and maximize customer lifetime value strategies ensuring maximum profitability.
 - Ensuring the database is segmented effectively for targeted marketing activities.
 - Developing testing strategies for all aspects of the CRM to ensure the most effective approach for the company and its products.

&nbsp;

**The ideal background of a CRM Manager:**


&nbsp;

Extensive experience of direct and digital marketing ideally in a travel/ hospitality industry. Strong background in customer acquisition, re-engagement and retention strategies. A confident and articulate communicator capable of inspiring strong collaboration in an organization.

&nbsp;

Have a proven
 - You have a diploma/degree in Sales, Marketing, Business Administration or related field.
 - You have solid prior experience in a similar role.
 - You are analytical, data-driven and well-versed with Excel.
 - You are detail-oriented and thrive in dynamic and fast-paced working environments.
 - You are a strong team player and comfortable working in matrix environments.

 &nbsp;

CV dapat dikirimkan ke email
[hrd@goldenrama.com](mailto:hrd@goldenrama.com)`}</ReactMarkdown>
              </Text>
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem bg="white" rounded={{ md: "md" }} border="none">
            <AccordionButton p="24px" justifyContent="space-between">
              <Heading color="brand.blue.400" fontSize="lg" fontWeight="bold">
                Business Process Manager
              </Heading>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Text fontSize="sm" as="div">
                <ReactMarkdown>{`Golden Rama Tours & Travel is more than just a workplace. It's a dynamic environment centered around the people, where you grow to be the best version of yourselves, creating positive impacts on society, and empower people to fulfill their traveling aspirations. Innovation, execution, and continuous development are the traits that Golden Rama holds on consistently.

Discover what it's really like to unlock your skills and potential through innovation at our business:

&nbsp;

**Key Recruitment**

&nbsp;

 - Design, plan and manage end to end business processes for Golden Rama Business ecosystem and project related, in parallel develops, documents and maintains an effective set of policy and procedures consistent with program guidelines.
 - Oversee and project the potential inquiry, request and/or complaint from customers related with the new product and/or process that's going to be launched, communicate it to the product manager and/or shareholder to get a suitable answer and/or solution.
 - Manage the business process team to ensure that the performance of the existing products is optimal as well as working on the long-term stabilization and maintenance of the company's way of working.
 - Applies process improvement methodologies and principles based on operations metrics and data to conduct Business process reengineering (simplification), make recommendations on product, tools, techniques or processes to enhance service quality
 - Develop strong working relationships with cross functional teams to develop process, product knowledge, FAQ, and training before product launch and manage process change to minimize the impact of incident and ensure the process is implemented including
 - Liaising with the product teams to deliver additional customer operations-related requirements to be incorporated into the product development as well as communicate and track the progress to support the effective functioning of the product and/or process.
 - Coordinate or conduct, as required, the execution of functional and systems tests required for system fixes, patches, enhancements, upgrades, implementations and security to ensure the product are secure, reliable and functions as intended.
 - Develop and implement appropriate tools and methods to perform standard investigation and problem-solving techniques and to ensure appropriate adherence to quality documents

&nbsp;

**Requirement**

&nbsp;

 - Minimum University Degree for any major discipline, preferably Business Administration or similar field
 - Minimum 5 - 7 years experience in Business Process, Contact Center Operations, Complaint Management & Recovery, Customer Service or product development role
 - Having an experience in tourism industry, hospitality or travel agent
 - Experience in managing day-today relationships and an ability to proactively engage internal and external customers
 - Must be able to work under specific, defined, and narrow time constraints
 - Must conduct themselves in a professional manner at all times including: appearance, communication, ethics set forth in the Company Code of Conduct.
 - Extensive experience in working in a Service Assurance / Delivery environment and implementing service management strategy and processes

CV dapat dikirimkan ke email
[hrd@goldenrama.com](mailto:hrd@goldenrama.com)`}</ReactMarkdown>
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </Layout>
  );
};

export const getStaticProps = async () => {
  return {
    props: {
      meta: {
        title: "Career",
      },
    },
  };
};

export default Career;
