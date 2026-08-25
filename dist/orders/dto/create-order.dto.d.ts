export declare class OrderItemDto {
    menuItemId: string;
    quantity: number;
    specialInstructions?: string;
}
export declare class CreateOrderDto {
    restaurantId: string;
    tableId: string;
    items: OrderItemDto[];
    paymentMethod?: string;
}
