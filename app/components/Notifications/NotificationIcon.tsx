import { observer } from "mobx-react";
import { SubscribeIcon } from "outline-icons";
import styled from "styled-components";
import Relative from "../Sidebar/components/Relative";
import { s } from "@shared/styles";
import useStores from "~/hooks/useStores";

const NotificationIcon = () => {
  const { notifications } = useStores();
  const count = notifications.approximateUnreadCount;

  return (
    <Relative style={{ height: 24 }}>
      <SubscribeIcon />
      {count > 0 && <Badge />}
    </Relative>
  );
};

const Badge = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${s("accent")};
  top: 0;
  right: 0;
`;

export default observer(NotificationIcon);
