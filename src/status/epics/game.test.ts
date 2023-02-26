import { test } from "vitest";
import { createDependencyRegistrar } from "@/utils/dependency-registrar";
import { Dependencies } from "@/dependencies";

test("test epic", async () => {
  const registrar = createDependencyRegistrar<Dependencies>();
});
