package save.WhiteRigEngine.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import save.WhiteRigEngine.entities.Cart;
import save.WhiteRigEngine.services.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Ottengo il carrello dell'utente
    @GetMapping
    public ResponseEntity<Cart> getCart(@RequestParam String userEmail) {
        Cart cart = cartService.getOrCreateCart(userEmail);
        return ResponseEntity.ok(cart);
    }

    // Aggiungo un componente al carrello
    @PostMapping("/add")
    public ResponseEntity<Cart> addComponent(
            @RequestParam String userEmail,
            @RequestParam Long componentId,
            @RequestParam int quantity) {
        Cart updatedCart = cartService.addComponentToCart(userEmail, componentId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    // Rimuovo un articolo specifico dal carrello
    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<Cart> removeItem(
            @RequestParam String userEmail,
            @PathVariable Long cartItemId) {
        Cart updatedCart = cartService.removeItemFromCart(userEmail, cartItemId);
        return ResponseEntity.ok(updatedCart);
    }
}
