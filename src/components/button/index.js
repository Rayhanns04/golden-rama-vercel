import {
  Button,
  IconButton,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  createWishList,
  getWishListBySlug,
  deleteWishList,
} from "../../services/wishlist.service";
import { mapToWishListCard } from "../../helpers";
import Share from "../../../public/svg/icons/share.svg";
import LoveIcon from "../../../public/svg/icons/love.svg";
import LoveRedIcon from "../../../public/svg/icons/love-red.svg";
import { CustomDrawer } from "../drawer";
import CustomModal from "../modal";

export const CustomOrangeFullWidthButton = ({
  children,
  isoutlined,
  ...props
}) => {
  return (
    <Button
      w={props.w ?? "full"}
      // mt={props.mt ?? "24px"}
      // py={props.py ?? "12px"}
      fontSize={props.fontSize ?? { base: "xs", md: "sm" }}
      textColor={props.textColor ?? (isoutlined && "brand.orange.400")}
      bg={props.bg ?? (isoutlined ? "transparent" : "brand.orange.400")}
      border={props.border ?? (isoutlined && "2px")}
      borderColor={props.borderColor ?? (isoutlined && "brand.orange.400")}
      colorScheme={!props.colorScheme ?? (isoutlined && "brand.orange")}
      isLoading={props.isLoading}
      {...props}
    >
      {children ?? ""}
    </Button>
  );
};

export const CustomFilterButton = ({
  onSubmit = null,
  onReset = null,
  children,
  notrounded = false,
  isOpen,
  onOpen,
  onClose,
  footer,
  title,
  drawer = null,
  hidefooter,
  ...props
}) => {
  const isDesktop = useBreakpointValue(
    { base: false, md: true },
    { ssr: false }
  );
  return (
    <>
      {isDesktop ? (
        <CustomModal
          drawer={drawer}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          onSubmit={onSubmit}
          onReset={onReset}
          title={title}
          footer={footer}
          notrounded={notrounded}
          hidefooter={hidefooter}
          {...props}
        >
          {children}
        </CustomModal>
      ) : (
        <CustomDrawer
          drawer={drawer}
          isOpen={isOpen}
          onOpen={onOpen}
          onClose={onClose}
          onSubmit={onSubmit}
          onReset={onReset}
          title={title}
          footer={footer}
          hidefooter={hidefooter}
          notrounded={notrounded}
          {...props}
        >
          {children}
        </CustomDrawer>
      )}
    </>
  );
};

export const ShareButton = ({
  url = null,
  title = "Golden Rama",
  text = null,
}) => {
  const handleClick = () => {
    navigator.canShare &&
      navigator.share &&
      navigator
        .share({ url, title, text })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
  };
  return (
    <IconButton
      size={"sm"}
      rounded={"full"}
      icon={<Share />}
      bg={"white"}
      color={"neutral.text.medium"}
      colorScheme={"whiteAlpha"}
      onClick={handleClick}
    />
  );
};

export const WishlistButton = ({ data, type, slug }) => {
  const queryClient = useQueryClient();
  const customer = useSelector((state) => state.authReducer.user);
  const jwt = useSelector((state) => state.authReducer.jwt);
  const toast = useToast();
  const { data: wishlist, refetch } = useQuery(
    ["wishlist", slug],
    () => getWishListBySlug(slug, customer.id, jwt),
    { enabled: !!customer.id }
  );
  const mutationCreate = useMutation(createWishList);
  const mutationDelete = useMutation(deleteWishList);

  const handleClick = () => {
    if (wishlist) {
      return mutationDelete.mutate(
        {
          id: wishlist.id,
          jwt,
        },
        {
          onSuccess: (data) => {
            queryClient.invalidateQueries(["wishlist", slug]);
          },
          onError: () => {
            refetch();
          },
        }
      );
    }
    const wishListData = mapToWishListCard(data, type, slug);
    mutationCreate.mutate(
      { data: { product: wishListData, type, customer: customer.id }, jwt },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries(["wishlist", slug]);
        },
        onError: () => {
          toast({
            title: "Gagal menambahkan ke wishlist",
            description: "Pastikan anda sudah login",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
  };
  return (
    <IconButton
      isDisabled={!customer.id}
      isLoading={mutationCreate.isLoading || mutationDelete.isLoading}
      onClick={handleClick}
      size={"sm"}
      rounded={"full"}
      icon={wishlist ? <LoveRedIcon /> : <LoveIcon />}
      bg={"white"}
      color={"neutral.text.medium"}
      colorScheme={"whiteAlpha"}
    />
  );
};
