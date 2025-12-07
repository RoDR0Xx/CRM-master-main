package com.tiendagorras.service;

import com.tiendagorras.model.Gorra;
import com.tiendagorras.repository.GorraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Lógica de negocio para Gorras.
 */
@Service
public class GorraService {

    @Autowired
    private GorraRepository gorraRepository;

    public List<Gorra> findAll() {
        return gorraRepository.findAll();
    }

    public Optional<Gorra> findById(Long id) {
        return gorraRepository.findById(id);
    }

    public Gorra save(Gorra gorra) {
        return gorraRepository.save(gorra);
    }

    public void deleteById(Long id) {
        gorraRepository.deleteById(id);
    }
}