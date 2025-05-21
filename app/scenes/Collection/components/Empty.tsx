import { observer } from "mobx-react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Fade from "~/components/Fade";
import Flex from "~/components/Flex";
import Text from "~/components/Text";
import Collection from "~/models/Collection";

type Props = {
  /** The collection to display the empty state for. */
  collection: Collection;
};

function EmptyCollection({ collection }: Props) {
  const collectionName = collection ? collection.name : "";

  return (
    <Fade>
      <Centered column>
        <Text as="p" type="secondary">
          <Trans
            defaults="<em>{{ collectionName }}</em> doesn’t contain any
                    documents yet."
            values={{
              collectionName,
            }}
            components={{
              em: <strong />,
            }}
          />
        </Text>
      </Centered>
    </Fade>
  );
}

const Centered = styled(Flex)`
  text-align: center;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  max-width: 380px;
  height: 50vh;
`;

export default observer(EmptyCollection);
