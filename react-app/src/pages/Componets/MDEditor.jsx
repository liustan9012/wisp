import { Typography } from "@mui/material";
import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";

import MarkdownPreview from "@uiw/react-markdown-preview"
import MDEditor from "@uiw/react-md-editor"


// const MarkdownPreviewLazy = lazy(() => import("@uiw/react-markdown-preview"));


export const Preview = (props) => {

//     const { t } = useTranslation();
//     return (
//       <Suspense fallback={<Typography>{t("Loading...")}</Typography>}>
//         <MarkdownPreviewLazy {...props} />
//       </Suspense>
//     );
  };

export {MarkdownPreview, MDEditor}

// const LazyMDEditor = lazy(() => import("@uiw/react-md-editor"));

// export const MDEditor = (props) => {
//   const { t } = useTranslation();
//   return (
//     <Suspense fallback={<Typography>{t("Loading...")}</Typography>}>
//       <LazyMDEditor {...props} />
//     </Suspense>
//   );
// };

