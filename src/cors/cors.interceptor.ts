import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';

@Injectable()
export class CorsInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any>   
 {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();   


    const allowedOrigins = ['https://blogverse-team-t.vercel.app/','http://localhost:4000']// Replace with your config key
    const origin = request.header('Origin');

    if (allowedOrigins && allowedOrigins.includes(origin)) {
      response.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Other CORS headers as needed
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return next.handle()
//  next.handle().pipe(
//       map(data => {
//         // You can modify the data here if needed
//         return data;
//       }),
//     );
  }
}