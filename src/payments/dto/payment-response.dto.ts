export class PaymentResponseDto {
  message: string;
  access: {
    blogId: string;
    accessGranted: boolean;
  };
}
