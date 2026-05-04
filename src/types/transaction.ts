export type Transaction = {
    id: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
    note?: string;
};

