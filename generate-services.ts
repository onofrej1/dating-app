import { replaceInFileSync } from "replace-in-file";
import fs from "fs-extra";
import path from "path";

type GenerateApiParams = {
  name: string;
  table: string;
  optionField: string;
}

const generateService = (params: GenerateApiParams) => {
  const { name, table, optionField } = params;
  const templatePath = path.join(__dirname, "generator", "templates");
  const destinationPath = path.join(process.cwd(), "services");

  console.log(`Generating api for "${name}" resource:`);
  fs.copySync(templatePath, destinationPath);

  fs.rename(
    path.join(destinationPath, "service.ts.tpl"),
    path.join(destinationPath, name + ".ts")
  );

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[TABLE\]/g,
    to: table,
  });

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[NAME\]/g,
    to: name,
  });

  replaceInFileSync({
    files: path.join(destinationPath, "**", "*"),
    from: /\[OPTION_FIELD\]/g,
    to: optionField,
  });
};

//const defaultModels = [{ model: "user", resource: "users", relations: [] }];

const models = [
  { name: 'category', table: 'categories', optionField: 'name' },
  { name: "tag", table: "tags", optionField: 'title' },
  { name: "user", table: "user", optionField: 'name' },
  //{ name: "post", table: "posts" },
];
for (const model of [...models /*, ...defaultModels*/]) {
  generateService(model);
}
