package save.WhiteRigEngine.controllers;

import save.WhiteRigEngine.entities.Order;
import save.WhiteRigEngine.services.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestParam String userEmail) {
        Order order = orderService.placeOrder(userEmail);
        return ResponseEntity.ok(order);
    }
}