import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PayToViewDto } from './dto/pay-to-view.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
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
}
