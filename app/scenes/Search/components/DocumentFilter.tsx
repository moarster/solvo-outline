import { CloseIcon } from "outline-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { StyledButton } from "~/components/FilterOptions";
import Tooltip from "~/components/Tooltip";
import Document from "~/models/Document";

type Props = {
  /** The currently selected document */
  document: Document;
  /** Callback to remove the document filter */
  onClick: React.MouseEventHandler;
};

export function DocumentFilter(props: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <Tooltip content={t("Remove document filter")} delay={350}>
        <StyledButton onClick={props.onClick} icon={<CloseIcon />} neutral>
          {props.document.title}
        </StyledButton>
      </Tooltip>
    </div>
  );
}
