import { Box, Stack, Typography } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import React from "react";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller, useWatch } from "react-hook-form";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetPostQuery, useNewPostMutation, useUpdatePostMutation } from "../../../api/post";

import NewTag from "../../Componets/NewTag";
import TagsSelect from "../../Componets/TagsSelect";
import { setSelectTags, setUserTags } from "../../Componets/tagSlice";
import { useTranslation } from "react-i18next";
import { MDEditor } from "../../Componets/MDEditor";

const ENABLE_COMMENT = 1;
const DISABLE_COMMENT = 2;

function Post({ post }) {
  const postId = post?.id;
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      postStatus: post?.status ? post?.status === "PUBLISHED" : true,
      enableComment: post?.enable_comment ? post?.enable_comment === ENABLE_COMMENT : true,
      title: post?.title || "",
      slug: post?.slug || "",
      summary: post?.summary || "",
      content: post?.content || "",
    },
  });
  const { postStatus, enableComment } = useWatch({ control });
  const [error, setError] = React.useState();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const tag = useSelector((state) => state.tag);
  const [newPost] = useNewPostMutation();
  const [updatePost] = useUpdatePostMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;
  const search = location.state?.from?.search;
  const handlePost = async (data, draft = "") => {
    const status = (draft || (postStatus ? "Published" : "Private")).toUpperCase();
    const tags = tag.selectTags;
    const new_post = {
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      tags,
      status,
      enable_comment: enableComment ? ENABLE_COMMENT : DISABLE_COMMENT,
    };
    try {
      let data;
      if (postId) {
        data = await updatePost({ postId, post: new_post }).unwrap();
      } else {
        data = await newPost(new_post).unwrap();
      }
      if (data?.msg === "OK") {
        setError(null);
        navigate(!!from ? `${from}${search}` : `/admin/post/${data.post.id}`);
      } else if (data?.msg === "error") {
        setError(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box>
      <Grid container spacing={1} sx={{ pt: 1 }}>
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="space-between" alignItems="stretch">
            <Grid item xs={12} md={6}>
              <Typography gutterBottom align="center" height={40} sx={{ textTransform: "capitalize" }}>
                {t("post")}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              md={4}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <FormControlLabel
                control={
                  <Controller
                    name="postStatus"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                      );
                    }}
                  />
                }
                labelPlacement="start"
                label={<Typography sx={{ minWidth: 80 }}>{postStatus ? t("published") : t("private")}</Typography>}
              />
              <FormControlLabel
                control={
                  <Controller
                    name="enableComment"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Switch {...field} checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                      );
                    }}
                  />
                }
                labelPlacement="start"
                label={<Typography>{enableComment ? t("enable comments") : t("disable comments")}</Typography>}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <Controller
            name="title"
            control={control}
            rules={{
              required: true,
              minLength: { value: 4, message: t("minLength error", { name: t("title"), length: 4 }) },
              maxLength: { value: 100, message: t("maxLength error", { name: t("title"), length: 100 }) },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="title"
                label={t("title")}
                required
                error={!!errors.title}
                helperText={!!errors.title && errors.title.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="slug"
            control={control}
            rules={{
              maxLength: { value: 50, message: t("maxLength error", { name: t("slug"), length: 50 }) },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="slug"
                label={t("slug")}
                fullWidth
                error={!!errors.slug}
                helperText={!!errors.slug && errors.slug.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="summary"
            control={control}
            rules={{
              maxLength: { value: 200, message: t("maxLength error", { name: t("summary"), length: 200 }) },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                id="summary"
                label={t("summary")}
                fullWidth
                multiline
                minRows={3}
                error={!!errors.summary}
                helperText={!!errors.summary && errors.summary.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={10}>
              <TagsSelect />
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: "flex" }}>
              <NewTag />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ minHeight: matches ? 500 : 300 }}>
          <Controller
            name="content"
            control={control}
            rules={{
              minLength: { value: 4, message: t("minLength error", { name: t("content"), length: 4 }) },
            }}
            render={({ field }) => {
              return (
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  ref={(node) => {
                    if (node && node.textarea) {
                      field.ref.current = node.textarea;
                    }
                  }}
                  height={"100%"}
                  previewOptions={{
                    rehypePlugins: [
                      [
                        rehypeSanitize,
                        {
                          ...defaultSchema,
                          attributes: {
                            ...defaultSchema.attributes,
                            span: [
                              // @ts-ignore
                              ...(defaultSchema.attributes.span || []),
                              // List of all allowed tokens:
                              ["className"],
                            ],
                            code: [["className"]],
                          },
                        },
                      ],
                    ],
                  }}
                />
              );
            }}
          />
        </Grid>
        <Grid item xs={12}>
          {errors.content ? <Typography color={"error"}>{errors.content.message}</Typography> : null}
          {error ? <Typography color={"error"}>{error}</Typography> : null}
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Button variant="outlined" onClick={handleSubmit(async (data) => handlePost(data, "draft"))}>
              {t("save draft")}
            </Button>
            <Button variant="contained" onClick={handleSubmit(async (data) => handlePost(data))}>
              {t("save post")}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function NewPost() {
  const { t } = useTranslation();
  const { postId } = useParams();
  const { data, isFetching } = useGetPostQuery(postId, {
    skip: !!!postId,
    refetchOnMountOrArgChange: true,
  });
  const post = data?.post || {};
  const tags = data?.tags || [];

  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(setSelectTags({ selectTags: tags }));
  }, [tags]);
  if (isFetching) return <Typography>{t("Loading...")}</Typography>;
  return <Post post={post} />;
}
