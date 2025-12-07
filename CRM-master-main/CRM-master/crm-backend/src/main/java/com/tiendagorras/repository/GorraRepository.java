package com.tiendagorras.repository;

import com.tiendagorras.model.Gorra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Interfaz que proporciona los métodos CRUD para la entidad Gorra.
 */
@Repository
public interface GorraRepository extends JpaRepository<Gorra, Long> {
}