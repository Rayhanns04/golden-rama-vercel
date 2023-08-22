import { Box, Button, Text } from "@chakra-ui/react";
import { memo, useCallback, useEffect, useState } from "react";
import trimText from "../../helpers/trimText";

const ExpandableHTML = memo(({ htmlText }) => {
  const [state, setState] = useState({
    showOriginalHTML: false,
    originalHTML: htmlText || "",
    trimmedHTML: trimText(htmlText, 0, 300, 500)[0],
  });

  const handleShowText = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      showOriginalHTML: !prevState.showOriginalHTML,
    }));
  }, [setState]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      originalHTML: htmlText || "",
      trimmedHTML: trimText(htmlText, 0, 300, 500)[0],
    }));
  }, [htmlText, setState]);

  return (
    <Box as="span">
      <Text
        as={"div"}
        fontSize={"sm"}
        dangerouslySetInnerHTML={{
          __html: !state.showOriginalHTML
            ? state.trimmedHTML
            : state.originalHTML,
        }}
      />
      <Button
        hidden={state.trimmedHTML === state.originalHTML}
        size="sm"
        variant="link"
        fontWeight="bold"
        colorScheme="slate"
        textDecoration="underline"
        onClick={handleShowText}
      >
        {state.showOriginalHTML ? "Show less" : "Read more"}
      </Button>
    </Box>
  );
});

ExpandableHTML.displayName = "ExpandableHTML";

export default ExpandableHTML;
