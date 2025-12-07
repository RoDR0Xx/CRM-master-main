package com.tiendagorras.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty; 

/**
 * Entidad que representa una Gorra en la base de datos.
 * Incluye mapeos JSON (@JsonProperty) para compatibilidad con el frontend.
 */
@Entity
@Data 
public class Gorra {

    // --- 1. PROPIEDADES PERSISTENTES (CAMPOS DE LA DB) ---
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mapeo de nombres: Java (nombre) -> JSON (name)
    @JsonProperty("name")
    private String nombre; 
    
    private String marca;
    
    private String color;
    
    // Mapeo de nombres: Java (precio) -> JSON (price)
    @JsonProperty("price")
    private Double precio; 
    
    private Integer stock;
    
    // Mapeo de nombres: Java (imagenUrl) -> JSON (imageUrl)
    @JsonProperty("imageUrl")
    private String imagenUrl; 

    
    // --- 2. GETTERS CALCULADOS PARA EL JSON (NO PERSISTENTES) ---

    @JsonProperty("type")
    public String getType() {
        // Usa lógica simple basada en el nombre para asignar el tipo
        if (nombre != null && (nombre.toLowerCase().contains("plana") || nombre.toLowerCase().contains("snapback"))) {
            return "planas";
        }
        if (nombre != null && nombre.toLowerCase().contains("vintage")) {
            return "vintage";
        }
        return "clasicas"; 
    }

    @JsonProperty("typeName")
    public String getTypeName() {
        String type = getType();
        if (type.equals("planas")) return "Planas / Snapback";
        if (type.equals("vintage")) return "Vintage / Desgastada";
        return "Clásica / Deportiva";
    }

    @JsonProperty("description")
    public String getDescription() {
        // Genera una descripción dinámica
        return "Estilo " + getTypeName() + ", marca " + marca + ". ¡Disponible en stock!";
    }
    
    @JsonProperty("colorName")
    public String getColorName() {
        // Capitaliza el nombre del color para mostrarlo mejor
        if (color == null || color.isEmpty()) return "Único";
        return color.substring(0, 1).toUpperCase() + color.substring(1).toLowerCase();
    }
    
    @JsonProperty("emoji")
    public String getEmoji() {
        // Asignar emojis de gorras
        if (getType().equals("planas")) {
            return "🧢"; // Gorra de béisbol (plana)
        } else if (getType().equals("vintage")) {
            return "👒"; // Sombrero (para vintage/ajustable)
        } else {
            return "⚾"; // Gorra de béisbol (clásica)
        }
    }
}