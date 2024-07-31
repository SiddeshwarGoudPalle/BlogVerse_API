import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [DatabaseModule, AuthModule, BlogModule, PaymentsModule, WalletModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
