package save.WhiteRigEngine.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import save.WhiteRigEngine.entities.BlogPost;
import save.WhiteRigEngine.services.BlogPostService;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
public class BlogPostController {

    private final BlogPostService blogPostService;

    @Autowired
    public BlogPostController(BlogPostService blogPostService) {
        this.blogPostService = blogPostService;
    }

    @GetMapping
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        return ResponseEntity.ok(blogPostService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogPostService.getPostById(id));
    }

    @PostMapping
    public ResponseEntity<BlogPost> createPost(@RequestBody BlogPost post) {
        return ResponseEntity.status(HttpStatus.CREATED).body(blogPostService.savePost(post));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody BlogPost post) {
        return ResponseEntity.ok(blogPostService.updatePost(id, post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogPostService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
