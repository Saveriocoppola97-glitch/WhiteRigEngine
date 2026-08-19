package save.WhiteRigEngine.controllers;

import save.WhiteRigEngine.entities.Order;
import save.WhiteRigEngine.repositories.OrderRepository;
import save.WhiteRigEngine.services.OrderService;
import save.WhiteRigEngine.services.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PdfService pdfService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestParam String userEmail) {
        Order order = orderService.placeOrder(userEmail);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Order>> getUserOrders(@RequestParam String userEmail) {
        List<Order> orders = orderService.getOrdersByUserEmail(userEmail);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}/pdf")
    public ResponseEntity<byte[]> downloadOrderPdf(@PathVariable Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Ordine non trovato"));

        byte[] pdfBytes = pdfService.generateOrderPdf(order);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ordine_" + order.getId() + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}