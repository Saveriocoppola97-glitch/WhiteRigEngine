package save.WhiteRigEngine.services;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import save.WhiteRigEngine.entities.Order;
import save.WhiteRigEngine.entities.OrderItem;
import save.WhiteRigEngine.entities.User;
import save.WhiteRigEngine.repositories.UserRepository;
import java.io.ByteArrayOutputStream;
import java.util.Optional;

@Service
public class PdfService {

    @Autowired
    private UserRepository userRepository;

    public byte[] generateOrderPdf(Order order) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Titolo
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph title = new Paragraph("WhiteRigEngine - Conferma Ordine #" + order.getId(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));

            // Recuperiamo nome, cognome ed email dell'utente
            String customerInfo = order.getUserEmail();
            Optional<User> optionalUser = userRepository.findByEmail(order.getUserEmail());

            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                customerInfo = user.getName() + " " + user.getSurname() + " (" + user.getEmail() + ")";
            }

            // Dettagli cliente, data e stato
            document.add(new Paragraph("Cliente: " + customerInfo));
            document.add(new Paragraph("Data Ordine: " + order.getOrderDate()));
            document.add(new Paragraph("Stato: " + order.getStatus()));
            document.add(new Paragraph("--------------------------------------------------------------------------------"));

            // Lista Prodotti
            document.add(new Paragraph("Articoli acquistati:"));
            for (OrderItem item : order.getItems()) {
                String line = "- " + item.getComponent().getName()
                        + " | Qt: " + item.getQuantity()
                        + " | Prezzo: €" + item.getPriceAtPurchase();
                document.add(new Paragraph(line));
            }

            document.add(new Paragraph("--------------------------------------------------------------------------------"));

            // Totale
            Font totalFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            document.add(new Paragraph("Totale Complessivo: €" + order.getTotalPrice(), totalFont));
            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Errore durante la generazione del PDF", e);
        }
        return out.toByteArray();
    }
}