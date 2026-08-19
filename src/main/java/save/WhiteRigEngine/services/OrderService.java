package save.WhiteRigEngine.services;

import save.WhiteRigEngine.entities.*;
import save.WhiteRigEngine.exceptions.InsufficientStockException;
import save.WhiteRigEngine.repositories.*;
import save.WhiteRigEngine.entities.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ComponentRepository componentRepository; // <-- Nome corretto in base al tuo file

    @Transactional
    public Order placeOrder(String userEmail) {
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Carrello non trovato"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Il carrello è vuoto");
        }

        // Controllo preliminare su TUTTI gli articoli
        for (CartItem cartItem : cart.getItems()) {
            ComponentProduct comp = cartItem.getComponent();
            if (comp.getStockQuantity() < cartItem.getQuantity()) {
                throw new InsufficientStockException("Disponibilità insufficiente per il prodotto: " + comp.getName()
                        + " (Disponibili: " + comp.getStockQuantity() + ", Richiesti: " + cartItem.getQuantity() + ")");
            }
        }

        // Se i controlli passano, procediamo con la creazione dell'ordine
        Order order = new Order();
        order.setUserEmail(userEmail);
        order.setTotalPrice(BigDecimal.valueOf(cart.getTotalPrice()));

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            ComponentProduct comp = cartItem.getComponent();

            // Scalo la quantià
            comp.setStockQuantity(comp.getStockQuantity() - cartItem.getQuantity());
            componentRepository.save(comp);

            // Creo l'item dell'ordine
            OrderItem item = new OrderItem();
            item.setComponent(comp);
            item.setQuantity(cartItem.getQuantity());
            item.setPriceAtPurchase(comp.getPrice());
            item.setOrder(order);
            return item;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        orderRepository.save(order);

        // Svuoto il carrello
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);

        return order;
    }
}