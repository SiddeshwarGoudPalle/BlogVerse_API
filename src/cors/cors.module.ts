import { Module } from '@nestjs/common';
import { CorsInterceptor } from './cors.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({})
export class CorsModule {
    providers: CorsInterceptor
}
