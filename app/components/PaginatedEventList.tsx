import * as React from "react";
import styled from "styled-components";
import EventListItem from "./EventListItem";
import PaginatedList from "~/components/PaginatedList";
import Document from "~/models/Document";
import Event from "~/models/Event";

type Props = {
  events: Event<Document>[];
  document: Document;
  fetch: (
    options: Record<string, any> | undefined
  ) => Promise<Event<Document>[]>;
  options?: Record<string, any>;
  heading?: React.ReactNode;
  empty?: React.ReactNode;
};

const PaginatedEventList = React.memo<Props>(function PaginatedEventList({
  empty,
  heading,
  events,
  fetch,
  options,
  document,
  ...rest
}: Props) {
  return (
    <StyledPaginatedList
      items={events}
      empty={empty}
      heading={heading}
      fetch={fetch}
      options={options}
      renderItem={(item: Event<Document>, index) => (
        <EventListItem
          key={item.id}
          event={item}
          document={document}
          latest={index === 0}
        />
      )}
      renderHeading={(name) => <Heading>{name}</Heading>}
      {...rest}
    />
  );
});

const StyledPaginatedList = styled(PaginatedList)`
  padding: 0 12px;
`;

const Heading = styled("h3")`
  font-size: 15px;
  padding: 0 4px;
`;

export default PaginatedEventList;
