// wallet/wallet.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserEmail } from '../common/decorators/user-email.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('connect')
  @ApiOperation({ description: 'Connect a wallet to a user account.', summary: 'Connect Wallet.' })
  async connectWallet(@UserEmail() userEmail: string, @Body() connectWalletDto: ConnectWalletDto) {
    return this.walletService.connectWallet(userEmail, connectWalletDto);
  }
}
