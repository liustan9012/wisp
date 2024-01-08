import { Box, Button, CardContent, CardHeader, Divider, Link, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link as RouteLink, useLocation, useParams } from "react-router-dom";

import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectCurrentAuth } from "../../api/authSlice";
import { useNewCommentMutation } from "../../api/comment";
import StringAvatar from "../../Componets/StringAvatar";
import { timeConverter } from "../../utils/datetime";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

export default function CommentList({ comments }) {
  const { t } = useTranslation();
  const comment = useSelector((state) => state.comment);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { content: "" } });
  const { postId } = useParams();
  const location = useLocation();

  const [newComment] = useNewCommentMutation();

  const auth = useSelector(selectCurrentAuth);

  const handleReply = async (data) => {
    console.log(data);
    const response = await newComment({
      content: data.content,
      postId,
    }).unwrap();
    if (response?.msg !== "OK") {
      setError("content", { type: "server", message: response.error });
    } else {
      setValue("content", "");
    }
  };
  return (
    <Box>
      <Divider flexItem />
      {comments?.length >= 1 ? (
        comments.map((c) => (
          <Box key={c.id}>
            <CardHeader
              sx={{ p: 1 }}
              title={
                <Stack direction={"row"} alignItems="center">
                  <StringAvatar name={c.username} alt={c.username}></StringAvatar>
                  <Typography variant="h6" sx={{ pl: 1 }}>
                    {c.username}{" "}
                  </Typography>
                  <Typography sx={{ ml: 2, pb: 0 }}>{timeConverter(c.created_at)}</Typography>
                </Stack>
              }
            />
            <CardContent sx={{ p: 0, pl: 2, pb: 1 }}>
              <Typography>{c.content}</Typography>
            </CardContent>
            <Divider flexItem />
          </Box>
        ))
      ) : (
        <Typography sx={{ mb: 1, pt: 1 }}>{t("no comments yet")}</Typography>
      )}
      <TextField
        required
        id="comment"
        label={t("comment")}
        multiline
        fullWidth
        rows={4}
        sx={{ mt: 1 }}
        error={!!errors.content}
        {...register("content", {
          required: true,
          minLength: { value: 4, message: t("minLength error", { name: t("comment"), length: 4 }) },
          maxLength: { value: 1000, message: t("maxLength error", { name: t("comment"), length: 1000 }) },
        })}
        helperText={!!errors.content && errors.content?.message}
      />
      <Stack direction="row">
        {!auth.username ? (
          <Stack direction={"row"} alignItems="stretch" sx={{ mt: 2 }}>
            <Link to="/signin" state={{ from: location }} underline="none" variant="h6" component={RouteLink}>
              {t("signin")}
            </Link>
            <Button sx={{ ml: 1 }} variant="outlined" onClick={handleSubmit(handleReply)} disabled>
              {t("reply")}
            </Button>
          </Stack>
        ) : (
          <Button onClick={handleSubmit(handleReply)} variant="outlined" sx={{ mt: 2 }}>
            {t("reply")}
          </Button>
        )}
      </Stack>
    </Box>
  );
}

CommentList.propTypes = {
  comments: PropTypes.array,
};
