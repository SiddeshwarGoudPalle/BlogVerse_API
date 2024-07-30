import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service'; // Adjust import path as needed
import { PayToViewDto } from './dto/pay-to-view.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly database: DatabaseService) {}

  async payToView(paymentDto: PayToViewDto): Promise<PaymentResponseDto> {
    const { userId, blogId, amount } = paymentDto;

    // Check if the blog exists
    const blog = await this.database.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog) {
      throw new NotFoundException('Blog not found');
    }

    // Check if the user exists
    const user = await this.database.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the user is the author
    if (blog.authorId === userId) {
      return {
        message: 'Access granted. You are the author of this blog.',
        access: {
          blogId,
          accessGranted: true,
        },
      };
    }

    // Check if the user has already paid for this blog
    const existingPayment = await this.database.payment.findFirst({
      where: {
        userId: userId,
        blogId: blogId,
      },
    });

    if (existingPayment) {
      return {
        message: 'You already have access to this blog.',
        access: {
          blogId,
          accessGranted: true,
        },
      };
    }

    // Check if the blog is free and the amount is greater than zero
    if (blog.price === 0 && amount > 0) {
      // Create a payment record as a tip
      await this.database.payment.create({
        data: {
          userId,
          blogId,
          amount,
          type: 'tip', // Consider this as a tip since the blog is free
        },
      });

      return {
        message: 'Thanks for supporting the Author.',
        access: {
          blogId,
          accessGranted: true, // Grant access since the blog is free
        },
      };
    }

    // Check if the amount is sufficient for paid blogs
    if (amount < blog.price) {
      throw new BadRequestException('Payment failed. Insufficient amount.');
    }

    // Create payment record for paid blogs
    await this.database.payment.create({
      data: {
        userId,
        blogId,
        amount,
        type: 'purchase',
      },
    });

    return {
      message: 'Payment successful. You now have access to the blog.',
      access: {
        blogId,
        accessGranted: true,
      },
    };
  }
}
