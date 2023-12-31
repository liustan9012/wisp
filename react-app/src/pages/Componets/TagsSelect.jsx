import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";

import { setSelectTags, setUserTags } from "./tagSlice";

import PropTypes from "prop-types";
import { useGetTagsQuery } from "../../api/tag";
import { useTranslation } from "react-i18next";

function TagsComponent({ isLoading, ChangeTags, reqUserTags }) {
  const { t } = useTranslation();
  const tag = useSelector((state) => state.tag);
  const [open, setOpen] = React.useState(false);
  return (
    <Stack>
      <Autocomplete
        multiple
        disableCloseOnSelect
        id="select-tags"
        options={tag?.tags || []}
        onChange={ChangeTags}
        getOptionLabel={(tag) => tag.name}
        value={tag?.selectTags || []}
        loading={isLoading}
        open={open}
        onOpen={() => {
          setOpen(true);
          reqUserTags();
        }}
        onClose={() => {
          setOpen(false);
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
    </Stack>
  );
}

TagsComponent.propTypes = {
  isLoading: PropTypes.bool,
  ChangeTags: PropTypes.func,
  reqUserTags: PropTypes.func,
};

export default function TagsSelect() {
  const dispatch = useDispatch();
  const { isLoading, refetch } = useGetTagsQuery();

  const reqUserTags = async () => {
    const { data } = await refetch();
    dispatch(
      setUserTags({
        tags: data.tags,
      }),
    );
  };
  const ChangeTags = (e, value) => {
    dispatch(setSelectTags({ selectTags: value }));
  };

  return <TagsComponent {...{ isLoading, ChangeTags, reqUserTags }} />;
}
