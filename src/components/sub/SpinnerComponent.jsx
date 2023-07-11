import React from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

const SpinnerComponent = () => {
  return (
    <div className="flex items-center justify-center mt-8">
      <ClipLoader color="#2C74B3" loading={true} css={spinnerStyles} />
    </div>
  );
};

const spinnerStyles = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export default SpinnerComponent;
