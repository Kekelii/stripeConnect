import { destination } from 'pino';
export declare function TransferBetweenWallets(_originUserId: string, _destinationUserId: string, amount: number): Promise<{
    originAccount: string;
    destination: typeof destination;
    amount: number;
    platform: number;
}>;
//# sourceMappingURL=main.d.ts.map