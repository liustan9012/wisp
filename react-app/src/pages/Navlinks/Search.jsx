import * as React from "react"
import { Button, Grid, ImageListItem, TextField } from "@mui/material"
import Box from "@mui/material/Box"

const searchButtons = [
  {
    src: "/imgs/baidu.ico",
    alt: "baiduLogo",
    url: "https://www.baidu.com",
    search_path: "/baidu?wd=",
  },
  {
    src: "/imgs/bing.ico",
    alt: "bingLogo",
    url: "https://cn.bing.com",
    search_path: "/search?q=+",
  },
  {
    src: "/imgs/google.ico",
    alt: "googleLogo",
    url: "https://www.google.com/",
    search_path: "/search?q=",
  },
]

export const SearchButtons = () => {
  const [inputText, setInputText] = React.useState("")
  const handleSearch = ({ url, search_path }) => {
    const addres = inputText ? url + search_path + inputText : url
    window.open(addres)
  }

  return (
    <>
      <Grid
        container
        direction={"row"}
        spacing={1}
        sx={{
          mt: 6,
          mb: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item xs={12} md={4} sx={{ p: 0 }}>
          <Box
            component={"form"}
            onSubmit={() => handleSearch(searchButtons[2])}
            sx={{ p: 2 }}
          >
            <TextField
              fullWidth
              autoFocus
              id={"search"}
              value={inputText}
              type="search"
              onChange={(e) => setInputText(e.target.value)}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", p: 2 }}>
            {searchButtons.map(({ src, alt, url, search_path }, index) => (
              <Button
                key={src}
                variant="outlined"
                sx={{ ml: index > 0 ? 2 : 0, marginTop: 0, height: 60 }}
                fullWidth
                onClick={() => handleSearch({ url, search_path })}
                startIcon={
                  <ImageListItem
                    sx={{
                      width: 24,
                      height: 24,
                      mg: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <img src={src} alt={alt} />
                  </ImageListItem>
                }
              >
                {" "}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
