// blog.controller.ts
import { Controller, Post, Get, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayToViewDto } from './dto/pay-to-view.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard'; // Adjust the import path as needed

@ApiTags('payments')
@ApiBearerAuth() // Indicates that the endpoint requires authentication
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('pay-to-view')
  @HttpCode(HttpStatus.OK) // Optional: Set HTTP status code to 200 OK
  @ApiOperation({ summary: 'Pay to view a blog' }) // Description of the operation
  @ApiResponse({ status: 200, description: 'Payment successful. Access granted to the blog.', type: PaymentResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request, e.g., insufficient balance or already paid' })
  @ApiResponse({ status: 404, description: 'Not found, e.g., user or blog not found' })
  @UseGuards(JwtAuthGuard) // Apply JWT authentication guard
  async payToView(@Body() paymentDto: PayToViewDto): Promise<PaymentResponseDto> {
    return this.paymentsService.payToView(paymentDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all payments made by a user' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiParam({ name: 'userId', required: true, description: 'User ID to retrieve payments for' })
  @UseGuards(JwtAuthGuard) // Apply JWT authentication guard
  async getUserPayments(@Param('userId') userId: string) {
    return this.paymentsService.getUserPayments(userId);
  }
}
