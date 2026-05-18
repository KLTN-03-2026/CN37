public interface IRefundService
{
    Task CreateRefundRequestAsync(int userId, int orderId, CancelPaidOrderRequest request);
    Task<List<RefundRequest>> GetAllRefundRequestsAsync();
    Task ConfirmRefundAsync(int refundId);
    Task RejectRefundAsync(int refundId, string reason);
}