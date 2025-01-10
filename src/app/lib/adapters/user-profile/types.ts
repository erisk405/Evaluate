import { Department, ImageType, PrefixType, Role, RoleRequest } from "@/types/interface";

export interface ProfileDetailType {
    id: string | null;
    prefix?: PrefixType | null;
    name: string | null;
    email: string | null;
    image: ImageType | null;
    role: Role | null;
    phone: string | null;
    department?: Department | null;
    roleRequests?: RoleRequest[] | null;
}