export interface Cost {
    id: string;
    userId?: string;
    name: string;
    frequency: 'one-time' | 'weekly' | 'monthly' | 'bi-weekly';
    amount: number;
    receipt?: string;
    paymentDate?: Date;
    created: Date;
    lastUpdated: Date
}
