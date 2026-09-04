package save.WhiteRigEngine.services;

import save.WhiteRigEngine.entities.*;
import save.WhiteRigEngine.exceptions.InsufficientStockException;
import save.WhiteRigEngine.model.CheckoutRequestDTO;
import save.WhiteRigEngine.repositories.*;
import save.WhiteRigEngine.entities.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ComponentRepository componentRepository;

    @Transactional
    public Order placeOrder(String userEmail) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Carrello non trovato"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Il carrello è vuoto");
        }

        for (CartItem cartItem : cart.getItems()) {
            ComponentProduct comp = cartItem.getComponent();
            if (comp.getStockQuantity() < cartItem.getQuantity()) {
                throw new InsufficientStockException("Disponibilità insufficiente per il prodotto: " + comp.getName()
                        + " (Disponibili: " + comp.getStockQuantity() + ", Richiesti: " + cartItem.getQuantity() + ")");
            }
        }

        Order order = new Order();
        order.setUserEmail(userEmail);
        order.setTotalPrice(BigDecimal.valueOf(cart.getTotalPrice()));

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            ComponentProduct comp = cartItem.getComponent();
            comp.setStockQuantity(comp.getStockQuantity() - cartItem.getQuantity());
            componentRepository.save(comp);
            OrderItem item = new OrderItem();
            item.setComponent(comp);
            item.setQuantity(cartItem.getQuantity());
            item.setPriceAtPurchase(comp.getPrice());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        orderRepository.save(order);
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);

        return order;
    }

    @Transactional
    public Order placeOrderWithItems(CheckoutRequestDTO checkoutRequest) {
        String userEmail = checkoutRequest.getUserEmail();
        List<CheckoutRequestDTO.CartItemDTO> itemsDto = checkoutRequest.getItems();

        if (itemsDto == null || itemsDto.isEmpty()) {
            throw new RuntimeException("Il carrello è vuoto");
        }

        for (CheckoutRequestDTO.CartItemDTO itemDto : itemsDto) {
            ComponentProduct comp = componentRepository.findById(itemDto.getComponentId())
                    .orElseThrow(() -> new RuntimeException("Componente non trovato con ID: " + itemDto.getComponentId()));

            if (comp.getStockQuantity() < itemDto.getQuantity()) {
                throw new InsufficientStockException("Disponibilità insufficiente per il prodotto: " + comp.getName()
                        + " (Disponibili: " + comp.getStockQuantity() + ", Richiesti: " + itemDto.getQuantity() + ")");
            }
        }

        Order order = new Order();
        order.setUserEmail(userEmail);

        BigDecimal calculatedTotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CheckoutRequestDTO.CartItemDTO itemDto : itemsDto) {
            ComponentProduct comp = componentRepository.findById(itemDto.getComponentId()).get();

            comp.setStockQuantity(comp.getStockQuantity() - itemDto.getQuantity());
            componentRepository.save(comp);
            BigDecimal itemPrice = comp.getPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));
            OrderItem item = new OrderItem();
            item.setComponent(comp);
            item.setQuantity(itemDto.getQuantity());
            item.setPriceAtPurchase(comp.getPrice());
            item.setOrder(order);
            calculatedTotal = calculatedTotal.add(itemPrice);
            orderItems.add(item);
        }

        order.setItems(orderItems);
        order.setTotalPrice(calculatedTotal);

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserEmail(String userEmail) {
        return orderRepository.findByUserEmail(userEmail);
    }
}