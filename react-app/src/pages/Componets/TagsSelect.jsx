import * as React from "react"
import Autocomplete from "@mui/material/Autocomplete"
import CircularProgress from "@mui/material/CircularProgress"
import Stack from "@mui/material/Stack"
import TextField from "@mui/material/TextField"
import { useTranslation } from "react-i18next"

import { useTags } from "../../api/tag"
import { useTagStore } from "../../store"

function TagsComponent({
  tags,
  selectTags,
  isLoading,
  ChangeTags,
  reqUserTags,
}) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Autocomplete
        multiple
        disableCloseOnSelect
        id="select-tags"
        options={tags}
        onChange={ChangeTags}
        getOptionLabel={(tag) => tag.name}
        value={selectTags}
        loading={isLoading}
        open={open}
        fullWidth
        onOpen={() => {
          setOpen(true)
          reqUserTags()
        }}
        onClose={() => {
          setOpen(false)
        }}
        isOptionEqualToValue={(tag, value) => tag.name === value.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("tag")}
            // placeholder={t("tag")}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </>
  )
}

export default function TagsSelect(props) {
  const setUserTags = useTagStore((state) => state.setUserTags)
  const setSelectTags = useTagStore((state) => state.setSelectTags)
  const tags = useTagStore((state) => state.tags)
  const selectTags = useTagStore((state) => state.selectTags)
  const { isLoading, mutate } = useTags()

  const reqUserTags = async () => {
    const data = await mutate()
    setUserTags(data.tags)
  }
  const ChangeTags = (e, value) => {
    setSelectTags(value)
  }

  return (
    <Stack {...props}>
      <TagsComponent
        {...{ tags, selectTags, isLoading, ChangeTags, reqUserTags }}
      />
    </Stack>
  )
}
