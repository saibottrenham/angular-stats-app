import { BaseModel } from "../shared/common-model";

export interface Tennant extends BaseModel {
    mobile: string;
    address: string;
    email: string;
}
