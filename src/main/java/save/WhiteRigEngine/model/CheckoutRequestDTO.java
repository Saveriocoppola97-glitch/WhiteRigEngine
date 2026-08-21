package save.WhiteRigEngine.model;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequestDTO {
    private String userEmail;
    private List<CartItemDTO> items;

    @Data
    public static class CartItemDTO {
        private Long componentId;
        private int quantity;
    }
}
