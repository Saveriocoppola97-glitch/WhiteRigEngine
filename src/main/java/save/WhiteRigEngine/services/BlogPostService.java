package save.WhiteRigEngine.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import save.WhiteRigEngine.entities.BlogPost;
import save.WhiteRigEngine.exceptions.ResourceNotFoundException;
import save.WhiteRigEngine.repositories.BlogPostRepository;

import java.util.List;

@Service
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;

    @Autowired
    public BlogPostService(BlogPostRepository blogPostRepository) {
        this.blogPostRepository = blogPostRepository;
    }

    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAllByOrderByCreatedAtDesc();
    }

    public BlogPost getPostById(Long id) {
        return blogPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Articolo blog non trovato con ID: " + id));
    }

    public BlogPost savePost(BlogPost post) {
        return blogPostRepository.save(post);
    }

    public void deletePost(Long id) {
        BlogPost post = getPostById(id);
        blogPostRepository.delete(post);
    }
}
