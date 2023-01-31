import * as yup from 'yup';

const editCommentSchema = yup
  .object({
    editComment: yup.string().required('Comment is required'),
  })
  .required();
const createCommentSchema = yup
  .object({
    comment: yup.string().required('Comment is required'),
  })
  .required();

export { editCommentSchema, createCommentSchema };
