import styled from "styled-components";
import TextField from "@material-ui/core/TextField";

export const CustomTextField = styled(TextField)`
  .MuiOutlinedInput-notchedOutline {
    border-color: rgba(0, 0, 0, 0.23);
  }
  .MuiOutlinedInput-root.Mui-focused {
    .MuiOutlinedInput-notchedOutline {
      border-color: rgba(0, 0, 0, 0.23);
    }
  }
`;
