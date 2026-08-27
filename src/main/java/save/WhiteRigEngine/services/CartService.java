package save.WhiteRigEngine.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import save.WhiteRigEngine.entities.Cart;
import save.WhiteRigEngine.entities.CartItem;
import save.WhiteRigEngine.entities.ComponentProduct;
import save.WhiteRigEngine.repositories.CartRepository;
import save.WhiteRigEngine.repositories.ComponentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ComponentRepository componentRepository;

    public Cart getOrCreateCart(String userEmail) {
        return cartRepository.findByUserEmail(userEmail)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUserEmail(userEmail);
                    return cartRepository.save(newCart);
                });
    }

    // Aggiungo componente al carrello
    public Cart addComponentToCart(String userEmail, Long componentId, int quantity) {
        Cart cart = getOrCreateCart(userEmail);

        ComponentProduct component = componentRepository.findById(componentId)
                .orElseThrow(() -> new RuntimeException("Component not found with id: " + componentId));

        // Verifico se componente già presente in carrello
        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getComponent().getId().equals(componentId))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            CartItem newItem = new CartItem();
            newItem.setComponent(component);
            newItem.setQuantity(quantity);
            newItem.setCart(cart);
            cart.getItems().add(newItem);
        }

        calculateAndSetTotalPrice(cart);
        return cartRepository.save(cart);
    }

    // Aggiungo un'intera lista di componenti al carrello
    public Cart addBuildToCart(String userEmail, List<Long> componentIds) {
        Cart cart = getOrCreateCart(userEmail);

        for (Long componentId : componentIds) {
            ComponentProduct component = componentRepository.findById(componentId)
                    .orElseThrow(() -> new RuntimeException("Component not found with id: " + componentId));

            Optional<CartItem> existingItemOpt = cart.getItems().stream()
                    .filter(item -> item.getComponent().getId().equals(componentId))
                    .findFirst();

            if (existingItemOpt.isPresent()) {
                CartItem existingItem = existingItemOpt.get();
                existingItem.setQuantity(existingItem.getQuantity() + 1);
            } else {
                CartItem newItem = new CartItem();
                newItem.setComponent(component);
                newItem.setQuantity(1);
                newItem.setCart(cart);
                cart.getItems().add(newItem);
            }
        }

        calculateAndSetTotalPrice(cart);
        return cartRepository.save(cart);
    }

    // Logica di calcolo del prezzo totale
    private void calculateAndSetTotalPrice(Cart cart) {
        java.math.BigDecimal total = cart.getItems().stream()
                .map(item -> item.getComponent().getPrice()
                        .multiply(java.math.BigDecimal.valueOf(item.getQuantity())))
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);

        cart.setTotalPrice(total.doubleValue());
    }

    // Rimuovo item dal carrello
    public Cart removeItemFromCart(String userEmail, Long cartItemId) {
        Cart cart = getOrCreateCart(userEmail);

        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));

        calculateAndSetTotalPrice(cart);
        return cartRepository.save(cart);
    }

    // Pulisco il carrello (usare dopo il checkout)
    public void clearCart(String userEmail) {
        Cart cart = getOrCreateCart(userEmail);
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);
    }

}
