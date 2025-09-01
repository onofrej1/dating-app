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
  form: [
    { name: "name", type: "text", label: "Name" },
  ],
  list: [
    {
      name: "name",
      header: "name",
    },
  ],
};
export { user };
