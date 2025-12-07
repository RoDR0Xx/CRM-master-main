package com.tiendagorras.controller;

import com.tiendagorras.model.Gorra;
import com.tiendagorras.service.GorraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
//rober

/**
 * Controlador REST para manejar peticiones HTTP a /api/gorras.
 */
@RestController
@RequestMapping("/api/gorras")
@CrossOrigin(origins = "*") // NECESARIO para que Angular pueda acceder/OJOOOOOOOOOOOOOOOOOOOOOOO
public class GorraController {

    @Autowired
    private GorraService gorraService;

    // GET: /api/gorras
    @GetMapping
    public List<Gorra> getAllGorras() {
        return gorraService.findAll();
    }

    // GET: /api/gorras/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Gorra> getGorraById(@PathVariable Long id) {
        Optional<Gorra> gorra = gorraService.findById(id);
        return gorra.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: /api/gorras
    @PostMapping
    public Gorra createGorra(@RequestBody Gorra gorra) {
        return gorraService.save(gorra);
    }

    // PUT: /api/gorras/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Gorra> updateGorra(@PathVariable Long id, @RequestBody Gorra gorraDetails) {
        Optional<Gorra> optionalGorra = gorraService.findById(id);
        if (optionalGorra.isPresent()) {
            Gorra g = optionalGorra.get();
            g.setNombre(gorraDetails.getNombre());
            g.setMarca(gorraDetails.getMarca());
            g.setColor(gorraDetails.getColor());
            g.setPrecio(gorraDetails.getPrecio());
            g.setStock(gorraDetails.getStock());
            g.setImagenUrl(gorraDetails.getImagenUrl());
            
            return ResponseEntity.ok(gorraService.save(g));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: /api/gorras/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGorra(@PathVariable Long id) {
        if (gorraService.findById(id).isPresent()) {
            gorraService.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}