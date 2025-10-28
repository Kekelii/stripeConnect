import type { Result, Wallet } from '../global.js';
import type { DeleteResult } from 'mongoose';
declare class User {
    constructor();
    getUser(userId: string): Promise<import("../global.js").User & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    createUserWallet(userId: string, customerId: string, connectedAccountId: string): Promise<{
        data: import("mongoose").Document<unknown, {}, Wallet, {}, import("mongoose").DefaultSchemaOptions> & Wallet & Required<{
            _id: import("mongoose").Schema.Types.ObjectId;
        }> & {
            __v: number;
        };
        error: null;
    }>;
    updateWallet(userId: string, walletUpdate: Wallet): Promise<{
        data: (import("mongoose").Document<unknown, {}, Wallet, {}, import("mongoose").DefaultSchemaOptions> & Wallet & Required<{
            _id: import("mongoose").Schema.Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        error: null;
    }>;
    deleteWallet(userId: string): Promise<Result<DeleteResult>>;
    generateTernantBrokerId(): {
        ternateId: string;
        brokerId: string;
    };
}
declare const _default: User;
export default _default;
//# sourceMappingURL=userWallet.d.ts.map