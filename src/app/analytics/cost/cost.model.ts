import { BaseModel } from "../../shared/common-model";


export interface Cost extends BaseModel {
    frequency: 'one-time' | 'weekly' | 'monthly' | 'bi-weekly';
    amount: number;
    paymentDate?: {seconds: number, nanoseconds: number};
}
