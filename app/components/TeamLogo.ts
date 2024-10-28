import styled from "styled-components";
import { Avatar } from "./Avatar";
import { s } from "@shared/styles";

const TeamLogo = styled(Avatar)`
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px ${s("divider")};
  border: 0;
`;

export default TeamLogo;
