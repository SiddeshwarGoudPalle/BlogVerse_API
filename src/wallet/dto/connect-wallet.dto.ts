// wallet/dto/connect-wallet.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class ConnectWalletDto {
  @IsString()
  @IsNotEmpty()
  walletAddress: string;
}
