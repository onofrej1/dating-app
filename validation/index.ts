import { z } from "zod";

const many2many = z
  .array(z.object({ value: z.string(), label: z.string() }))
  .transform((arr) => {
    return arr.map((v) => Number(v.value));
  })
  .optional()
  .default([]);

/*const many2many = z
  .array(z.object({ value: z.number(), label: z.string() }))
  .transform((arr) => {
    return arr.map((v) => v.value);
  })
  .optional()
  .default([]);
*/
/*const richText = z
  .object({ type: z.string(), content: z.array(z.any()) })
  .transform((obj) => {
    return JSON.stringify(obj);
  });*/

//const numberValue = z.coerce.number();
//const dateValue = z.coerce.date();
const stringValue = z.string().trim().min(1);
const emailValue = z.string().email();
const idValue = z.number().optional();
const numberValue = z.coerce.number();

export const RegisterUser = z.object({
  //firstName: stringValue,
  name: stringValue,
  email: emailValue,
  password: stringValue,
});

export const LoginUser = z.object({
  email: emailValue,
  password: stringValue,
});

export const CreateQuestion = z.object({
  id: idValue,
  question: stringValue,
  questionType: stringValue,
});

export const CreateQuestionChoice = z.object({
  id: idValue,
  title: stringValue, 
  displayOrder: numberValue,
  questionId: z.coerce.number(),
});

export const UpdateUser = z.object({
  id: z.string().optional(),
  nickname: stringValue,
  interestedInGenders: many2many,
});

export const ContactForm = z.object({
  email: emailValue,
  subject: stringValue,
  message: stringValue,
});

export const ResetPasswordRequest = z.object({
  email: emailValue,
});

export const ResetPassword = z.object({
  password: emailValue,
});

export const ChangePassword = z.object({
  password: stringValue,
  confirmPassword: stringValue,
});

export type Rules =
  | typeof RegisterUser
  | typeof LoginUser
  | typeof UpdateUser
  | typeof ChangePassword  
  | typeof ResetPasswordRequest
  | typeof ContactForm
  | typeof ResetPassword
  | typeof CreateQuestion
  | typeof CreateQuestionChoice;
