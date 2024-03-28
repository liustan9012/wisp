import React, { lazy, Suspense } from "react"
import { Typography } from "@mui/material"
import MarkdownPreview from "@uiw/react-markdown-preview"
import MDEditor from "@uiw/react-md-editor"
import { useTranslation } from "react-i18next"

// const MarkdownPreviewLazy = lazy(() => import("@uiw/react-markdown-preview"));

export const Preview = (props) => {
  //     const { t } = useTranslation();
  //     return (
  //       <Suspense fallback={<Typography>{t("Loading...")}</Typography>}>
  //         <MarkdownPreviewLazy {...props} />
  //       </Suspense>
  //     );
}

export { MarkdownPreview, MDEditor }

// const LazyMDEditor = lazy(() => import("@uiw/react-md-editor"));

// export const MDEditor = (props) => {
//   const { t } = useTranslation();
//   return (
//     <Suspense fallback={<Typography>{t("Loading...")}</Typography>}>
//       <LazyMDEditor {...props} />
//     </Suspense>
//   );
// };
