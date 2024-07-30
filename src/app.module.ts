import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [DatabaseModule, AuthModule, BlogModule, PaymentsModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
