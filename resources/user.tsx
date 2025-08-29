import { Resource } from "@/types/resources";
import { UpdateUser } from "@/validation";

const user: Resource = {
  name: "User",
  name_plural: "Users",
  model: "user",
  resource: "users",
  advancedFilter: true,
  rules: UpdateUser,
  menuIcon: "",
  relations: ["interestedInGenders"],
  form: [
    { name: "nickname", type: "text", label: "Nickname" },
  ],
  list: [
    {
      name: "nickname",
      header: "Nickname",
    },
  ],
};
export { user };
