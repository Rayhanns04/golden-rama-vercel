import { Box, Checkbox, HStack, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

export const CustomCheckbox = ({ values, item, field = null, ...props }) => {
  const { id, description, name } = item;
  return (
    <Checkbox
      alignItems={"flex-start"}
      flexDirection={"row-reverse"}
      isChecked={values && values.includes(id?.toString())}
      colorScheme={"brand.blue"}
      justifyContent={"space-between"}
      {...field}
      value={id}
    >
      <Stack marginInlineStart={"-0.5rem"} marginInlineEnd={"0.5rem"}>
        <HStack gap={1}>
          {item.image && (
            <Image
              src={item.image}
              alt={item.image}
              width={22}
              height={22}
              objectFit="contain"
            />
          )}
          <Text
            color={"neutral.text.high"}
            fontSize={{ baes: "md", md: "lg" }}
            fontWeight={!description ? "normal" : "bold"}
          >
            {name}
          </Text>
        </HStack>
        {description && (
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color={"neutral.text.medium"}
          >
            {description}
          </Text>
        )}
      </Stack>
    </Checkbox>
  );
};

export const CustomCheckboxFill = ({ form, field, value, label = value }) => {
  return (
    <Box as="label">
      <input type={"checkbox"} style={{ display: "none" }} {...field} />
      <Box
        bg={field.checked ? "brand.blue.400" : "gray.100"}
        rounded={"full"}
        cursor="pointer"
        _checked={{
          bg: "brand.blue.400",
          color: "white",
          borderColor: "brand.blue.400",
        }}
        color={field.checked && "white"}
        px={"16px"}
        py={"6px"}
      >
        {field.checked ? (
          <HStack fontSize={{ base: "sm", md: "md" }}>
            <Text>{label ?? value ?? ""}</Text>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.0002 8.93996L10.8602 11.8066C10.9857 11.9322 11.156 12.0027 11.3335 12.0027C11.5111 12.0027 11.6813 11.9322 11.8069 11.8066C11.9324 11.6811 12.0029 11.5108 12.0029 11.3333C12.0029 11.1558 11.9324 10.9855 11.8069 10.86L8.9402 7.99996L11.8069 5.13996C11.9324 5.01442 12.0029 4.84416 12.0029 4.66663C12.0029 4.48909 11.9324 4.31883 11.8069 4.19329C11.6813 4.06776 11.5111 3.99723 11.3335 3.99723C11.156 3.99723 10.9857 4.06776 10.8602 4.19329L8.0002 7.05996L5.1402 4.19329C5.07823 4.13081 5.00449 4.08121 4.92325 4.04736C4.84201 4.01352 4.75488 3.99609 4.66687 3.99609C4.57886 3.99609 4.49172 4.01352 4.41048 4.04736C4.32924 4.08121 4.25551 4.13081 4.19354 4.19329C4.13105 4.25527 4.08145 4.329 4.04761 4.41024C4.01376 4.49148 3.99634 4.57862 3.99634 4.66663C3.99634 4.75463 4.01376 4.84177 4.04761 4.92301C4.08145 5.00425 4.13105 5.07798 4.19354 5.13996L7.0602 7.99996L4.19354 10.86C4.13105 10.9219 4.08145 10.9957 4.04761 11.0769C4.01376 11.1581 3.99634 11.2453 3.99634 11.3333C3.99634 11.4213 4.01376 11.5084 4.04761 11.5897C4.08145 11.6709 4.13105 11.7447 4.19353 11.8066C4.25551 11.8691 4.32924 11.9187 4.41048 11.9526C4.49172 11.9864 4.57886 12.0038 4.66687 12.0038C4.75488 12.0038 4.84201 11.9864 4.92325 11.9526C5.00449 11.9187 5.07823 11.8691 5.1402 11.8066L8.0002 8.93996Z"
                fill="white"
              />
            </svg>
          </HStack>
        ) : (
          <HStack fontSize={{ base: "sm", md: "md" }}>
            <Text>{label ?? value ?? ""}</Text>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.33493 8.66451L7.33022 12.7139C7.33022 12.8914 7.40075 13.0617 7.52628 13.1872C7.65182 13.3127 7.82208 13.3833 7.99962 13.3833C8.17715 13.3833 8.34741 13.3127 8.47295 13.1872C8.59848 13.0617 8.66901 12.8914 8.66901 12.7139L8.6643 8.66451L12.7137 8.66922C12.8912 8.66922 13.0615 8.5987 13.187 8.47316C13.3125 8.34763 13.3831 8.17736 13.3831 7.99983C13.3831 7.82229 13.3125 7.65203 13.187 7.52649C13.0615 7.40096 12.8912 7.33043 12.7137 7.33043L8.6643 7.33515L8.66901 3.28578C8.66937 3.19777 8.6523 3.11057 8.61879 3.02919C8.58528 2.94781 8.53599 2.87388 8.47375 2.81164C8.41152 2.74941 8.33759 2.70012 8.25621 2.66661C8.17483 2.63309 8.08762 2.61603 7.99962 2.61639C7.91161 2.61603 7.8244 2.63309 7.74302 2.66661C7.66165 2.70012 7.58771 2.74941 7.52548 2.81164C7.46325 2.87388 7.41395 2.94781 7.38044 3.02919C7.34693 3.11057 7.32986 3.19778 7.33022 3.28578L7.33493 7.33515L3.28557 7.33043C3.19756 7.33007 3.11035 7.34714 3.02898 7.38065C2.9476 7.41416 2.87366 7.46346 2.81143 7.52569C2.7492 7.58792 2.69991 7.66186 2.66639 7.74324C2.63288 7.82461 2.61582 7.91182 2.61618 7.99983C2.61582 8.08783 2.63288 8.17504 2.66639 8.25642C2.69991 8.3378 2.7492 8.41173 2.81143 8.47397C2.87366 8.5362 2.9476 8.58549 3.02898 8.619C3.11035 8.65252 3.19756 8.66958 3.28557 8.66922L7.33493 8.66451Z"
                fill="#9A9A9A"
              />
            </svg>
          </HStack>
        )}
      </Box>
    </Box>
  );
};
export const CustomRadioFill = ({
  form,
  field,
  value,
  label = value,
  onClick = null,
  onChange = null,
  additionalconf = {},
}) => {
  return (
    <Box as="label">
      <input
        onChange={onChange}
        type={"radio"}
        style={{ display: "none" }}
        value={value}
        {...field}
      />
      <Box
        onClick={() => {
          if (onClick) onClick();
          else form.setFieldValue(field.name, field.value, false);
        }}
        bg={
          field.checked
            ? "brand.blue.400"
            : additionalconf?.unchecked?.bgColor || "gray.100"
        }
        rounded={"full"}
        cursor="pointer"
        _checked={{
          bg: "brand.blue.400",
          color: "white",
          borderColor: "brand.blue.400",
        }}
        border={additionalconf?.unchecked?.border || "none"}
        w={"fit-content"}
        color={field.checked && "white"}
        px={"16px"}
        py={"6px"}
      >
        {field.checked ? (
          <HStack fontSize={{ base: "sm", md: "md" }}>
            <Text>{label ?? value ?? ""}</Text>
          </HStack>
        ) : (
          <HStack fontSize={{ base: "sm", md: "md" }}>
            <Text>{label ?? value ?? ""}</Text>
          </HStack>
        )}
      </Box>
    </Box>
  );
};
