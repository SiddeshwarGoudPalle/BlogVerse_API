// wallet/wallet.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly databaseService: DatabaseService) {}

  async connectWallet(userEmail: string, connectWalletDto: ConnectWalletDto) {
    const user = await this.databaseService.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.databaseService.user.update({
      where: { id: user.id },
      data: { walletAddress: connectWalletDto.walletAddress }
    });

    return {
      message: 'Wallet connected successfully.',
      wallet: {
        user_id: updatedUser.id,
        wallet_address: updatedUser.walletAddress,
        status: 'connected'
      }
    };
  }
}
