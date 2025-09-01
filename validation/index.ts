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
  name: z.string('Prosim zadajte "Meno"'),
  email: z.string('Prosim zadajte "Email"'),
  dob: z.date('Prosim zadajte "Datum narodenia"'),
  gender: z.string('Prosim vyberte "Pohlavie"'),
  password: z.string('Prosim zadajte "Heslo"'),
  country: z.string('Prosim vyberte "Krajinu"'),
  region: z.string().optional(),
  city: z.string().optional(),
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
  name: stringValue,
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

const optionalString = z.string().optional();

export const UserInfo = z.object({
  gender: z.string('Pole "pohlavie" je povinne'), //., "Please enter a valid value")
  dob: z.date('Pole "datum narodenia" je povinne'),
  country: z.string('Pole "krajina" je povinne'),
  region: optionalString,
  city: optionalString,
  figure: optionalString,
  hair: optionalString,
  smoking: optionalString,
  drinking: optionalString,
  education: optionalString,
  religion: optionalString,
  job: optionalString,
  hobby: z.array(z.string()).optional().default([]),
  ["marital-status"]: optionalString,
  ["age-min"]: optionalString,
  ["age-max"]: optionalString,
});

export const ChangePassword = z.object({
  password: stringValue,
  confirmPassword: stringValue,
});

export type Rules =
  | typeof UserInfo
  | typeof RegisterUser
  | typeof LoginUser
  | typeof UpdateUser
  | typeof ChangePassword
  | typeof ResetPasswordRequest
  | typeof ContactForm
  | typeof ResetPassword
  | typeof CreateQuestion
  | typeof CreateQuestionChoice;
