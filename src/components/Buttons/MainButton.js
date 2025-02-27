import { Button as MuiButton } from "@mui/material";

const MainButton = ({ children, ...props }) => (
  <MuiButton data-text={children} {...props}>
    <span>{children}</span>
  </MuiButton>
);

export default MainButton;
