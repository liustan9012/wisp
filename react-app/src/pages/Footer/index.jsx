import * as React from "react"
import { Link, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"

export default function Footer(props) {
  const { t } = useTranslation()
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{
        mt: 4,
        mb: 4,
        flex: "0 0 auto",
        flexGrow: 0,
      }}
      {...props}
    >
      <Link color="inherit" href={"/"}>
        {t("home")}
      </Link>
      {`  © ${new Date().getFullYear()} `}
      {`Powered by `}
      <Link color="inherit" href="https://github.com/liustan9012/wisp">
        {"github"}
      </Link>
    </Typography>
  )
}
