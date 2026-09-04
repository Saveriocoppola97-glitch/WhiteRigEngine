package save.WhiteRigEngine.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import save.WhiteRigEngine.entities.Cart;
import save.WhiteRigEngine.services.CartService;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    // Ottengo il carrello dell'utente
    @GetMapping
    public ResponseEntity<Cart> getCart(Principal principal) {
        String userEmail = principal.getName();
        Cart cart = cartService.getOrCreateCart(userEmail);
        return ResponseEntity.ok(cart);
    }

    // Aggiungo un componente al carrello
    @PostMapping("/add")
    public ResponseEntity<Cart> addComponent(
            Principal principal,
            @RequestParam Long componentId,
            @RequestParam int quantity) {
        String userEmail = principal.getName();
        Cart updatedCart = cartService.addComponentToCart(userEmail, componentId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    // Aggiunge un'intera build di componenti in blocco
    @PostMapping("/add-build")
    public ResponseEntity<Cart> addBuild(
            Principal principal,
            @RequestBody List<Long> componentIds) {
        String userEmail = principal.getName();
        Cart updatedCart = cartService.addBuildToCart(userEmail, componentIds);
        return ResponseEntity.ok(updatedCart);
    }

    // Rimuovo un articolo specifico dal carrello dell'utente autenticato
    @DeleteMapping("/item/{cartItemId}")
    public ResponseEntity<Cart> removeItem(
            Principal principal,
            @PathVariable Long cartItemId) {
        String userEmail = principal.getName();
        Cart updatedCart = cartService.removeItemFromCart(userEmail, cartItemId);
        return ResponseEntity.ok(updatedCart);
    }
}