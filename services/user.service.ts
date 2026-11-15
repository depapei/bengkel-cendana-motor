import { ApiEndpoint } from "@/constants/api-endpoints";
import type { UserCreateInput, UserUpdateInput } from "@/schemas/user.schema";
import type { User } from "@/types/models";
import { createCrudService } from "./crud.service";

export const userService = createCrudService<User, User[], UserCreateInput, UserUpdateInput>({
  list: ApiEndpoint.Users,
  detail: ApiEndpoint.UserDetail,
});
