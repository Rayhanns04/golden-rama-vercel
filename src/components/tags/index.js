import {
  Badge,
  Box,
  HStack,
  Icon,
  Skeleton,
  SkeletonCircle,
  Stack,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const CustomTags = ({ notrounded, variant, fontSize, ...props }) => {
  return (
    <Tag
      {...props}
      px={"6px"}
      py={"2px"}
      rounded={notrounded ? "none" : "sm"}
      variant={"solid"}
      bg={`${variant == "danger" ? "alert.failed" : "brand.blue.400"}`}
      color={"white"}
      fontSize={fontSize || { base: "xs", md: "sm" }}
      textTransform={"capitalize"}
    >
      <Text dropShadow={"0px 2px 2px 0px rgba(0, 0, 0, 0.15)"}>
        {props.children ?? "Badge"}
      </Text>
    </Tag>
  );
};

export const CustomTagsOutlineIcon = ({
  icon,
  children = "",
  isLoading = false,
  ...props
}) => {
  return (
    <Tag px={0} bg={"transparent"}>
      {/* <SkeletonCircle isLoaded={!isLoading}> */}
      <Box mr={"10px"}>{icon ?? ""}</Box>
      <Skeleton isLoaded={!isLoading}>
        {/* </SkeletonCircle> */}
        <TagLabel
          color={props.color ?? "neutral.text.medium"}
          fontSize={{ base: "xs", md: "sm" }}
        >
          {children}
        </TagLabel>
      </Skeleton>
    </Tag>
  );
};
